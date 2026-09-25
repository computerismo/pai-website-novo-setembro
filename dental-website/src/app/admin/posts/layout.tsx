import { requirePageAccess } from "@/lib/security/authorization";

export default async function PostsLayout({ children }: { children: React.ReactNode }) {
  await requirePageAccess("content");
  return children;
}
