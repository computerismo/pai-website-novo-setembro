'use client';

import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { FadeGrid } from '@/components/home/FadeGrid';
import { useState } from 'react';
import { 
  Calendar, 
  Info, 
  CheckCircle, 
  Smile, 
  AlertCircle, 
  User, 
  Brain, 
  Ear, 
  Moon, 
  Search, 
  Shield, 
  Flower2, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Stethoscope,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/landing/LeadForm';
import { trackFormModalOpen } from '@/lib/analytics/gtag';

// FAQ Component
function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <span className="font-medium text-heading-light dark:text-heading-dark flex-1 pr-4">{question}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-text-light dark:text-text-dark" />
        </span>
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
            <div className="px-6 pb-6 text-text-light dark:text-text-dark text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
              {answer}
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
    trackFormModalOpen('homepage');
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "O tratamento para bruxismo dói?",
      answer: "Não. O tratamento é conservador e não invasivo. A confecção da placa e os exames são indolores. Nos casos de aplicação de toxina botulínica, o desconforto é mínimo e passageiro."
    },
    {
      question: "Quanto tempo dura uma placa de bruxismo?",
      answer: "A durabilidade varia conforme a intensidade do bruxismo e os cuidados do paciente, geralmente durando entre 1 a 3 anos. Recomendamos revisões periódicas a cada 6 meses para ajustes e avaliação."
    },
    {
      question: "Placa de bruxismo comprada pronta funciona?",
      answer: "Não recomendamos. Placas \"universais\" não se adaptam corretamente à sua anatomia, podendo causar movimentações dentárias indesejadas, piora da dor e desconforto, além de não protegerem adequadamente."
    },
    {
      question: "O bruxismo tem cura definitiva?",
      answer: "O bruxismo não tem uma cura única definitiva, pois é multifatorial (estresse, ansiedade, oclusão). No entanto, o tratamento oferece controle total dos sintomas e proteção dos dentes, garantindo qualidade de vida normal."
    }
  ];

  return (
    <div className="min-h-screen font-sans">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <header className="relative overflow-hidden pt-12 lg:pt-20 pb-16 lg:pb-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="text-center lg:text-left space-y-8">
                <h1 className="text-3xl lg:text-5xl font-extrabold text-heading-light dark:text-heading-dark leading-tight tracking-tight">
                  Alívio para o Bruxismo: <br className="hidden lg:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">Recupere o Conforto</span>
                </h1>
                <p className="text-lg text-text-light dark:text-text-dark max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Tratamento odontológico avançado para o ranger e apertar dos dentes. Recupere o seu bem-estar e melhore sua qualidade de vida com protocolos personalizados e tecnologia de ponta.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={handleOpenModal}
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all shadow-xl shadow-blue-500/25 hover:-translate-y-1"
                  >
                    <Calendar className="mr-2 w-5 h-5" />
                    Agende sua Consulta
                  </button>
                  <a 
                    href="#tratamento"
                    className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 dark:border-gray-700 text-base font-medium rounded-xl text-heading-light dark:text-heading-dark bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:-translate-y-1"
                  >
                    <Info className="mr-2 w-5 h-5" />
                    Conheça o Tratamento
                  </a>
                </div>
              </div>
              <div className="relative lg:h-[600px] w-full hidden lg:flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-[3rem] transform rotate-3 scale-95 opacity-50"></div>
                <FadeGrid />
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </header>

        {/* Symptoms Section */}
        <section className="py-16 lg:py-24 bg-[#FFFFFF] dark:bg-surface-dark relative overflow-hidden" id="sintomas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mb-6">Você Sofre com Bruxismo?</h2>
              <p className="text-lg text-text-light dark:text-text-dark">
                O bruxismo é o ato inconsciente de ranger ou apertar os dentes, frequentemente ligado ao estresse. Identifique os sinais mais comuns.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Symptom Cards */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">Dores de cabeça</h3>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">Enxaquecas frequentes ao acordar sem motivo aparente, muitas vezes irradiando das têmporas.</p>
              </div>

              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">Desgaste dentário</h3>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">Dentes lascados, fraturados ou com esmalte visivelmente desgastado e sensibilidade aumentada.</p>
              </div>

              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">Dor na mandíbula</h3>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">Desconforto ao mastigar, falar ou rigidez muscular na região da mandíbula ao acordar.</p>
              </div>

              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">Dores faciais</h3>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">Tensão e fadiga nos músculos da face que podem se estender para o pescoço e ombros.</p>
              </div>

              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Ear className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">Problemas na ATM</h3>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">Articulação temporomandibular com estalos, travamentos e limitação de abertura bucal.</p>
              </div>

              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                    <Moon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">Distúrbios do sono</h3>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">Sono não reparador, despertares noturnos e cansaço excessivo durante o dia.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Section */}
        <section className="py-16 lg:py-24 bg-[#F8FAFC] dark:bg-background-dark" id="tratamento">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#2563EB] font-semibold tracking-wider uppercase text-sm">Nossas Soluções</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mt-2 mb-6">Tratamento Especializado</h2>
              <p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">
                Utilizamos uma abordagem multidisciplinar e tecnologia digital para diagnósticos precisos e tratamentos eficazes.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Solution 1 - Diagnóstico Preciso */}
              <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-4">Diagnóstico Preciso</h3>
                <p className="text-text-light dark:text-text-dark mb-6 text-sm leading-relaxed">
                  Realizamos uma avaliação completa utilizando tecnologia avançada. Nossa análise inclui exame clínico detalhado, avaliação da oclusão e análise muscular.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm text-text-light dark:text-text-dark">
                    <Check className="text-green-500 w-5 h-5 mr-2" />
                    Exame clínico digital
                  </li>
                  <li className="flex items-center text-sm text-text-light dark:text-text-dark">
                    <Check className="text-green-500 w-5 h-5 mr-2" />
                    Análise de oclusão
                  </li>
                </ul>
              </div>

              {/* Solution 2 - Placas Miorrelaxantes (Featured) */}
              <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-lg ring-1 ring-[#2563EB]/20 relative overflow-hidden group transform lg:-translate-y-4">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#06B6D4] to-[#2563EB]"></div>
                <div className="w-16 h-16 bg-[#06B6D4]/10 dark:bg-[#06B6D4]/20 rounded-2xl flex items-center justify-center text-[#06B6D4] mb-6 group-hover:bg-[#06B6D4] group-hover:text-white transition-colors">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-4">Placas Miorrelaxantes</h3>
                <p className="text-text-light dark:text-text-dark mb-6 text-sm leading-relaxed">
                  Dispositivos sob medida de alta qualidade e tecnologia digital. Cada placa é ajustada perfeitamente à sua arcada para máximo conforto e proteção.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm text-text-light dark:text-text-dark">
                    <Check className="text-green-500 w-5 h-5 mr-2" />
                    Proteção do esmalte
                  </li>
                  <li className="flex items-center text-sm text-text-light dark:text-text-dark">
                    <Check className="text-green-500 w-5 h-5 mr-2" />
                    Relaxamento muscular
                  </li>
                  <li className="flex items-center text-sm text-text-light dark:text-text-dark">
                    <Check className="text-green-500 w-5 h-5 mr-2" />
                    Material de alta durabilidade
                  </li>
                </ul>
                <a 
                  href="/placa-miorrelaxante" 
                  className="block w-full py-3 text-center rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium transition-colors"
                >
                  Saiba Mais
                </a>
              </div>

              {/* Solution 3 - Terapias Complementares */}
              <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Flower2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-4">Terapias Complementares</h3>
                <p className="text-text-light dark:text-text-dark mb-6 text-sm leading-relaxed">
                  Abordagem multidisciplinar incluindo aplicação de toxina botulínica para casos específicos, laserterapia e orientações fisioterapêuticas.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-sm text-text-light dark:text-text-dark">
                    <Check className="text-green-500 w-5 h-5 mr-2" />
                    Toxina Botulínica
                  </li>
                  <li className="flex items-center text-sm text-text-light dark:text-text-dark">
                    <Check className="text-green-500 w-5 h-5 mr-2" />
                    Laserterapia
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-heading-light dark:text-heading-dark mb-12">Benefícios do Tratamento</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Smile className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-heading-light dark:text-heading-dark">Alívio da Dor</h4>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark">Eliminação das dores de cabeça e desconforto muscular facial.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-heading-light dark:text-heading-dark">Proteção Dentária</h4>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark">Prevenção efetiva do desgaste e fraturas dos dentes.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Moon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-heading-light dark:text-heading-dark">Sono Reparador</h4>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark">Noites mais tranquilas e melhora na qualidade do descanso.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-heading-light dark:text-heading-dark">Bem-estar</h4>
                </div>
                <p className="text-sm text-text-light dark:text-text-dark">Mais disposição, energia e qualidade de vida no seu dia a dia.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-[#F8FAFC] dark:bg-background-dark" id="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-heading-light dark:text-heading-dark mb-12">Perguntas Frequentes</h2>
            <div className="space-y-4">
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
        </section>

        {/* Pre-Footer CTA */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#2563EB] opacity-90 dark:opacity-80 z-0"></div>
          <div 
            className="absolute inset-0 opacity-10 z-0" 
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
          ></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Está sofrendo com bruxismo?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Se não tratado, o bruxismo pode levar a problemas graves como fraturas dentárias permanentes, perda óssea e disfunções crônicas da ATM.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleOpenModal}
                className="px-8 py-4 bg-white text-[#2563EB] font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors transform hover:-translate-y-1"
              >
                Agendar Consulta Agora
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Falar no WhatsApp
              </button>
            </div>
          </div>
        </div>

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
            isInModal={true}
            onSuccess={() => setTimeout(() => setIsModalOpen(false), 3000)}
          />
        </Modal>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
}