import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authorizeApi, getCurrentUser } from "@/lib/security/authorization";
import { canAccessArea } from "@/lib/security/role-policy";
import { readJsonBody, RequestBodyError } from "@/lib/security/request-body";
import { sanitizePostHtml } from "@/lib/security/post-html";
import { publicPostWhere } from "@/lib/security/post-visibility";

const MAX_POST_BODY_BYTES = 256 * 1024;
const idSchema = z.string().min(1).max(128);
const postPatchSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().max(1000).optional(),
  content: z.string().min(1).max(200_000).optional(),
  featuredImage: z.string().max(2048).optional(),
  status: z.enum(["draft", "published", "scheduled"]).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string().min(1).max(128)).max(20).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
}).refine((value) => Object.keys(value).length > 0);

interface RouteParams {
  params: Promise<{ id: string }>;
}

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    author: { select: { name: true } };
    tags: { select: { id: true; name: true; slug: true } };
  };
}>;

function toPostResponse(post: PostWithRelations) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: sanitizePostHtml(post.content),
    featuredImage: post.featuredImage,
    status: post.status,
    publishedAt: post.publishedAt,
    featured: post.featured,
    readingTime: post.readingTime,
    views: post.views,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: { name: post.author?.name ?? null },
    tags: post.tags,
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const parsedId = idSchema.safeParse((await params).id);
    if (!parsedId.success) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const user = await getCurrentUser();
    const canManage = Boolean(user && canAccessArea(user.role, "content"));
    const post = await prisma.post.findFirst({
      where: canManage
        ? { id: parsedId.data }
        : { id: parsedId.data, ...publicPostWhere() },
      include: {
        author: { select: { name: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (!canManage) {
      await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
      post.views += 1;
    }

    return NextResponse.json(toPostResponse(post));
  } catch {
    console.error("post_read_failed");
    return NextResponse.json({ error: "Unable to fetch post" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const access = await authorizeApi("content");
  if (!access.ok) return access.response;

  const parsedId = idSchema.safeParse((await params).id);
  if (!parsedId.success) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  try {
    const body = await readJsonBody<unknown>(request, MAX_POST_BODY_BYTES);
    const validation = postPatchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid post data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({ where: { id: parsedId.data } });
    if (!existingPost) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const data = validation.data;
    const updateData: Record<string, unknown> = { ...data };
    if (data.content !== undefined) {
      updateData.content = sanitizePostHtml(data.content);
      const wordCount = data.content.trim().split(/\s+/).filter(Boolean).length;
      updateData.readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;
    }
    if (data.publishedAt !== undefined) {
      updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
    } else if (data.status === "published" && !existingPost.publishedAt) {
      updateData.publishedAt = new Date();
    }

    if (data.tags !== undefined) {
      const tags = await prisma.tag.findMany({
        where: { id: { in: data.tags } },
        select: { id: true },
      });
      updateData.tags = { set: tags };
    }

    const post = await prisma.post.update({
      where: { id: parsedId.data },
      data: updateData,
      include: {
        author: { select: { name: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });
    return NextResponse.json(toPostResponse(post));
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("post_update_failed");
    return NextResponse.json({ error: "Unable to update post" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const access = await authorizeApi("content");
  if (!access.ok) return access.response;

  const parsedId = idSchema.safeParse((await params).id);
  if (!parsedId.success) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  try {
    const existingPost = await prisma.post.findUnique({ where: { id: parsedId.data }, select: { id: true } });
    if (!existingPost) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    await prisma.post.delete({ where: { id: parsedId.data } });
    return NextResponse.json({ message: "Post deleted" });
  } catch {
    console.error("post_delete_failed");
    return NextResponse.json({ error: "Unable to delete post" }, { status: 500 });
  }
}
