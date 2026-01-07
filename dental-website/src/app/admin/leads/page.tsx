import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Phone, Calendar, Tag } from "lucide-react";

// Skip static prerendering - render on demand
export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
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
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Total</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.total}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Novos</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {stats.new}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Contactados</p>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">
            {stats.contacted}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Convertidos</p>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {stats.converted}
          </p>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Todos os Leads
          </h2>
        </div>
        <div className="divide-y">
          {leads.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Nenhum lead encontrado
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Name and Status */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lead.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          lead.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : lead.status === "contacted"
                            ? "bg-yellow-100 text-yellow-800"
                            : lead.status === "qualified"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
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

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-primary"
                        >
                          {lead.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-primary"
                        >
                          {lead.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Tag className="w-4 h-4" />
                        <span>{lead.treatment}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(
                            new Date(lead.createdAt),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    {lead.message && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {lead.message}
                        </p>
                      </div>
                    )}

                    {/* UTM Data */}
                    {(lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Origem da Campanha:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lead.utmSource && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              Source: {lead.utmSource}
                            </span>
                          )}
                          {lead.utmMedium && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              Medium: {lead.utmMedium}
                            </span>
                          )}
                          {lead.utmCampaign && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              Campaign: {lead.utmCampaign}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
