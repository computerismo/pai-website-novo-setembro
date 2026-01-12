import { Settings } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-8 h-8 text-blue-500" />
          Gestão de Usuários
        </h1>
      </div>

      <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Em Construção</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          O módulo de gestão de usuários estará disponível em breve. Aqui você poderá gerenciar acessos e permissões do sistema.
        </p>
      </div>
    </div>
  );
}
