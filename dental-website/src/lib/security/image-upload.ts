export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type SupportedImage = {
  mimeType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  extension: ".jpg" | ".png" | ".gif" | ".webp";
};

const IMAGE_TYPES: SupportedImage[] = [
  { mimeType: "image/jpeg", extension: ".jpg" },
  { mimeType: "image/png", extension: ".png" },
  { mimeType: "image/gif", extension: ".gif" },
  { mimeType: "image/webp", extension: ".webp" },
];

export function detectSupportedImage(bytes: Uint8Array): SupportedImage | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) return IMAGE_TYPES[1];

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return IMAGE_TYPES[0];
  }

  if (
    bytes.length >= 6 &&
    String.fromCharCode(...bytes.subarray(0, 6)).match(/^GIF8[79]a$/)
  ) return IMAGE_TYPES[2];

  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.subarray(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.subarray(8, 12)) === "WEBP"
  ) return IMAGE_TYPES[3];

  return null;
}

export function validateImageUpload(
  mimeType: string,
  size: number,
  bytes: Uint8Array
): SupportedImage | null {
  if (!Number.isSafeInteger(size) || size < 1 || size > MAX_IMAGE_BYTES) return null;
  const detected = detectSupportedImage(bytes);
  if (!detected || detected.mimeType !== mimeType || bytes.byteLength !== size) return null;
  return detected;
}

export function isSafeUploadFilename(filename: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|gif|webp)$/.test(filename);
}
