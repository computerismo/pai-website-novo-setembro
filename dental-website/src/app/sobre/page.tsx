import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ScheduleModalButton } from "@/components/landing/ScheduleModalButton";
import {
  Calendar,
  Award,
  Heart,
  Shield,
  Star,
  Clock,
  CheckCircle,
  GraduationCap,
  Stethoscope,
  Phone,
} from "lucide-react";

export default function SobrePage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-[#F8FAFC] dark:bg-background-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-heading-light dark:text-heading-dark mb-6">
                Excelência em{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                  Odontologia
                </span>
              </h1>
              <p className="text-xl text-text-light dark:text-text-dark leading-relaxed">
                Há mais de 15 anos transformando sorrisos e cuidando da saúde
                bucal com dedicação, tecnologia de ponta e atendimento
                humanizado. Especialistas em tratamento de bruxismo e DTM.
              </p>
            </div>
          </div>
        </section>

        {/* Mission, Vision and Values Section */}
        <section className="py-16 lg:py-24 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#2563EB] font-semibold tracking-wider uppercase text-sm">Nossos Princípios</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mt-2 mb-6">
                Missão, Visão e Valores
              </h2>
              <p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">
                Princípios que guiam nosso trabalho diariamente
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Mission Card */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark">
                    Nossa Missão
                  </h3>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">
                  Proporcionar tratamentos odontológicos de excelência, com foco
                  especial em bruxismo e DTM, devolvendo qualidade de vida e
                  bem-estar aos nossos pacientes através de cuidado
                  personalizado e tecnologia avançada.
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#06B6D4]/10 dark:bg-[#06B6D4]/20 rounded-xl flex items-center justify-center text-[#06B6D4] group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark">
                    Nossa Visão
                  </h3>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">
                  Ser referência nacional no tratamento de bruxismo e disfunções
                  temporomandibulares, reconhecidos pela excelência técnica,
                  inovação constante e resultados transformadores na vida dos
                  pacientes.
                </p>
              </div>

              {/* Values Card */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark">
                    Nossos Valores
                  </h3>
                </div>
                <ul className="text-sm text-text-light dark:text-text-dark space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Ética e transparência</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Atendimento humanizado</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Inovação contínua</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Excelência profissional</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team/Professional Section */}
        <section className="py-16 lg:py-24 bg-[#F8FAFC] dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#2563EB] font-semibold tracking-wider uppercase text-sm">Nossa Equipe</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mt-2 mb-6">
                Profissional de Excelência
              </h2>
              <p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Professional Card */}
              <div className="bg-white dark:bg-surface-dark rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"></div>
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-16 h-16 text-[#2563EB]" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-2xl sm:text-3xl font-bold text-heading-light dark:text-heading-dark mb-2">
                        Dr. Sérgio Paulo de Souza Netto
                      </h3>
                      <p className="text-[#2563EB] font-semibold mb-6 text-lg">
                        Lorem Ipsum Dolor Sit Amet
                      </p>
                      <div className="space-y-3 text-text-light dark:text-text-dark text-sm">
                        <p className="flex items-center sm:items-start justify-center sm:justify-start">
                          <GraduationCap className="w-5 h-5 mr-3 mt-0.5 text-[#2563EB] flex-shrink-0" />
                          <span className="text-left">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                          </span>
                        </p>
                        <p className="flex items-center sm:items-start justify-center sm:justify-start">
                          <Award className="w-5 h-5 mr-3 mt-0.5 text-[#2563EB] flex-shrink-0" />
                          <span className="text-left">Sed do eiusmod tempor incididunt ut labore</span>
                        </p>
                        <p className="flex items-center sm:items-start justify-center sm:justify-start">
                          <Clock className="w-5 h-5 mr-3 mt-0.5 text-[#2563EB] flex-shrink-0" />
                          <span className="text-left">Ut enim ad minim veniam, quis nostrud exercitation</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#2563EB] opacity-90 dark:opacity-80 z-0"></div>
          <div 
            className="absolute inset-0 opacity-10 z-0" 
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
          ></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Pronto para Transformar Sua Vida?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Dê o primeiro passo para acabar com o bruxismo e recuperar sua
              qualidade de vida. Nossa equipe está pronta para cuidar de você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ScheduleModalButton source="sobre-cta" label="Agendar Avaliação" />
              <a
                href="/contato"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
