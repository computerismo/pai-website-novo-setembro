import { readFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { isSafeUploadFilename } from "@/lib/security/image-upload";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!isSafeUploadFilename(filename)) return new NextResponse("File not found", { status: 404 });

  const uploadDir = path.resolve(process.cwd(), "public", "uploads");
  const filePath = path.resolve(uploadDir, filename);
  if (path.dirname(filePath) !== uploadDir) return new NextResponse("File not found", { status: 404 });

  try {
    const file = await readFile(filePath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": MIME_TYPES[path.extname(filename)],
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
