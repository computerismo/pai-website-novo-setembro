export function BlogHero() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block text-sm font-medium text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
              📝 Centro de Conhecimento
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Blog
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Artigos especializados sobre saúde bucal, bruxismo e cuidados dentários.
            Conteúdo confiável escrito por profissionais experientes.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Conteúdo Atualizado
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Aprovado por Especialistas
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Baseado em Evidências
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}