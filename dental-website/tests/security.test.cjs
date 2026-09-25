process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: 'CommonJS',
  moduleResolution: 'node',
  esModuleInterop: true,
  target: 'ES2020',
});
require('ts-node/register/transpile-only');

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { canAccessArea, getAccessFailureStatus } = require('../src/lib/security/role-policy');
const { sanitizePostHtml } = require('../src/lib/security/post-html');
const { publicPostWhere } = require('../src/lib/security/post-visibility');
const { readJsonBody, RequestBodyError } = require('../src/lib/security/request-body');
const { leadIntakeSchema } = require('../src/lib/security/lead-intake');
const { csvCell } = require('../src/lib/security/csv');
const {
  MAX_IMAGE_BYTES,
  validateImageUpload,
  isSafeUploadFilename,
} = require('../src/lib/security/image-upload');

test('role policy separates anonymous, viewer, editor, and admin access', () => {
  assert.equal(getAccessFailureStatus(null, 'leads'), 401);
  assert.equal(getAccessFailureStatus('viewer', 'leads'), 403);
  assert.equal(getAccessFailureStatus('editor', 'leads'), 403);
  assert.equal(getAccessFailureStatus('editor', 'content'), null);
  assert.equal(getAccessFailureStatus('admin', 'leads'), null);
  assert.equal(canAccessArea('admin', 'analytics'), true);
  assert.equal(canAccessArea('editor', 'users'), false);
  assert.equal(canAccessArea('unknown', 'content'), false);
});

test('post sanitizer removes scripts, event handlers, and unsafe links but keeps formatting', () => {
  const safe = sanitizePostHtml(
    '<p><strong>Welcome</strong><script>alert(1)</script><img src="https://example.test/a.png" onerror="alert(1)"><a href="javascript:alert(1)">click</a></p>'
  );
  assert.match(safe, /<strong>Welcome<\/strong>/);
  assert.doesNotMatch(safe, /script|onerror|javascript:/i);
  assert.match(safe, /<img src="https:\/\/example\.test\/a\.png" \/>/);
});

test('public post lookup requires published status and a reached publication time', () => {
  const now = new Date('2026-09-25T12:00:00.000Z');
  assert.deepEqual(publicPostWhere(now), {
    status: 'published',
    publishedAt: { lte: now },
  });
});

test('lead intake requires contact consent and bounds the honeypot and attribution', () => {
  const valid = {
    name: 'Test Person',
    email: 'Person@example.test',
    phone: '+55 (11) 99999-1234',
    acceptTerms: true,
    source: 'website',
    utm_campaign: 'spring-1',
  };
  const parsed = leadIntakeSchema.parse(valid);
  assert.equal(parsed.email, 'person@example.test');
  assert.equal(leadIntakeSchema.safeParse({ ...valid, acceptTerms: false }).success, false);
  assert.equal(leadIntakeSchema.safeParse({ ...valid, acceptTerms: undefined }).success, false);
  assert.equal(leadIntakeSchema.safeParse({ ...valid, website: 'bot-field' }).success, true);
  assert.equal(leadIntakeSchema.safeParse({ ...valid, name: 'x'.repeat(101) }).success, false);
  assert.equal(leadIntakeSchema.safeParse({ ...valid, source: 'x'.repeat(101) }).success, false);
});

test('bounded JSON reader rejects invalid and oversized bodies', async () => {
  await assert.rejects(
    readJsonBody(new Request('http://localhost', { method: 'POST', headers: { 'content-length': '10' }, body: '1234567890' }), 8),
    (error) => error instanceof RequestBodyError && error.status === 413,
  );
  await assert.rejects(
    readJsonBody(new Request('http://localhost', { method: 'POST', body: '{bad' }), 16),
    (error) => error instanceof RequestBodyError && error.status === 400,
  );
  const streamed = new Request('http://localhost', {
    method: 'POST',
    body: new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('123456')); controller.close(); } }),
    duplex: 'half',
  });
  await assert.rejects(
    readJsonBody(streamed, 4),
    (error) => error instanceof RequestBodyError && error.status === 413,
  );
});

test('CSV cells escape quotes and neutralize spreadsheet formulas', () => {
  assert.equal(csvCell('O"Connor'), '"O""Connor"');
  assert.equal(csvCell('  =HYPERLINK("https://bad")'), '"\'  =HYPERLINK(""https://bad"")"');
  assert.equal(csvCell('-1'), '"\'-1"');
});

test('image uploads require an allowed signature, matching MIME, size, and UUID name', () => {
  const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.equal(validateImageUpload('image/png', png.length, png).extension, '.png');
  assert.equal(validateImageUpload('image/svg+xml', 15, new TextEncoder().encode('<svg></svg>')), null);
  assert.equal(validateImageUpload('image/jpeg', png.length, png), null);
  assert.equal(validateImageUpload('image/png', MAX_IMAGE_BYTES + 1, new Uint8Array(MAX_IMAGE_BYTES + 1)), null);
  assert.equal(isSafeUploadFilename('123e4567-e89b-12d3-a456-426614174000.png'), true);
  assert.equal(isSafeUploadFilename('../123e4567-e89b-12d3-a456-426614174000.svg'), false);
});

test('sensitive request handlers log fixed event categories instead of request values', () => {
  const sourceFiles = [
    '../src/lib/auth.ts',
    '../src/app/api/leads/route.ts',
    '../src/app/actions/leads.ts',
    '../src/app/actions/assign-lead.ts',
    '../src/app/actions/lead-history.ts',
    '../src/app/actions/get-new-leads-count.ts',
    '../src/app/api/admin/users/route.ts',
    '../src/app/api/admin/users/[id]/route.ts',
  ];
  for (const relativePath of sourceFiles) {
    const source = fs.readFileSync(path.join(__dirname, relativePath), 'utf8');
    const logCalls = source.match(/console\.(?:log|warn|error)\s*\([^;]*\);/gs) || [];
    for (const logCall of logCalls) {
      assert.match(logCall, /^console\.(?:log|warn|error)\(\s*["']+[A-Za-z0-9_ -]*["']+\s*\);?$/);
    }
  }
});
