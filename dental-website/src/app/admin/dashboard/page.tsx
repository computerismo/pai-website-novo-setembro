import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import StatsCard from "@/components/admin/StatsCard";
import { FileText, Users, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Get stats
  const [totalPosts, publishedPosts, totalLeads, totalViews, recentPosts, recentLeads] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "published" } }),
      prisma.lead.count(),
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } }, category: true },
      }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo de volta, {session.user?.name || "Admin"}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Posts"
          value={totalPosts}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Posts Publicados"
          value={publishedPosts}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Total de Leads"
          value={totalLeads}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Visualizações"
          value={totalViews._sum.views || 0}
          icon={Eye}
          color="orange"
        />
      </div>

      {/* Recent Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Posts Recentes
              </h2>
              <Link
                href="/admin/posts"
                className="text-sm text-primary hover:underline"
              >
                Ver todos
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {recentPosts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhum post encontrado
              </div>
            ) : (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 line-clamp-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                    {post.category && (
                      <span className="text-gray-500">{post.category.name}</span>
                    )}
                    <span className="text-gray-500">
                      {format(new Date(post.createdAt), "dd MMM yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Leads Recentes
              </h2>
              <Link
                href="/admin/leads"
                className="text-sm text-primary hover:underline"
              >
                Ver todos
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {recentLeads.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhum lead encontrado
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{lead.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{lead.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {lead.treatment}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        lead.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : lead.status === "contacted"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {lead.status === "new"
                        ? "Novo"
                        : lead.status === "contacted"
                        ? "Contactado"
                        : lead.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(lead.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
