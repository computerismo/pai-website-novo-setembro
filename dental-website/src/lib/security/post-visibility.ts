export function publicPostWhere(now = new Date()) {
  return {
    status: "published" as const,
    publishedAt: { lte: now },
  };
}
