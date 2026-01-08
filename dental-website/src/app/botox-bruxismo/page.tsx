import { Metadata } from 'next';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { CheckCircle, Zap, Clock, Award, Info, Calendar, Syringe, Brain } from 'lucide-react';
import { ScheduleModalButton } from '@/components/landing/ScheduleModalButton';

export const metadata: Metadata = {
  title: 'Toxina Botulínica para Bruxismo | Terapêutica Odontológica',
  description: 'Tratamento terapêutico com toxina botulínica para controle do bruxismo e dores orofaciais. Procedimento seguro realizado por especialistas.',
  keywords: 'botox bruxismo, toxina botulínica, dor orofacial, tratamento bruxismo, odontologia terapêutica',
};

export default function BotoxBruxismoPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20 pt-32 relative overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Controle do Bruxismo com <br className="hidden md:block" />
                <span className="text-blue-600">Toxina Botulínica</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Uma abordagem terapêutica eficaz, disponível em Governador Valadares, para reduzir a hiperatividade muscular, 
                aliviar dores tensionais e proteger sua estrutura dentária.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20" asChild>
                  <a href="#agendamento">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Avaliação
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300 hover:bg-white" asChild>
                  <a href="#mecanismo">
                    <Info className="w-5 h-5 mr-2" />
                    Entenda o Tratamento
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Mechanism of Action */}
        <section className="py-20 bg-white" id="mecanismo">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900">
                  Como a Toxina Atua no Bruxismo?
                </h2>
                
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                   Muitas vezes, a origem das dores está na <strong>hiperatividade dos músculos</strong> da mastigação 
                   (masseter e temporal). É aqui que entra a intervenção terapêutica.
                </p>

                {/* Highlight Mechanism Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 max-w-3xl mx-auto relative overflow-hidden group hover:border-purple-200 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-purple-700" />
                  
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-purple-100 p-4 rounded-full shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <Zap className="w-8 h-8 text-purple-600" />
                    </div>
                    
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-purple-900 mb-2">Bloqueio Neuromuscular</h3>
                      <p className="text-slate-600 leading-relaxed">
                        A toxina age bloqueando temporariamente os sinais nervosos que causam a contração excessiva. 
                        Isso <span className="font-semibold text-purple-700">reduz a força da mordida involuntária</span> sem 
                        comprometer a fala ou a mastigação normal.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 max-w-2xl mx-auto italic">
                  "O resultado é um alívio da tensão muscular, protegendo seus dentes e eliminando as dores de cabeça tensionais."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Benefits */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Benefícios Clínicos
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Além da estética, o uso terapêutico da toxina botulínica promove saúde e bem-estar.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Alívio de Cefaleias</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Reduz significativamente a frequência e intensidade de dores de cabeça tensionais causadas pelo apertamento constante.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Preservação Dental</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Ao diminuir a força da mordida involuntária, protege restaurações, implantes e o esmalte natural dos dentes contra fraturas.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Ação Prolongada</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Os efeitos terapêuticos iniciam-se em poucos dias e podem durar de 4 a 6 meses, dependendo do metabolismo do paciente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Procedure Breakdown */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                Etapas do Procedimento
              </h2>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {[
                  {
                    step: 1,
                    title: "Anamnese e Mapeamento",
                    desc: "Avaliação minuciosa da musculatura facial e identificação dos pontos de hiperatividade muscular que necessitam de intervenção."
                  },
                  {
                    step: 2,
                    title: "Aplicação Específica",
                    desc: "Microinjeções indolores realizadas nos pontos mapeados (geralmente masseter e temporal) utilizando agulhas ultrafinas."
                  },
                  {
                    step: 3,
                    title: "Pós-Procedimento",
                    desc: "O paciente pode retornar imediatamente às suas atividades. Recomenda-se apenas evitar esforço físico intenso nas primeiras 24 horas."
                  },
                  {
                    step: 4,
                    title: "Acompanhamento",
                    desc: "Uma consulta de retorno é agendada após 15 dias para avaliar a efetividade e realizar eventuais complementos se necessário."
                  }
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-600 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <span className="font-bold text-sm">{item.step}</span>
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Dúvidas Frequentes sobre Botox em Valadares
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "Vou perder a expressão facial?",
                  a: "Não. No tratamento do bruxismo, a aplicação é focada nos músculos da mastigação (laterais da face), não interferindo nos músculos da mímica facial (testa e olhos)."
                },
                {
                  q: "O procedimento é doloroso?",
                  a: "A aplicação é muito bem tolerada. Utilizamos agulhas de calibre pediátrico (extremamente finas) e podemos aplicar anestésico tópico para maior conforto."
                },
                {
                  q: "De quanto em quanto tempo preciso reaplicar?",
                  a: "A duração média é de 4 a 6 meses. Com aplicações regulares, o músculo tende a perder a 'memória' da força excessiva, podendo espaçar mais as sessões."
                },
                {
                  q: "Existe alguma contraindicação?",
                  a: "O tratamento não é indicado para gestantes, lactantes, portadores de doenças neuromusculares ou pessoas com alergia aos componentes da fórmula."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    {faq.q}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed ml-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="agendamento" className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Recupere seu Bem-Estar
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Agende uma avaliação especializada em Governador Valadares para entender como a terapia com toxina botulínica pode beneficiar seu caso específico.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ScheduleModalButton source="botox-bruxismo" label="Agendar Avaliação" />
              <Button size="xl" variant="outline" className="border-blue-400 text-white hover:bg-white/10" asChild>
                <a href="https://wa.me/55999999999" target="_blank" rel="noopener noreferrer">
                  Conversar no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}