import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1).optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"]).optional(),
  publishedAt: z.string().optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// GET /api/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    // Increment view count if not authenticated (public view)
    const session = await auth();
    if (!session) {
      await prisma.post.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Erro ao buscar post" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    // Calculate reading time if content was updated
    let readingTime = existingPost.readingTime;
    if (validatedData.content) {
      const wordsPerMinute = 200;
      const wordCount = validatedData.content.split(/\s+/).length;
      readingTime = `${Math.ceil(wordCount / wordsPerMinute)} min`;
    }

    // Handle tags if provided
    const updateData: any = {
      ...validatedData,
      readingTime,
      publishedAt: validatedData.publishedAt
        ? new Date(validatedData.publishedAt)
        : validatedData.status === "published" && !existingPost.publishedAt
        ? new Date()
        : undefined,
    };

    // Handle tags separately
    if (validatedData.tags) {
      const tags = await Promise.all(
        validatedData.tags.map(async (tagId) => {
          const tag = await prisma.tag.findUnique({ where: { id: tagId } });
          return tag ? { id: tag.id } : null;
        })
      );

      const validTagIds = tags.filter((tag) => tag !== null);

      updateData.tags = {
        set: validTagIds as any,
      };
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Post deletado com sucesso" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Erro ao deletar post" },
      { status: 500 }
    );
  }
}
