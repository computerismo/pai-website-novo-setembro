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

        {/* Simple Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Por que escolher nosso consultório?
              </h2>
              <p className="text-xl text-gray-600">
                Oferecemos tratamento especializado com tecnologia de ponta e cuidado humanizado
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-white">🩺</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Especialização</h3>
                <p className="text-gray-600">
                  Profissionais especializados em bruxismo e DTM
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-white">🛡️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Tecnologia</h3>
                <p className="text-gray-600">
                  Equipamentos modernos para diagnóstico preciso
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-white">❤️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Atendimento</h3>
                <p className="text-gray-600">
                  Cuidado humanizado e personalizado
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Treatments Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nossos Tratamentos
              </h2>
              <p className="text-xl text-gray-600">
                Soluções completas para seu bem-estar
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Placa Miorrelaxante</h3>
                <p className="text-gray-600">Dispositivo personalizado para aliviar tensão</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Toxina Botulínica</h3>
                <p className="text-gray-600">Aplicação terapêutica para bruxismo</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Diagnóstico</h3>
                <p className="text-gray-600">Avaliação completa e gratuita</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Acompanhamento</h3>
                <p className="text-gray-600">Monitoramento contínuo</p>
              </div>
            </div>
          </div>
        </section>

        {/* Simple CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Está sofrendo com bruxismo?
            </h2>
            <p className="text-xl mb-8">
              Agende uma avaliação gratuita e descubra o melhor tratamento
            </p>
            <a
              href="#agendamento"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Quero Agendar Minha Avaliação
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}