'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ClipboardCheck,
  HeartHandshake,
  Info,
  ScanLine,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { FadeGrid } from '@/components/home/FadeGrid';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/landing/LeadForm';
import { trackFormModalOpen } from '@/lib/analytics/gtag';

function FAQItem({ id, question, answer, isOpen, onToggle }: {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group">
      <button
        id={`${id}-button`}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <span className="font-medium text-heading-light dark:text-heading-dark flex-1 pr-4">{question}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
          <ChevronDown className="w-5 h-5 text-text-light dark:text-text-dark" />
        </span>
      </button>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-text-light dark:text-text-dark text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
              {answer}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const benefits = [
  { icon: Smile, title: 'Conforto ao mastigar', text: 'O planejamento busca recuperar função e segurança para as atividades do dia a dia.' },
  { icon: Sparkles, title: 'Sorriso mais harmônico', text: 'A reabilitação considera proporções, aparência e integração com os dentes naturais.' },
  { icon: ShieldCheck, title: 'Planejamento individual', text: 'Cada indicação é definida após avaliação clínica, exames e conversa sobre suas necessidades.' },
  { icon: HeartHandshake, title: 'Acompanhamento próximo', text: 'Você recebe orientações em cada etapa e cuidados para a manutenção do tratamento.' },
];

const possibilities = [
  { icon: CheckCircle, title: 'Implante unitário', text: 'Uma possibilidade para substituir um dente ausente sem apoiar a restauração nos dentes vizinhos.' },
  { icon: Smile, title: 'Prótese sobre implantes', text: 'Alternativa para reabilitar mais de um dente, conforme a condição bucal e o planejamento profissional.' },
  { icon: ShieldCheck, title: 'Estabilização de prótese', text: 'Em casos selecionados, implantes podem contribuir para uma prótese com melhor retenção e conforto.' },
];

const stages = [
  { icon: Stethoscope, number: '01', title: 'Avaliação', text: 'Entendemos sua saúde, suas expectativas e examinamos dentes, gengiva e oclusão.' },
  { icon: ScanLine, number: '02', title: 'Planejamento', text: 'Exames de imagem ajudam a definir possibilidades, cuidados e o cronograma adequado ao caso.' },
  { icon: ClipboardCheck, number: '03', title: 'Tratamento', text: 'O procedimento é realizado de acordo com o plano apresentado, com orientações para cada fase.' },
  { icon: HeartHandshake, number: '04', title: 'Acompanhamento', text: 'Retornos permitem acompanhar a adaptação e orientar higiene e manutenção periódica.' },
];

const faqData = [
  { id: 'faq-candidatos-implante', question: 'Quem pode fazer implante dentário?', answer: 'A indicação depende da saúde geral, das condições da boca e da disponibilidade óssea. Uma avaliação clínica, acompanhada dos exames necessários, é o caminho para entender se o tratamento é adequado para você.' },
  { id: 'faq-conforto-procedimento', question: 'O tratamento com implantes dói?', answer: 'O procedimento é realizado com anestesia local e o conforto é acompanhado pela equipe. No pós-operatório, a experiência varia de pessoa para pessoa e são fornecidas orientações específicas para a recuperação.' },
  { id: 'faq-duracao-tratamento', question: 'Quanto tempo leva o tratamento?', answer: 'O prazo varia conforme a quantidade de implantes, a cicatrização e a necessidade de procedimentos complementares. Depois da avaliação, o profissional apresenta uma estimativa compatível com o seu caso.' },
  { id: 'faq-cuidados-implante', question: 'Como cuidar de um implante dentário?', answer: 'A higiene diária cuidadosa e as consultas periódicas são essenciais. A equipe orienta o uso de escova, fio ou outros recursos de higiene de acordo com a prótese instalada.' },
];

const implantodontiaTreatmentOptions = [
  { value: 'implantodontia', label: 'Implantodontia' },
];

export default function ImplantodontiaHome() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    trackFormModalOpen('implantodontia-homepage');
  };

  return (
    <div className="min-h-screen font-sans w-full max-w-[100vw] overflow-x-hidden">
      <Navigation onOpenModal={handleOpenModal} />
      <main>
        <header className="relative overflow-hidden pt-12 lg:pt-20 pb-16 lg:pb-24 bg-[#F8FAFC] dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="text-center lg:text-left space-y-8">
                <h1 className="text-3xl lg:text-5xl font-extrabold text-heading-light dark:text-heading-dark leading-tight tracking-tight">
                  Implantodontia: <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">cuidado para reconstruir seu sorriso</span>
                </h1>
                <p className="text-lg text-text-light dark:text-text-dark max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Avaliação cuidadosa e planejamento personalizado para reposição de dentes ausentes com implantes e próteses, respeitando sua saúde e suas necessidades.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button type="button" onClick={handleOpenModal} className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all shadow-xl shadow-blue-500/25 hover:-translate-y-1">
                    <Calendar className="mr-2 w-5 h-5" /> Agende sua avaliação
                  </button>
                  <a href="#implantodontia" className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 dark:border-gray-700 text-base font-medium rounded-xl text-heading-light dark:text-heading-dark bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:-translate-y-1">
                    <Info className="mr-2 w-5 h-5" /> Conheça o tratamento
                  </a>
                </div>
              </div>
              <div className="relative w-full max-w-[320px] md:max-w-md lg:max-w-full aspect-square lg:h-[600px] lg:w-auto hidden lg:flex items-center justify-center mt-8 lg:mt-0 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-[2rem] lg:rounded-[3rem] transform rotate-3 scale-95 opacity-50" />
                <FadeGrid />
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10" />
          </div>
        </header>

        <section className="py-16 lg:py-24 bg-[#FFFFFF] dark:bg-surface-dark relative overflow-hidden" id="implantodontia">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#2563EB] font-semibold tracking-wider uppercase text-sm">Entenda a especialidade</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mt-2 mb-6">O que é Implantodontia?</h2>
              <p className="text-lg text-text-light dark:text-text-dark leading-relaxed mb-5">É a área da odontologia dedicada ao planejamento e à instalação de implantes que podem servir de suporte para próteses dentárias.</p>
              <p className="text-text-light dark:text-text-dark leading-relaxed">A indicação considera a saúde bucal, os exames de imagem, as expectativas do paciente e as alternativas disponíveis. Assim, cada plano é construído de forma individual.</p>
            </div>
            <div className="bg-[#F8FAFC] dark:bg-background-dark rounded-3xl p-8 lg:p-10 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark mb-6">Uma avaliação completa pode incluir</h3>
              <ul className="space-y-4">
                {['Análise dos dentes, gengiva e mordida', 'Revisão do histórico de saúde', 'Exames de imagem quando indicados', 'Conversa sobre opções e etapas'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-light dark:text-text-dark"><CheckCircle className="w-5 h-5 text-[#2563EB] shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-heading-light dark:text-heading-dark mb-12">Benefícios de um tratamento bem planejado</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map(({ icon: Icon, title, text }) => (
                <div key={title} className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3 mb-2"><div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Icon className="w-5 h-5" /></div><h3 className="font-bold text-heading-light dark:text-heading-dark">{title}</h3></div>
                  <p className="text-sm text-text-light dark:text-text-dark">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-[#F8FAFC] dark:bg-background-dark" id="tratamentos">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16"><span className="text-[#2563EB] font-semibold tracking-wider uppercase text-sm">Possibilidades de tratamento</span><h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mt-2 mb-6">Soluções definidas para cada caso</h2><p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">A escolha depende da avaliação profissional e pode combinar diferentes recursos de reabilitação oral.</p></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {possibilities.map(({ icon: Icon, title, text }, index) => (
                <div key={title} className={`bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group ${index === 2 ? 'md:col-span-2 md:w-[calc(50%-0.75rem)] md:mx-auto lg:col-span-1 lg:w-auto lg:mx-0' : ''}`}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#06B6D4] to-[#2563EB]" />
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-colors"><Icon className="w-8 h-8" /></div>
                  <h3 className="text-2xl font-bold text-heading-light dark:text-heading-dark mb-4">{title}</h3><p className="text-text-light dark:text-text-dark text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-white dark:bg-surface-dark" id="etapas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mb-6">Etapas do tratamento</h2><p className="text-lg text-text-light dark:text-text-dark">Um percurso transparente, com explicações e acompanhamento desde a primeira consulta.</p></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stages.map(({ icon: Icon, number, title, text }) => (
                <div key={number} className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-center mb-5"><div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform"><Icon className="w-6 h-6" /></div><span className="text-3xl font-extrabold text-blue-100 dark:text-blue-900">{number}</span></div>
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark mb-3">{title}</h3><p className="text-sm text-text-light dark:text-text-dark leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-[#F8FAFC] dark:bg-background-dark" id="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-heading-light dark:text-heading-dark mb-12">Perguntas frequentes</h2>
            <div className="space-y-4">{faqData.map((faq, index) => <FAQItem key={faq.id} {...faq} isOpen={openFAQ === index} onToggle={() => setOpenFAQ(openFAQ === index ? null : index)} />)}</div>
          </div>
        </section>

        <section className="relative overflow-hidden" aria-labelledby="cta-agendamento">
          <div className="absolute inset-0 bg-[#2563EB] opacity-90 dark:opacity-80 z-0" />
          <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
            <h2 id="cta-agendamento" className="text-3xl lg:text-4xl font-bold text-white mb-6">Vamos conversar sobre o seu sorriso?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Agende uma avaliação para conhecer as possibilidades de tratamento adequadas às suas necessidades.</p>
            <button type="button" onClick={handleOpenModal} className="px-8 py-4 bg-white text-[#2563EB] font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors transform hover:-translate-y-1">Agendar avaliação</button>
          </div>
        </section>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agendar avaliação de implantodontia">
          <p className="text-sm text-gray-500 mb-4">Preencha seus dados e nossa equipe entrará em contato para combinar sua avaliação.</p>
          <LeadForm campaignId="implantodontia-homepage" source="implantodontia-homepage" treatmentOptions={implantodontiaTreatmentOptions} defaultTreatment="implantodontia" isInModal={true} onSuccess={() => setTimeout(() => setIsModalOpen(false), 3000)} />
        </Modal>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
