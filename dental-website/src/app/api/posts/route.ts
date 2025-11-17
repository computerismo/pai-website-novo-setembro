import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for post validation
const postSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  featuredImage: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  publishedAt: z.string().optional(),
  featured: z.boolean().default(false),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// GET /api/posts - List all posts
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by status if not authenticated
    if (!session) {
      where.status = "published";
      where.publishedAt = { lte: new Date() };
    } else if (status) {
      where.status = status;
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
          tags: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    // Calculate reading time
    const wordsPerMinute = 200;
    const wordCount = validatedData.content.split(/\s+/).length;
    const readingTime = `${Math.ceil(wordCount / wordsPerMinute)} min`;

    // Handle tags
    const tagIds = validatedData.tags || [];
    const tags = await Promise.all(
      tagIds.map(async (tagId) => {
        const tag = await prisma.tag.findUnique({ where: { id: tagId } });
        return tag ? { id: tag.id } : null;
      })
    );

    const validTagIds = tags.filter((tag) => tag !== null);

    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        featuredImage: validatedData.featuredImage,
        status: validatedData.status,
        publishedAt: validatedData.publishedAt
          ? new Date(validatedData.publishedAt)
          : validatedData.status === "published"
          ? new Date()
          : null,
        featured: validatedData.featured,
        readingTime,
        seoTitle: validatedData.seoTitle,
        seoDescription: validatedData.seoDescription,
        authorId: session.user.id,
        categoryId: validatedData.categoryId,
        tags: {
          connect: validTagIds as any,
        },
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Erro ao criar post" },
      { status: 500 }
    );
  }
}
