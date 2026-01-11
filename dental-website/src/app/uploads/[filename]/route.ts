
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  // Security check: ensure no directory traversal
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '');
  
  // Construct path using same logic as upload route
  const filePath = path.join(process.cwd(), 'public', 'uploads', sanitizedFilename);

  if (!existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    
    // Determine content type
    const ext = path.extname(sanitizedFilename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.gif') contentType = 'image/gif';
    if (ext === '.webp') contentType = 'image/webp';
    if (ext === '.svg') contentType = 'image/svg+xml';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
