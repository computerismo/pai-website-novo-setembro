'use client';

import { Navigation } from '@/components/shared/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/landing/LeadForm';

// FAQ Component
function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-neutral-50 rounded-xl border border-neutral-200 shadow-md hover:shadow-lg transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-white transition-colors duration-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-4">{question}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <p className="text-gray-700 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "O tratamento para bruxismo dói?",
      answer: "Não, o tratamento para bruxismo é totalmente indolor. A confecção das placas miorrelaxantes envolve apenas a moldagem dos dentes, sem qualquer desconforto. O uso da placa também é confortável e você se adapta rapidamente."
    },
    {
      question: "Quanto tempo dura uma placa de bruxismo?",
      answer: "Uma placa miorrelaxante bem cuidada pode durar de 2 a 5 anos, dependendo da intensidade do bruxismo e dos cuidados com higienização e armazenamento. Fazemos acompanhamentos regulares para avaliar o estado da placa."
    },
    {
      question: "Placa de bruxismo comprada pronta funciona?",
      answer: "Não recomendamos placas prontas. Cada pessoa tem uma arcada dentária única, e as placas devem ser personalizadas para garantir eficácia e conforto. Placas mal ajustadas podem até agravar o problema."
    },
    {
      question: "O bruxismo tem cura?",
      answer: "O bruxismo pode ser controlado efetivamente com o tratamento adequado. Embora as causas (como estresse) possam persistir, os sintomas e danos podem ser minimizados ou eliminados com acompanhamento profissional."
    },
    {
      question: "Qual o valor do tratamento para bruxismo?",
      answer: "O valor varia conforme o tipo de tratamento necessário. Oferecemos uma consulta de avaliação gratuita onde apresentamos um plano personalizado com valores transparentes e opções de pagamento."
    },
    {
      question: "O convênio cobre o tratamento de bruxismo?",
      answer: "Alguns convênios cobrem parte do tratamento. Nossa equipe pode verificar sua cobertura e auxiliar nos procedimentos para aprovação. Também oferecemos condições especiais para pagamento particular."
    }
  ];

  return (
    <>
      <Navigation />
      <main>
        <HeroSection
          title="Alívio para o Bruxismo: Recupere o Conforto e o Desgaste dos seus Dentes"
          subtitle="Tratamento Odontológico Especializado"
          description="Tratamento Odontológico para o ranger e apertar dos dentes. Recupere o seu bem-estar e melhore sua qualidade de vida com tratamentos personalizados."
          primaryCTA={{
            text: "Agende sua Consulta",
            href: "#agendamento"
          }}
          secondaryCTA={{
            text: "Conheça o Tratamento",
            href: "/tratamento-bruxismo"
          }}
          variant="split"
        />

        {/* Symptoms Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-b border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
                Você Sofre com Bruxismo?
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Principalmente causado pelo estresse e ansiedade, o bruxismo se caracteriza pelo ato de ranger e apertar os dentes, causando dores, desgastes e outros problemas bucais. Na Odontologia Avançada, oferecemos tratamentos modernos para proteger seus dentes e aliviar os sintomas, com atendimento humanizado e equipamentos de última geração.
              </p>
            </div>

            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full filter blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200 rounded-full filter blur-2xl"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative mb-12">
                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-red-500 to-red-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white text-xl">🤕</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors">Dores de cabeça frequentes</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-3">Ao acordar, você sente dores de cabeça ou enxaquecas sem motivo aparente?</p>
                </div>

                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white text-xl">🦷</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">Desgaste anormal dos dentes</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-3">Seus dentes estão lascados, fraturados ou com o esmalte desgastado, tornando-se mais sensíveis?</p>
                </div>

                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white text-xl">😣</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-700 transition-colors">Dor e sensibilidade na mandíbula</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-3">Desconforto ao mastigar, falar ou até mesmo em repouso, limitando sua alimentação.</p>
                </div>

                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white text-xl">😰</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Dores nos músculos faciais</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-3">Tensão e fadiga muscular que podem se estender para o pescoço e ombros.</p>
                </div>

                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white text-xl">🔓</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Problemas na ATM</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-3">Articulação temporomandibular com estalos, travamentos e limitação de abertura bucal.</p>
                </div>

                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white text-xl">😴</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">Distúrbios do sono</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-3">Sono não reparador, despertares noturnos e cansaço durante o dia, afetando sua disposição.</p>
                </div>
              </div>

              {/* Warning Card */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl p-6 shadow-lg max-w-4xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-lg">⚠️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">Atenção:</h3>
                    <p className="text-red-700 leading-relaxed">
                      Se não tratado, o bruxismo pode levar a problemas mais graves como fraturas dentárias, perda óssea, disfunções permanentes da ATM e até mesmo alterações estéticas no rosto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* Treatment Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-t border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Tratamento Especializado para Bruxismo
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Oferecemos soluções personalizadas e eficazes para o tratamento do bruxismo, devolvendo qualidade de vida e saúde bucal para pacientes de Governador Valadares e região.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full filter blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200 rounded-full filter blur-2xl"></div>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl text-white">🔍</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Diagnóstico Preciso</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Realizamos uma avaliação completa utilizando tecnologia avançada para identificar as causas do seu bruxismo. Nossa análise inclui exame clínico detalhado, avaliação da oclusão, análise da musculatura facial e, quando necessário, exames complementares para um diagnóstico preciso e personalizado.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl text-white">🛡️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Placas Miorrelaxantes Personalizadas</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Confeccionamos placas sob medida usando materiais de alta qualidade e tecnologia digital. Cada placa é única, ajustada perfeitamente à sua arcada dentária, proporcionando máximo conforto e eficácia na proteção dos dentes e relaxamento da musculatura mastigatória.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl text-white">🤝</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Terapias Complementares</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Oferecemos abordagem multidisciplinar incluindo aplicação de toxina botulínica para casos específicos, orientações sobre técnicas de relaxamento, mudanças comportamentais e parcerias com fisioterapeutas especializados para um tratamento completo e duradouro.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-t border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Benefícios do Nosso Tratamento
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Descubra como nosso tratamento especializado para bruxismo em Governador Valadares pode transformar sua qualidade de vida
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full filter blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full filter blur-2xl"></div>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative group">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white text-xl">😌</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">Alívio das Dores</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mt-3">Eliminação das dores de cabeça, musculares e da mandíbula causadas pelo bruxismo.</p>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative group">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white text-xl">🛡️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Proteção Dentária</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mt-3">Prevenção do desgaste dentário e proteção contra fraturas e danos futuros.</p>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative group">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white text-xl">😴</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Melhor Qualidade do Sono</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mt-3">Noites mais tranquilas e sono reparador, com redução dos despertares noturnos.</p>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative group">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white text-xl">💆</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Redução da Tensão Muscular</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mt-3">Relaxamento dos músculos faciais, pescoço e ombros, melhorando o bem-estar geral.</p>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative group">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white text-xl">😊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-700 transition-colors">Tranquilidade e Confiança</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mt-3">Maior autoestima e confiança ao sorrir, sabendo que seus dentes estão protegidos.</p>
              </div>

              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 relative group">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white text-xl">🌟</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">Melhora da Qualidade de Vida</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mt-3">Retorno às atividades diárias sem limitações, com mais disposição e energia.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-t border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tire suas dúvidas sobre o bruxismo e nossos tratamentos em Governador Valadares
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqData.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onToggle={() => toggleFAQ(index)}
                />
              ))}
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* Enhanced CTA Section */}
        <section id="agendamento" className="py-20 bg-gradient-to-br from-sky-700 to-cyan-700 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl translate-y-48 -translate-x-48"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6">
                Está sofrendo com bruxismo?
              </h2>

              <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Agende uma avaliação gratuita e descubra o melhor tratamento personalizado para você
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                <button
                  onClick={handleOpenModal}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Agendar Consulta
                </button>

                <a
                  href="/tratamento-bruxismo"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-teal-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Saiba Mais
                </a>
              </div>


            </div>
          </div>
        </section>
        
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Agendar Diagnóstico"
        >
          <p className="text-sm text-gray-500 mb-4">
            Preencha seus dados abaixo e nossa equipe entrará em contato para agendar sua avaliação.
          </p>
          <LeadForm 
            source="homepage"
            onSuccess={() => setTimeout(() => setIsModalOpen(false), 3000)}
          />
        </Modal>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}