import { prisma } from "@/lib/db";
import { LeadsContainer } from "@/components/admin/leads/LeadsContainer";

// Skip static prerendering - render on demand
export const dynamic = 'force-dynamic';

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  const query = searchParams?.q || "";
  
  const where: any = {};
  
  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { phone: { contains: query, mode: 'insensitive' } },
    ];
  }

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

  // Calculate stats based on ALL leads, not just filtered ones, or filtered?
  // Usually stats are global, but filtering might be nice. 
  // Let's keep stats global for now or simple count of filtered.
  // Actually, let's fetch global stats separately.
  
  const stats = {
    total: await prisma.lead.count(),
    new: await prisma.lead.count({ where: { status: 'new' } }),
    contacted: await prisma.lead.count({ where: { status: 'contacted' } }),
    converted: await prisma.lead.count({ where: { status: 'converted' } }),
  };

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
      <LeadsContainer leads={leads} />
    </div>
  );
}

