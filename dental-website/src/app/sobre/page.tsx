import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Calendar, Award, Users, Building, Heart, Shield, Star, Clock, CheckCircle, Microscope, GraduationCap, Stethoscope } from 'lucide-react';

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
              <div className="inline-block mb-6">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  Sobre Nós
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Excelência em <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Odontologia</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Há mais de 15 anos transformando sorrisos e cuidando da saúde bucal com dedicação,
                tecnologia de ponta e atendimento humanizado. Especialistas em tratamento de bruxismo e DTM.
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
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  Nossos Pilares
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
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
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Nossa Missão</h3>
                <p className="text-gray-600 leading-relaxed">
                  Proporcionar tratamentos odontológicos de excelência, com foco especial em bruxismo e DTM,
                  devolvendo qualidade de vida e bem-estar aos nossos pacientes através de cuidado personalizado
                  e tecnologia avançada.
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Nossa Visão</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ser referência nacional no tratamento de bruxismo e disfunções temporomandibulares,
                  reconhecidos pela excelência técnica, inovação constante e resultados transformadores
                  na vida dos pacientes.
                </p>
              </div>

              {/* Values Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Nossos Valores</h3>
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
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  Equipe Especializada
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Profissionais de Excelência
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Nossa equipe é formada por especialistas com ampla experiência e formação diferenciada
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Lead Professional Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 h-2"></div>
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-blue-100 to-teal-100 w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Dr. João Silva</h3>
                      <p className="text-blue-600 font-semibold mb-4">Especialista em DTM e Dor Orofacial</p>
                      <div className="space-y-2 text-gray-600">
                        <p className="flex items-start">
                          <GraduationCap className="w-5 h-5 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>Pós-graduação em DTM e Dor Orofacial - USP</span>
                        </p>
                        <p className="flex items-start">
                          <Award className="w-5 h-5 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>Membro da Sociedade Brasileira de DTM</span>
                        </p>
                        <p className="flex items-start">
                          <Clock className="w-5 h-5 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>15+ anos de experiência clínica</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Highlights Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-blue-500 h-2"></div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Nossa Equipe Conta Com:</h3>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Especialistas em bruxismo e distúrbios do sono</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Profissionais certificados em toxina botulínica</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Equipe multidisciplinar integrada</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Atualização constante em congressos internacionais</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Protocolos baseados em evidência científica</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-b border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  Por Que Nos Escolher
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Diferenciais que Fazem a Diferença
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Compromisso com resultados excepcionais e sua satisfação
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full filter blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200 rounded-full filter blur-2xl"></div>
              </div>

              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors">
                  Avaliação Gratuita
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Primeira consulta sem custo para diagnóstico completo
                </p>
              </div>

              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-teal-700 transition-colors">
                  Resultados Rápidos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Alívio dos sintomas desde as primeiras sessões
                </p>
              </div>

              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors">
                  Atendimento Personalizado
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Tratamento individualizado para cada paciente
                </p>
              </div>

              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-700 transition-colors">
                  Garantia de Satisfação
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Acompanhamento até a resolução completa
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* Infrastructure/Technology Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-b border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  Infraestrutura
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tecnologia de Ponta
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Equipamentos modernos para diagnósticos precisos e tratamentos eficazes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Equipment List */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Microscope className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Nossos Equipamentos</h3>
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Scanner Digital 3D</strong>
                      <p className="text-sm mt-1">Moldagem digital precisa e confortável</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Eletromiógrafo</strong>
                      <p className="text-sm mt-1">Análise detalhada da atividade muscular</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Laser Terapêutico</strong>
                      <p className="text-sm mt-1">Alívio imediato da dor e inflamação</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Radiografia Digital</strong>
                      <p className="text-sm mt-1">Diagnóstico por imagem de alta definição</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Facilities */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Nossas Instalações</h3>
                </div>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Ambiente Climatizado</strong>
                      <p className="text-sm mt-1">Conforto térmico em todas as salas</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Sala de Relaxamento</strong>
                      <p className="text-sm mt-1">Espaço preparado para seu conforto</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Esterilização Avançada</strong>
                      <p className="text-sm mt-1">Protocolos rigorosos de biossegurança</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Estacionamento Próprio</strong>
                      <p className="text-sm mt-1">Facilidade e segurança para você</p>
                    </div>
                  </li>
                </ul>
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
              <div className="inline-block mb-6">
                <span className="text-sm font-medium text-blue-100 bg-blue-500 px-4 py-2 rounded-full">
                  Agende Sua Consulta
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Pronto para Transformar Sua Vida?
              </h2>

              <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Dê o primeiro passo para acabar com o bruxismo e recuperar sua qualidade de vida.
                Nossa equipe está pronta para cuidar de você.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <a
                  href="#agendamento"
                  className="inline-flex items-center justify-center bg-white text-sky-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Avaliação Gratuita
                </a>
                <a
                  href="/contato"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-teal-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Fale Conosco
                </a>
              </div>

              <p className="text-sm text-blue-100 mt-6">
                Atendimento personalizado • Resultados comprovados • Satisfação garantida
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}