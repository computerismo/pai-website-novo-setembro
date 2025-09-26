import { Metadata } from 'next';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { LeadForm } from '@/components/landing/LeadForm';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Gift, Clock, Users, AlertCircle, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Diagnóstico Gratuito de Bruxismo - Agende Agora',
  description: 'Avaliação completa e gratuita para diagnóstico de bruxismo. Descubra se você tem a condição e qual o melhor tratamento. Vagas limitadas.',
  keywords: 'diagnóstico gratuito, avaliação bruxismo, consulta grátis, exame bruxismo',
};

export default function DiagnosticoGratuitoPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-white py-20 pt-36">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4 animate-pulse">
                🔥 OFERTA LIMITADA - Apenas 15 Vagas Este Mês!
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Diagnóstico{' '}
                <span className="text-green-500">100% Gratuito</span>{' '}
                de Bruxismo
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Descubra se você tem bruxismo e qual o melhor tratamento
                para o seu caso. <strong>Sem compromisso, sem taxas.</strong>
              </p>

              <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Gift className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-lg font-bold text-yellow-800">
                    O que está Incluso GRÁTIS:
                  </h3>
                </div>
                <ul className="text-left space-y-2 text-yellow-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Consulta completa com especialista (R$ 200,00)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Exame clínico detalhado (R$ 150,00)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Plano de tratamento personalizado (R$ 100,00)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Orientações de autocuidado (R$ 80,00)</span>
                  </li>
                </ul>
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-600">Valor total: R$ 530,00</div>
                  <div className="text-2xl font-bold text-green-600">HOJE: GRÁTIS</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-8 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Restam apenas 7 vagas disponíveis</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-200">
                <div className="text-center mb-8">
                  <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">
                    Garanta Sua Vaga Gratuita
                  </h2>
                  <p className="text-gray-600">
                    Preencha o formulário e receba confirmação em até 2 horas
                  </p>
                </div>

                <LeadForm
                  campaignId="diagnostico-gratuito"
                  source="landing-page"
                />

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Seus dados estão protegidos pela LGPD
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Free Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Por que Oferecemos Diagnóstico Gratuito?
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Conscientização</h3>
                  <p className="text-gray-600">
                    90% das pessoas com bruxismo não sabem que têm a condição.
                    Queremos mudar essa realidade.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Prevenção</h3>
                  <p className="text-gray-600">
                    Diagnosticar precocemente evita complicações graves e
                    tratamentos mais caros no futuro.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Compromisso Social</h3>
                  <p className="text-gray-600">
                    Acreditamos que toda pessoa merece acesso a cuidados
                    de qualidade em saúde bucal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Como Funciona sua Consulta Gratuita?
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {[
                  {
                    step: '1',
                    title: 'Chegada e Acolhimento',
                    description: 'Recepção calorosa e preenchimento de anamnese detalhada sobre seus sintomas.',
                    time: '5 min',
                    icon: '🏥'
                  },
                  {
                    step: '2',
                    title: 'Entrevista Clínica',
                    description: 'Conversa aprofundada sobre seus hábitos, sintomas e histórico médico.',
                    time: '10 min',
                    icon: '💬'
                  },
                  {
                    step: '3',
                    title: 'Exame Físico Completo',
                    description: 'Avaliação da ATM, músculos mastigatórios, desgastes dentários e oclusão.',
                    time: '15 min',
                    icon: '🔍'
                  },
                  {
                    step: '4',
                    title: 'Diagnóstico e Orientações',
                    description: 'Explicação clara do diagnóstico e apresentação das opções de tratamento.',
                    time: '10 min',
                    icon: '📋'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-grow bg-white p-6 rounded-lg shadow-md">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <h3 className="text-xl font-semibold">{item.title}</h3>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 mr-1" />
                          {item.time}
                        </div>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">⏱️ Duração Total: 40 minutos</h3>
                <p className="text-gray-600">
                  Tempo suficiente para uma avaliação completa e esclarecimento de todas as suas dúvidas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency Section */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-red-700">
                ⚠️ Não Deixe para Depois!
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-red-600">
                    Consequências de Não Tratar:
                  </h3>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li>• Desgaste irreversível dos dentes</li>
                    <li>• Fraturas dentárias e de restaurações</li>
                    <li>• Dores crônicas de cabeça e face</li>
                    <li>• Problemas na articulação (ATM)</li>
                    <li>• Perda de qualidade de vida</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-green-600">
                    Benefícios do Diagnóstico Precoce:
                  </h3>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li>• Tratamento mais simples e barato</li>
                    <li>• Prevenção de complicações graves</li>
                    <li>• Alívio rápido dos sintomas</li>
                    <li>• Proteção do seu sorriso</li>
                    <li>• Melhora imediata do sono</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-100 border border-red-300 p-4 rounded-lg mb-8">
                <p className="text-red-800 font-medium">
                  ⏳ <strong>ATENÇÃO:</strong> Esta oferta é válida apenas para os primeiros 15 pacientes.
                  Após esse limite, o valor da consulta retorna para R$ 530,00.
                </p>
              </div>

              <Button size="xl" className="bg-red-500 hover:bg-red-600 text-white">
                Garantir Minha Consulta Gratuita Agora
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