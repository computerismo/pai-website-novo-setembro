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

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Por que escolher nosso consultório?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🦷</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Especialização</h3>
                <p className="text-gray-600">
                  Profissionais especializados em bruxismo e DTM
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tecnologia</h3>
                <p className="text-gray-600">
                  Equipamentos modernos para diagnóstico preciso
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Atendimento</h3>
                <p className="text-gray-600">
                  Cuidado humanizado e personalizado
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Nossos Tratamentos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Placa Miorrelaxante",
                  description: "Dispositivo personalizado para aliviar tensão muscular"
                },
                {
                  title: "Toxina Botulínica",
                  description: "Aplicação terapêutica para redução do bruxismo"
                },
                {
                  title: "Fisioterapia",
                  description: "Exercícios e técnicas para reabilitação da ATM"
                },
                {
                  title: "Laserterapia",
                  description: "Tratamento moderno para alívio da dor"
                }
              ].map((treatment, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{treatment.title}</h3>
                  <p className="text-gray-600">{treatment.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Está sofrendo com bruxismo?
            </h2>
            <p className="text-xl mb-8">
              Agende uma avaliação gratuita e descubra o melhor tratamento para você
            </p>
            <a
              href="#agendamento"
              className="inline-block bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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