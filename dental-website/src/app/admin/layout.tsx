import AdminLayout from "@/components/admin/AdminLayout";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/security/authorization";

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <SessionProvider>
      <AdminLayout>{children}</AdminLayout>
    </SessionProvider>
  );
}
