export class RequestBodyError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 413
  ) {
    super(message);
    this.name = "RequestBodyError";
  }
}

export async function readRequestBytes(request: Request, maxBytes: number): Promise<Uint8Array> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null) {
    if (!/^\d+$/.test(declaredLength)) {
      throw new RequestBodyError("Invalid request body", 400);
    }
    const length = Number(declaredLength);
    if (!Number.isSafeInteger(length)) {
      throw new RequestBodyError("Invalid request body", 400);
    }
    if (length > maxBytes) {
      throw new RequestBodyError("Request body is too large", 413);
    }
  }

  if (!request.body) throw new RequestBodyError("Invalid request body", 400);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new RequestBodyError("Request body is too large", 413);
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return bytes;
  } finally {
    reader.releaseLock();
  }
}

export async function readJsonBody<T>(request: Request, maxBytes: number): Promise<T> {
  const bytes = await readRequestBytes(request, maxBytes);
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as T;
  } catch {
    throw new RequestBodyError("Invalid request body", 400);
  }
}
