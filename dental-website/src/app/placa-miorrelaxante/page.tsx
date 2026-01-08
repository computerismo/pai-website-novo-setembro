import { Metadata } from 'next';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { CheckCircle, Shield, Clock, Brain, Moon, Info, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Placa Miorrelaxante para Bruxismo | Tratamento Especializado',
  description: 'Proteja seus dentes e alivie dores orofaciais com a placa miorrelaxante personalizada. Tratamento eficaz para bruxismo e DTM.',
  keywords: 'placa miorrelaxante, bruxismo, placa de bruxismo, dtm, protetor bucal, dentista bruxismo',
};

export default function PlacaMiorrelaxantePage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 pt-32 relative overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Proteção para seu Sorriso e <br className="hidden md:block" />
                <span className="text-blue-600">Alívio das Tensões</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                A placa miorrelaxante é o tratamento padrão-ouro para o controle do bruxismo. 
                Preserve a estrutura dos seus dentes e melhore sua qualidade de vida com um dispositivo personalizado.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20" asChild>
                  <a href="#agendamento">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Avaliação
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300 hover:bg-white" asChild>
                  <a href="#como-funciona">
                    <Info className="w-5 h-5 mr-2" />
                    Como Funciona
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Section: What is it? */}
        <section className="py-20 bg-white" id="sobre">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-slate-100 rounded-3xl h-full min-h-[400px] relative overflow-hidden group shadow-lg">
                 <Image 
                   src="/images/placa-miorrelaxante.png"
                   alt="Placa Miorrelaxante Transparente em Alta Resolução"
                   fill
                   className="object-cover transition-transform duration-700 group-hover:scale-105"
                   sizes="(max-width: 768px) 100vw, 50vw"
                   priority
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-900">
                  Entendendo o Bruxismo e a Função da Placa
                </h2>
                <div className="prose prose-lg text-slate-600">
                  <p>
                    O bruxismo é o hábito involuntário de ranger ou apertar os dentes, 
                    frequentemente ocorrendo durante o sono. Sem tratamento, pode levar a:
                  </p>
                  <ul className="list-none space-y-2 mt-4 mb-6">
                    <li className="flex items-start">
                      <div className="mt-1.5 min-w-5">
                       <div className="h-2 w-2 rounded-full bg-red-400"></div>
                      </div>
                      <span className="ml-3">Desgaste acentuado e fratura dos dentes</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1.5 min-w-5">
                       <div className="h-2 w-2 rounded-full bg-red-400"></div>
                      </div>
                      <span className="ml-3">Dores de cabeça tensionais e na mandíbula (ATM)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1.5 min-w-5">
                       <div className="h-2 w-2 rounded-full bg-red-400"></div>
                      </div>
                      <span className="ml-3">Retração gengival e sensibilidade dentária</span>
                    </li>
                  </ul>
                  <p>
                    A <strong>placa miorrelaxante</strong> atua como uma barreira protetora, 
                    absorvendo a força do impacto e promovendo o relaxamento da musculatura mastigatória.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Cards */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Benefícios do Uso da Placa
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Mais do que proteger os dentes, o tratamento visa devolver o conforto e a qualidade do seu sono.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Proteção Dentária</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Evita o contato direto entre os dentes, impedindo o desgaste do esmalte e reduzindo o risco de fraturas em restaurações e próteses.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Alívio de Dores</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Reduz a sobrecarga nas articulações (ATM) e relaxa a musculatura, diminuindo dores de cabeça e tensões no pescoço.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                    <Moon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Sono Reparador</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Ao eliminar a tensão do apertamento noturno, você pode experimentar noites de sono mais tranquilas e acordar mais descansado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20 bg-white" id="como-funciona">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                Etapas do Tratamento
              </h2>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {[
                  {
                    step: 1,
                    title: "Avaliação Clínica",
                    desc: "Análise da saúde bucal, nível de desgaste dentário e palpação muscular para confirmar o diagnóstico."
                  },
                  {
                    step: 2,
                    title: "Escaneamento ou Moldagem",
                    desc: "Registro preciso da arcada dentária. Utilizamos tecnologias digitais para maior conforto sempre que possível."
                  },
                  {
                    step: 3,
                    title: "Confecção Personalizada",
                    desc: "A placa é fabricada em laboratório especializado, utilizando materiais resistentes e biocompatíveis (acrílico termopolimerizável)."
                  },
                  {
                    step: 4,
                    title: "Ajuste e Entrega",
                    desc: "Ajuste fino dos contatos oclusais para garantir que a placa esteja perfeitamente equilibrada e confortável."
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
              Dúvidas Comuns
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "A placa de silicone funciona?",
                  a: "Placas de silicone (moles) geralmente não são indicadas para bruxismo, pois podem estimular o hábito de mastigação. As placas rígidas de acrílico são consideradas o padrão para proteção duradoura e relaxamento muscular efetivo."
                },
                {
                  q: "É difícil dormir com a placa?",
                  a: "Pode haver um período curto de adaptação (2 a 3 dias), mas como a placa é feita sob medida, ela deve se encaixar confortavelmente sem causar dor ou atrapalhar o sono."
                },
                {
                  q: "Quanto tempo dura uma placa?",
                  a: "Depende da intensidade do bruxismo e dos cuidados de higiene. Em média, pode durar de 1 a 3 anos. Revisões periódicas são importantes para polimento e ajustes."
                },
                {
                  q: "Como devo limpar minha placa?",
                  a: "Lave diariamente com água fria e sabão neutro e escova macia. Evite água quente (pode deformar) e cremes dentais abrasivos (podem criar ranhuras)."
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
        <section id="agendamento" className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Cuide da Saúde do Seu Sorriso
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Se você acorda com dores de cabeça ou nota seus dentes desgastados, agende uma avaliação para verificarmos a necessidade da placa miorrelaxante.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold border-none" asChild>
                <a href="#contato">
                  Agendar Avaliação
                </a>
              </Button>
              <Button size="xl" variant="outline" className="border-blue-400 text-white hover:bg-blue-700 hover:border-blue-300" asChild>
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