import { requirePageAccess } from "@/lib/security/authorization";

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  await requirePageAccess("users");
  return children;
}
