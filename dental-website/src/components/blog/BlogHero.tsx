export function BlogHero() {
  return (
    <section className="pt-32 pb-16 bg-[#F8FAFC] dark:bg-background-dark relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading-light dark:text-heading-dark mb-6 leading-tight">
            Nosso{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
              Blog
            </span>
          </h1>

          <p className="text-xl text-text-light dark:text-text-dark leading-relaxed mb-8 max-w-2xl mx-auto">
            Artigos especializados sobre saúde bucal, bruxismo e cuidados dentários.
            Conteúdo confiável escrito por profissionais experientes.
          </p>


        </div>
      </div>
    </section>
  );
}