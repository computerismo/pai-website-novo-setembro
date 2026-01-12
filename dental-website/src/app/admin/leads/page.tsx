import { prisma } from "@/lib/db";
import { LeadsContainer } from "@/components/admin/leads/LeadsContainer";

// Skip static prerendering - render on demand
export const dynamic = 'force-dynamic';

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    q?: string; 
    status?: string;
    treatment?: string;
    source?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const { q, status, treatment, source, from, to } = params;
  
  // Build where clause dynamically
  const where: any = {};
  
  // Text search
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
    ];
  }

  // Status filter
  if (status) {
    where.status = status;
  }

  // Treatment filter
  if (treatment) {
    where.treatment = { contains: treatment, mode: 'insensitive' };
  }

  // UTM Source filter
  if (source) {
    where.utmSource = { contains: source, mode: 'insensitive' };
  }

  // Date range filter
  if (from || to) {
    where.createdAt = {};
    if (from) {
      where.createdAt.gte = new Date(from);
    }
    if (to) {
      // Add a day to include the entire "to" date
      const toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1);
      where.createdAt.lte = toDate;
    }
  }

  // Fetch leads with filters
  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      history: {
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
      leadNotes: {
        orderBy: {
          createdAt: "desc",
        },
        include: { user: true },
      },
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // Fetch unique treatments and UTM sources for filter dropdowns
  const [allTreatments, allSources, stats] = await Promise.all([
    prisma.lead.findMany({
      distinct: ['treatment'],
      select: { treatment: true },
    }),
    prisma.lead.findMany({
      distinct: ['utmSource'],
      select: { utmSource: true },
      where: { utmSource: { not: null } },
    }),
    // Stats
    {
      total: await prisma.lead.count(),
      new: await prisma.lead.count({ where: { status: 'new' } }),
      contacted: await prisma.lead.count({ where: { status: 'contacted' } }),
      converted: await prisma.lead.count({ where: { status: 'converted' } }),
    },
  ]);

  const treatments = allTreatments.map(t => t.treatment).filter(Boolean);
  const utmSources = allSources.map(s => s.utmSource).filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads</h1>
        <p className="text-slate-500 mt-1">
          Gerencie os leads capturados pelo formulário de contato
        </p>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total</p>
              <p className="mt-2 text-4xl font-bold text-slate-900 tracking-tight">{stats.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 shadow-lg shadow-slate-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-xl hover:shadow-blue-200/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Novos</p>
              <p className="mt-2 text-4xl font-bold text-blue-600 tracking-tight">{stats.new}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-xl hover:shadow-amber-200/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Contactados</p>
              <p className="mt-2 text-4xl font-bold text-amber-600 tracking-tight">{stats.contacted}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-xl hover:shadow-emerald-200/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Convertidos</p>
              <p className="mt-2 text-4xl font-bold text-emerald-600 tracking-tight">{stats.converted}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Container (Filters + List/Board) */}
      <LeadsContainer 
        leads={leads} 
        treatments={treatments}
        utmSources={utmSources}
      />
    </div>
  );
}
