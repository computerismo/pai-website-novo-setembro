import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import StatsCard from "@/components/admin/StatsCard";
import { LeadsChart } from "@/components/admin/LeadsChart";
import { ConversionFunnel } from "@/components/admin/ConversionFunnel";
import { AttentionCard } from "@/components/admin/AttentionCard";
import { FileText, Users, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { format, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

// Skip static prerendering - render on demand
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Calculate date 24 hours ago for stale leads
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Get all data in parallel
  const [
    totalPosts,
    publishedPosts,
    totalLeads,
    totalViews,
    recentPosts,
    recentLeads,
    // Status counts for funnel
    newLeads,
    contactedLeads,
    qualifiedLeads,
    convertedLeads,
    // Stale leads (new + > 24h old)
    staleLeads,
    // Leads per day for last 7 days
    leadsLast7Days,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "published" } }),
    prisma.lead.count(),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    // Funnel data
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.lead.count({ where: { status: 'contacted' } }),
    prisma.lead.count({ where: { status: 'qualified' } }),
    prisma.lead.count({ where: { status: 'converted' } }),
    // Stale leads
    prisma.lead.findMany({
      where: {
        status: 'new',
        createdAt: { lt: twentyFourHoursAgo },
      },
      orderBy: { createdAt: 'asc' },
      take: 5,
      select: { id: true, name: true, createdAt: true },
    }),
    // Leads per day
    prisma.lead.groupBy({
      by: ['createdAt'],
      _count: { id: true },
      where: {
        createdAt: { gte: subDays(new Date(), 7) },
      },
    }),
  ]);

  // Count stale leads
  const staleLeadsCount = await prisma.lead.count({
    where: {
      status: 'new',
      createdAt: { lt: twentyFourHoursAgo },
    },
  });

  // Process leads per day data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(startOfDay(date), 'yyyy-MM-dd');
  });

  // Group leads by day
  const leadsByDay: Record<string, number> = {};
  leadsLast7Days.forEach((item) => {
    const day = format(new Date(item.createdAt), 'yyyy-MM-dd');
    leadsByDay[day] = (leadsByDay[day] || 0) + 1;
  });

  const chartData = last7Days.map(date => ({
    date,
    count: leadsByDay[date] || 0,
  }));

  // Funnel stages
  const funnelStages = [
    { label: 'Novos', count: newLeads, color: 'bg-blue-500' },
    { label: 'Contactados', count: contactedLeads, color: 'bg-yellow-500' },
    { label: 'Qualificados', count: qualifiedLeads, color: 'bg-cyan-500' },
    { label: 'Convertidos', count: convertedLeads, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Bem-vindo de volta, <span className="font-medium text-slate-700">{session.user?.name || "Admin"}</span>!
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Chart - takes 2 cols */}
        <div className="lg:col-span-2">
          <LeadsChart data={chartData} />
        </div>
        
        {/* Attention Card */}
        <div>
          <AttentionCard count={staleLeadsCount} leads={staleLeads} />
        </div>
      </div>

      {/* Funnel + Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Funnel */}
        <ConversionFunnel stages={funnelStages} />

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Leads Recentes
              </h2>
              <Link
                href="/admin/leads"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50"
              >
                Ver todos
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Nenhum lead encontrado
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{lead.name}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{lead.email}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {lead.treatment}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        lead.status === "new"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                          : lead.status === "contacted"
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                          : lead.status === "qualified"
                          ? "bg-gradient-to-r from-cyan-400 to-teal-500 text-white"
                          : "bg-gradient-to-r from-emerald-400 to-green-500 text-white"
                      }`}
                    >
                      {lead.status === "new"
                        ? "Novo"
                        : lead.status === "contacted"
                        ? "Contactado"
                        : lead.status === "qualified"
                        ? "Qualificado"
                        : "Convertido"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
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

