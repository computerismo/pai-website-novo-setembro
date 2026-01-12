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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-1">
          Gerencie os leads capturados pelo formulário de contato
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-600">Total</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.total}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-300">
          <p className="text-sm font-medium text-gray-600">Novos</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats.new}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
          <p className="text-sm font-medium text-gray-600">Contactados</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {stats.contacted}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-600">Convertidos</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats.converted}
          </p>
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
