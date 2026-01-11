import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { prisma } from "@/lib/db";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Post</h1>
      <PostForm postId={post.id} initialData={post} />
    </div>
  );
}
