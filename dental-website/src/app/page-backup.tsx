import { Navigation } from '@/components/shared/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Shield, Award, Users, Clock, Stethoscope, Heart, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

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

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-200/30 to-blue-200/30 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Por que escolher nosso consultório?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Oferecemos tratamento especializado com tecnologia de ponta e cuidado humanizado
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Especialização</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Profissionais especializados em bruxismo e disfunções temporomandibulares com anos de experiência
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">98% aprovação</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Tecnologia</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Equipamentos modernos e diagnóstico preciso para os melhores resultados em seu tratamento
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500">Tecnologia de ponta</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Atendimento</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Cuidado humanizado e personalizado, focado na sua qualidade de vida e bem-estar
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-500">+500 pacientes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Treatments Section */}
        <section className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/50 to-indigo-900/50"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Nossos Tratamentos
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Soluções completas e modernas para seu bem-estar e qualidade de vida
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Placa Miorrelaxante",
                  description: "Dispositivo personalizado para aliviar tensão muscular e proteger seus dentes",
                  icon: Shield,
                  color: "from-blue-500 to-cyan-500",
                  href: "/placa-miorrelaxante"
                },
                {
                  title: "Toxina Botulínica",
                  description: "Aplicação terapêutica para redução eficaz do bruxismo e dores",
                  icon: Stethoscope,
                  color: "from-purple-500 to-pink-500",
                  href: "/botox-bruxismo"
                },
                {
                  title: "Diagnóstico",
                  description: "Avaliação completa e gratuita para identificar a melhor solução",
                  icon: Award,
                  color: "from-green-500 to-emerald-500",
                  href: "/diagnostico-gratuito"
                },
                {
                  title: "Acompanhamento",
                  description: "Monitoramento contínuo para garantir os melhores resultados",
                  icon: Clock,
                  color: "from-orange-500 to-red-500",
                  href: "/tratamento-bruxismo"
                }
              ].map((treatment, index) => {
                const IconComponent = treatment.icon;
                return (
                  <Link key={index} href={treatment.href} className="group">
                    <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                      <div className={`bg-gradient-to-br ${treatment.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                        {treatment.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {treatment.description}
                      </p>
                      <div className="mt-6 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                        <span className="text-sm font-medium">Saiba mais</span>
                        <span className="ml-2">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Está sofrendo com bruxismo?
              </h2>
              <p className="text-2xl mb-8 text-blue-100 leading-relaxed">
                Agende uma avaliação <span className="font-bold text-white">gratuita</span> e descubra o melhor tratamento para você
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <a
                  href="#agendamento"
                  className="group bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl hover:shadow-3xl flex items-center space-x-2"
                >
                  <span>Quero Agendar Minha Avaliação</span>
                  <span>→</span>
                </a>

                <a
                  href="/contato"
                  className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Fale Conosco
                </a>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mt-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">98%</div>
                  <div className="text-blue-200">Taxa de sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">+500</div>
                  <div className="text-blue-200">Pacientes atendidos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">24h</div>
                  <div className="text-blue-200">Primeira consulta</div>
                </div>
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