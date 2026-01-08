import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
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
} from "lucide-react";

export default function SobrePage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-48 h-48 bg-teal-200 rounded-full filter blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Excelência em{" "}
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Odontologia
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Há mais de 15 anos transformando sorrisos e cuidando da saúde
                bucal com dedicação, tecnologia de ponta e atendimento
                humanizado. Especialistas em tratamento de bruxismo e DTM.
              </p>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* Mission, Vision and Values Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-b border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Missão, Visão e Valores
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Princípios que guiam nosso trabalho diariamente
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full filter blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200 rounded-full filter blur-2xl"></div>
              </div>

              {/* Mission Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Nossa Missão
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Proporcionar tratamentos odontológicos de excelência, com foco
                  especial em bruxismo e DTM, devolvendo qualidade de vida e
                  bem-estar aos nossos pacientes através de cuidado
                  personalizado e tecnologia avançada.
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Nossa Visão
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Ser referência nacional no tratamento de bruxismo e disfunções
                  temporomandibulares, reconhecidos pela excelência técnica,
                  inovação constante e resultados transformadores na vida dos
                  pacientes.
                </p>
              </div>

              {/* Values Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Nossos Valores
                  </h3>
                </div>
                <ul className="text-gray-600 space-y-2">
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

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* Team/Professional Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-b border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Profissional de Excelência
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Professional Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 h-2"></div>
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <div className="bg-gradient-to-br from-blue-100 to-teal-100 w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                      <Stethoscope className="w-16 h-16 text-blue-600" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Dr. Sérgio Paulo de Souza Netto
                      </h3>
                      <p className="text-blue-600 font-semibold mb-6 text-lg">
                        Lorem Ipsum Dolor Sit Amet
                      </p>
                      <div className="space-y-3 text-gray-600">
                        <p className="flex items-center sm:items-start justify-center sm:justify-start">
                          <GraduationCap className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                          <span className="text-left">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                          </span>
                        </p>
                        <p className="flex items-center sm:items-start justify-center sm:justify-start">
                          <Award className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                          <span className="text-left">Sed do eiusmod tempor incididunt ut labore</span>
                        </p>
                        <p className="flex items-center sm:items-start justify-center sm:justify-start">
                          <Clock className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                          <span className="text-left">Ut enim ad minim veniam, quis nostrud exercitation</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>





        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-sky-700 to-cyan-700 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl translate-y-48 -translate-x-48"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6">
                Pronto para Transformar Sua Vida?
              </h2>

              <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Dê o primeiro passo para acabar com o bruxismo e recuperar sua
                qualidade de vida. Nossa equipe está pronta para cuidar de você.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <a
                  href="#agendamento"
                  className="inline-flex items-center justify-center bg-white text-sky-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Avaliação
                </a>
                <a
                  href="/contato"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-teal-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Fale Conosco
                </a>
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
