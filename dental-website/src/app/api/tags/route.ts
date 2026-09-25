import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorizeApi, getCurrentUser } from "@/lib/security/authorization";
import { canAccessArea } from "@/lib/security/role-policy";
import { readJsonBody, RequestBodyError } from "@/lib/security/request-body";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    const canManage = Boolean(user && canAccessArea(user.role, "content"));
    const tags = await prisma.tag.findMany({
      where: canManage
        ? undefined
        : { posts: { some: { status: "published", publishedAt: { lte: new Date() } } } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return NextResponse.json(tags);
  } catch {
    console.error("tag_list_read_failed");
    return NextResponse.json({ error: "Unable to fetch tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const access = await authorizeApi("content");
  if (!access.ok) return access.response;

  try {
    const body = await readJsonBody<unknown>(request, 8 * 1024);
    const validation = tagSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid tag data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({ data: validation.data });
    return NextResponse.json({ id: tag.id, name: tag.name, slug: tag.slug }, { status: 201 });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("tag_create_failed");
    return NextResponse.json({ error: "Unable to create tag" }, { status: 500 });
  }
}
