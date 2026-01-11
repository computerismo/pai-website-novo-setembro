
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const uniqueFilename = `${Date.now()}-${filename}`;
    
    // Ensure uploads directory exists (should be handled by deployment, but good for local)
    // Note: In Vercel/Railway ephemeral instances, this persists only for the lifetime of the container
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, uniqueFilename);
    
    // In a real production app without persistent volumes, you'd upload to S3/R2 here
    await writeFile(filepath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${uniqueFilename}` 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
