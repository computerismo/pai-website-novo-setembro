# Phase 1 security and privacy baseline

## Admin role matrix

| Role | Dashboard | Leads and exports | Analytics and SEO | User management | Blog and media |
|---|---:|---:|---:|---:|---:|
| `admin` | Yes | Yes | Yes | Yes | Yes |
| `editor` | No | No | No | No | Yes |
| `viewer` | No | No | No | No | No |
| Anonymous | No | Public lead submission only | No | No | Published posts only |

Viewer access remains disabled until the owner approves specific read-only areas. Page navigation is not the authorization boundary; server pages, actions, and API handlers check the current database role.

## Role migration plan

The Phase 1 migration changes only the database default for newly inserted users to `viewer`. It does not rewrite existing role values. Before applying it to a customer database, the owner should review existing accounts and approve which people remain administrators. Any account demotion must be an explicit, separately reviewed operation. No production migration was run for Phase 1.

## Lead intake

The public form now asks only for name, email, and phone, plus explicit contact consent. It does not save treatment interest, message text, IP address, user agent, page path, search term, or ad-click identifiers for new submissions. Existing lead rows and legacy columns are preserved. The consent record uses policy key `lead-contact-v1`; update that key when the owner-approved notice and consent wording change.

The email-based rate limiter stores an HMAC key and a short-lived counter in PostgreSQL. It does not trust forwarded-IP headers or store the submitted email in the limiter table. An `AUTH_SECRET` or `NEXTAUTH_SECRET` of at least 32 characters is required for the limiter; if it is missing, public lead intake fails closed.

Before collecting real customer leads, the owner must provide an approved privacy notice, retention period, and data deletion/export procedure. The current repository has no privacy notice route, so this phase does not claim legal compliance.

## Analytics service configuration

Set the same unique `ANALYTICS_API_TOKEN` in the Next.js app and its paired FastAPI deployment. Keep `ANALYTICS_BACKEND_URL` server-side. Set `FRONTEND_ORIGINS` to the exact deployment origins; an empty value denies browser cross-origin access. The Next.js proxy sends the token only from the server. Never reuse the token across customer deployments.

## Operations still requiring an owner decision

- Select a server-capable Next.js host; the checked-in GitHub Pages workflow expects a static artifact and does not establish a host for runtime auth and Prisma.
- Confirm persistent media storage before relying on the current local `public/uploads` directory across redeployments.
- Rotate any credentials that were included in the tracked `.env` file or its Git history before production use.

The lead throttle allows at most five submissions per HMAC-protected email and 300 per deployment in a 60-second window. Expired counters are removed during intake. The database diagnostic scripts require an explicit local-only flag and reject non-local database hosts; the disposable post check is separately gated.
