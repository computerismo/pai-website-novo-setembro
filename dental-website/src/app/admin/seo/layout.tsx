import { requirePageAccess } from "@/lib/security/authorization";

export default async function SeoLayout({ children }: { children: React.ReactNode }) {
  await requirePageAccess("analytics");
  return children;
}
