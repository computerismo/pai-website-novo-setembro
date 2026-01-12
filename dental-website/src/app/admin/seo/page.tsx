import { Search } from "lucide-react";

export default function SeoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-8 h-8 text-blue-500" />
          Análise de SEO
        </h1>
      </div>

      <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Em Construção</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          A ferramenta de análise de SEO estará disponível em breve. Você poderá monitorar palavras-chave e ranking de páginas.
        </p>
      </div>
    </div>
  );
}
