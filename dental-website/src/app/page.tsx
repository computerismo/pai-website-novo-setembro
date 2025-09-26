import { Navigation } from '@/components/shared/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection
          title="Tratamento Especializado para Bruxismo"
          subtitle="Cuidado e Expertise"
          description="Recupere sua qualidade de vida com tratamentos modernos e personalizados para bruxismo e disfunções temporomandibulares."
          primaryCTA={{
            text: "Agendar Avaliação",
            href: "#agendamento"
          }}
          secondaryCTA={{
            text: "Fale Conosco",
            href: "/contato"
          }}
          variant="split"
        />

        {/* Enhanced Features Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-b border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  ⭐ Nossos Diferenciais
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Por que escolher nosso consultório?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Oferecemos tratamento especializado com tecnologia de ponta e cuidado humanizado
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full filter blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200 rounded-full filter blur-2xl"></div>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl text-center hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl text-white">🩺</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Especialização</h3>
                <p className="text-gray-600 leading-relaxed">
                  Profissionais especializados em bruxismo e DTM
                </p>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl text-center hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl text-white">🛡️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Tecnologia</h3>
                <p className="text-gray-600 leading-relaxed">
                  Equipamentos modernos para diagnóstico preciso
                </p>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl text-center hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl text-white">❤️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Atendimento</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cuidado humanizado e personalizado
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* Enhanced Treatments Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-t border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  🦷 Tratamentos
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nossos Tratamentos
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Soluções completas para seu bem-estar e qualidade de vida
              </p>
            </div>

            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full filter blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200 rounded-full filter blur-2xl"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-lg">🦷</span>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors">Placa Miorrelaxante</h3>
                  <p className="text-gray-600 leading-relaxed">Dispositivo personalizado para aliviar tensão</p>
                </div>

                <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-lg">💉</span>
                    </div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-teal-700 transition-colors">Toxina Botulínica</h3>
                  <p className="text-gray-600 leading-relaxed">Aplicação terapêutica para bruxismo</p>
                </div>

                <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-lg">🔍</span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors">Diagnóstico</h3>
                  <p className="text-gray-600 leading-relaxed">Avaliação completa e gratuita</p>
                </div>

                <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-lg">📋</span>
                    </div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-700 transition-colors">Acompanhamento</h3>
                  <p className="text-gray-600 leading-relaxed">Monitoramento contínuo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-br from-sky-700 to-cyan-700 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl translate-y-48 -translate-x-48"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-4xl mx-auto">
              <div className="inline-block mb-6">
                <span className="text-sm font-medium text-blue-100 bg-blue-500 px-4 py-2 rounded-full">
                  🦷 Consulta Gratuita
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Está sofrendo com bruxismo?
              </h2>

              <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Agende uma avaliação gratuita e descubra o melhor tratamento personalizado para você
              </p>

              <div className="max-w-lg mx-auto">
                <a
                  href="#agendamento"
                  className="inline-block border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-teal-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Quero Agendar Minha Avaliação
                </a>

                <p className="text-sm text-blue-100 mt-4">
                  ⚡ Resposta rápida • 📞 Atendimento personalizado
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}