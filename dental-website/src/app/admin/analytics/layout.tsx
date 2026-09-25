import { requirePageAccess } from "@/lib/security/authorization";

export default async function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  await requirePageAccess("analytics");
  return children;
}
