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
const postSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(1000).optional(),
  content: z.string().min(1).max(200_000),
  featuredImage: z.string().max(2048).optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  publishedAt: z.string().datetime().optional(),
  featured: z.boolean().default(false),
  tags: z.array(z.string().min(1).max(128)).max(20).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
});

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

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const canManage = Boolean(user && canAccessArea(user.role, "content"));
    const searchParams = request.nextUrl.searchParams;
    const parsedPage = z.coerce.number().int().min(1).max(1000).safeParse(searchParams.get("page") ?? "1");
    const parsedLimit = z.coerce.number().int().min(1).max(50).safeParse(searchParams.get("limit") ?? "10");
    if (!parsedPage.success || !parsedLimit.success) {
      return NextResponse.json({ error: "Invalid pagination" }, { status: 400 });
    }

    const statusParam = searchParams.get("status");
    const status = statusParam ? z.enum(["draft", "published", "scheduled"]).safeParse(statusParam) : null;
    if (canManage && statusParam && !status?.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const search = searchParams.get("search")?.slice(0, 100);
    const where: Prisma.PostWhereInput = canManage
      ? (status?.success ? { status: status.data } : {})
      : publicPostWhere();

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (parsedPage.data - 1) * parsedLimit.data;
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: parsedLimit.data,
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } }, tags: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts: posts.map(toPostResponse),
      pagination: {
        total,
        page: parsedPage.data,
        limit: parsedLimit.data,
        totalPages: Math.ceil(total / parsedLimit.data),
      },
    });
  } catch {
    console.error("post_list_read_failed");
    return NextResponse.json({ error: "Unable to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const access = await authorizeApi("content");
  if (!access.ok) return access.response;

  try {
    const body = await readJsonBody<unknown>(request, MAX_POST_BODY_BYTES);
    const validation = postSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid post data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;
    const wordCount = data.content.trim().split(/\s+/).filter(Boolean).length;
    const tags = data.tags?.length
      ? await prisma.tag.findMany({ where: { id: { in: data.tags } }, select: { id: true } })
      : [];
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: sanitizePostHtml(data.content),
        featuredImage: data.featuredImage,
        status: data.status,
        publishedAt: data.publishedAt
          ? new Date(data.publishedAt)
          : data.status === "published" ? new Date() : null,
        featured: data.featured,
        readingTime: `${Math.max(1, Math.ceil(wordCount / 200))} min`,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        authorId: access.user.id,
        tags: { connect: tags },
      },
      include: { author: { select: { name: true } }, tags: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json(toPostResponse(post), { status: 201 });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("post_create_failed");
    return NextResponse.json({ error: "Unable to create post" }, { status: 500 });
  }
}
