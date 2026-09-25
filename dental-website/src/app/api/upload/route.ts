import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { authorizeApi } from "@/lib/security/authorization";
import { MAX_IMAGE_BYTES, validateImageUpload } from "@/lib/security/image-upload";
import { readRequestBytes, RequestBodyError } from "@/lib/security/request-body";

const MAX_MULTIPART_BYTES = MAX_IMAGE_BYTES + 64 * 1024;

export async function POST(request: NextRequest) {
  const access = await authorizeApi("content");
  if (!access.ok) return access.response;
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "multipart/form-data") {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }

  try {
    const multipartBytes = await readRequestBytes(request, MAX_MULTIPART_BYTES);
    const boundedRequest = new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type")! },
      body: Buffer.from(multipartBytes),
    });

    let formData: FormData;
    try {
      formData = await boundedRequest.formData();
    } catch {
      return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image is too large" }, { status: 413 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const image = validateImageUpload(file.type, file.size, bytes);
    if (!image) {
      return NextResponse.json({ error: "Unsupported or invalid image" }, { status: 415 });
    }

    const filename = `${randomUUID()}${image.extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes, { flag: "wx" });

    return NextResponse.json({ success: true, url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("media_upload_failed");
    return NextResponse.json({ error: "Unable to upload image" }, { status: 500 });
  }
}
