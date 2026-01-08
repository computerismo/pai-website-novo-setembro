import { Metadata } from 'next';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { Stethoscope, ClipboardCheck, Microscope, Brain, ArrowRight, Shield, Award, Calendar } from 'lucide-react';
import { ScheduleModalButton } from '@/components/landing/ScheduleModalButton';

export const metadata: Metadata = {
  title: 'Tratamento de Bruxismo | Diagnóstico e Abordagem Multidisciplinar',
  description: 'Conheça as opções de tratamento para o bruxismo: placas miorrelaxantes, toxina botulínica e terapias complementares. Diagnóstico preciso e cuidado especializado.',
  keywords: 'tratamento bruxismo, diagnóstico bruxismo, placa miorrelaxante, botox bruxismo, odontologia do sono',
};

export default function TratamentoBruxismoPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 pt-32 relative overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Abordagem Multidisciplinar no <br className="hidden md:block" />
                <span className="text-blue-600">Tratamento do Bruxismo</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                O bruxismo é uma condição complexa que exige diagnóstico preciso. 
                Oferecemos terapias integradas em Governador Valadares para controlar os sintomas e proteger sua saúde bucal a longo prazo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20" asChild>
                  <a href="#diagnostico">
                    <ClipboardCheck className="w-5 h-5 mr-2" />
                    Como é o Diagnóstico
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300 hover:bg-white" asChild>
                  <a href="#opcoes">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Opções Terapêuticas
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Diagnosis / Context */}
        <section className="py-20 bg-white" id="diagnostico">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900">
                  Diagnóstico Personalizado
                </h2>
                
                {/* Highlight Box */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-r-xl text-left shadow-sm max-w-3xl mx-auto">
                  <p className="text-lg text-blue-900 leading-relaxed">
                    O primeiro passo para o controle efetivo do bruxismo é entender sua origem e severidade. 
                    Nossa avaliação clínica considera fatores <span className="font-semibold">dentários, musculares e emocionais</span>.
                  </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Microscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Análise Clínica</h3>
                    <p className="text-slate-600 text-sm">
                      Avaliação detalhada do nível de desgaste dental, saúde da gengiva e palpação da musculatura.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Fatores Associados</h3>
                    <p className="text-slate-600 text-sm">
                      Mapeamento de gatilhos comportamentais como níveis de estresse, ansiedade e qualidade do sono.
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 max-w-2xl mx-auto">
                  Com base nesse diagnóstico, elaboramos um plano de tratamento único, que pode envolver uma ou mais modalidades terapêuticas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Options Grid */}
        <section className="py-20 bg-slate-50" id="opcoes">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Modalidades de Tratamento
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Conheça as principais ferramentas que utilizamos para controlar o bruxismo e devolver seu conforto.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Placa Card */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:border-blue-200 transition-colors">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Placa Miorrelaxante</h3>
                <p className="text-slate-600 flex-grow mb-6 leading-relaxed">
                  O padrão-ouro para proteção dental. Uma estrutura rígida ou semirrígida feita sob medida que
                  impede o contato entre os dentes e induz o relaxamento muscular durante o sono.
                </p>
                <Button variant="outline" className="w-full justify-between group" asChild>
                  <a href="/placa-miorrelaxante">
                    Saiba mais sobre a Placa
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>

              {/* Botox Card */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:border-purple-200 transition-colors">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Toxina Botulínica</h3>
                <p className="text-slate-600 flex-grow mb-6 leading-relaxed">
                  Intervenção terapêutica para casos de dores musculares intensas. A toxina reduz a força de contração
                  involuntária, aliviando a tensão e preservando a estrutura óssea e dental.
                </p>
                <Button variant="outline" className="w-full justify-between group" asChild>
                  <a href="/botox-bruxismo">
                     Saiba mais sobre o Botox Terapêutico
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-500 italic text-sm max-w-2xl mx-auto">
                * Em muitos casos, uma abordagem combinada (Placa + Terapia Muscular) oferece os melhores resultados a longo prazo.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ - Myths vs Facts */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Mitos e Verdades sobre o Tratamento em Valadares
            </h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center gap-3 mb-2">
                  <span className="text-red-500">Mito:</span> O bruxismo tem cura definitiva.
                </h3>
                <p className="text-slate-600 pl-4 border-l-2 border-slate-300 ml-2">
                  <span className="text-green-600 font-medium">Verdade:</span> O bruxismo é uma condição de controle, não de cura. 
                  O objetivo do tratamento é gerenciar os sintomas, proteger os dentes e evitar a dor, permitindo uma vida normal e confortável.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center gap-3 mb-2">
                  <span className="text-red-500">Mito:</span> Só acontece quando estou dormindo.
                </h3>
                <p className="text-slate-600 pl-4 border-l-2 border-slate-300 ml-2">
                  <span className="text-green-600 font-medium">Verdade:</span> Existe o "bruxismo de vigília" (diurno), caracterizado pelo apertamento 
                  dos dentes durante momentos de foco ou tensão. O tratamento envolve conscientização e mudanças de hábito.
                </p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center gap-3 mb-2">
                  <span className="text-red-500">Mito:</span> Placas de farmácia funcionam igual.
                </h3>
                <p className="text-slate-600 pl-4 border-l-2 border-slate-300 ml-2">
                  <span className="text-green-600 font-medium">Verdade:</span> Placas pré-fabricadas podem desajustar a mordida e agravar problemas na ATM. 
                  A placa deve ser rígida, plana e ajustada milimetricamente pelo dentista.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Dê o Primeiro Passo
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Não conviva com a dor ou o risco de perder estrutura dental. Agende uma avaliação diagnóstica em Governador Valadares para entendermos seu caso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ScheduleModalButton source="tratamento-bruxismo" />
              <Button size="xl" variant="outline" className="border-blue-400 text-white hover:bg-white/10" asChild>
                <a href="https://wa.me/55999999999" target="_blank" rel="noopener noreferrer">
                  Falar com Especialista
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