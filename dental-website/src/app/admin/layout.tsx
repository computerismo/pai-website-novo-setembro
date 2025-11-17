import AdminLayout from "@/components/admin/AdminLayout";
import { SessionProvider } from "next-auth/react";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayout>{children}</AdminLayout>
    </SessionProvider>
  );
}
