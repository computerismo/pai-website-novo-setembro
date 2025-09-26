import { Metadata } from 'next';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { LeadForm } from '@/components/landing/LeadForm';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Zap, Clock, Award, AlertTriangle, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Botox para Bruxismo - Tratamento Avançado e Eficaz',
  description: 'Toxina botulínica para tratamento de bruxismo. Procedimento rápido, seguro e com resultados duradouros. Reduza a força muscular excessiva.',
  keywords: 'botox bruxismo, toxina botulínica, tratamento bruxismo, aplicação botox',
};

export default function BotoxBruxismoPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 to-white py-20 pt-36">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  ✨ Tecnologia de Ponta em Odontologia
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Botox para Bruxismo:{' '}
                  <span className="text-purple-500">Solução Definitiva</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Tratamento revolucionário que reduz a força dos músculos
                  mastigatórios, eliminando o ranger de dentes e suas
                  consequências dolorosas.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span><strong>Procedimento rápido:</strong> 15 minutos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span><strong>Resultados:</strong> 3-7 dias</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-green-500" />
                    <span><strong>Duração:</strong> 4-6 meses</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
                  <p className="text-blue-800">
                    <strong>💡 Você Sabia?</strong> O Botox é aprovado pela ANVISA
                    para uso odontológico e é considerado padrão-ouro no tratamento
                    de bruxismo severo.
                  </p>
                </div>

                <Button size="xl" className="w-full md:w-auto bg-purple-500 hover:bg-purple-600">
                  Quero Saber se Sou Candidato
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                  <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Avaliação Gratuita</h2>
                  <p className="text-gray-600">
                    Descubra se o Botox é indicado para seu caso
                  </p>
                </div>
                <LeadForm campaignId="botox-bruxismo" source="landing-page" />
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Como o Botox Trata o Bruxismo?
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Reduz Força Muscular</h3>
                <p className="text-gray-600">
                  Bloqueia temporariamente os sinais nervosos que causam
                  contrações musculares excessivas.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Ação Específica</h3>
                <p className="text-gray-600">
                  Atua diretamente nos músculos masseter e temporal,
                  responsáveis pelo bruxismo.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Preserva Funções</h3>
                <p className="text-gray-600">
                  Mantém a capacidade de mastigação e fala normalmente,
                  apenas reduz a intensidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After Symptoms */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Resultados do Tratamento
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-red-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-red-700 mb-6 text-center">
                  ❌ Antes do Tratamento
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Dores de cabeça intensas pela manhã</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Desgaste severo dos dentes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Dor e travamento da mandíbula</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Hipertrofia dos músculos faciais</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Sono não reparador</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">
                  ✅ Após o Tratamento
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Redução significativa das dores</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Proteção dos dentes contra desgaste</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Relaxamento da musculatura</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Melhora do contorno facial</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Qualidade de vida restaurada</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Procedure Details */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Como é o Procedimento?
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Consulta e Avaliação</h3>
                        <p className="text-gray-600">Análise detalhada dos músculos e planejamento do tratamento.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Aplicação Precisa</h3>
                        <p className="text-gray-600">Microinjeções nos pontos estratégicos dos músculos mastigatórios.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Cuidados Pós-Tratamento</h3>
                        <p className="text-gray-600">Orientações simples para otimizar os resultados do procedimento.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-8 rounded-xl">
                  <h3 className="text-xl font-semibold mb-6">Informações Importantes</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <span><strong>Duração:</strong> 10-15 minutos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-500" />
                      <span><strong>Anestesia:</strong> Não necessária</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                      <span><strong>Retorno:</strong> Imediato às atividades</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-purple-500" />
                      <span><strong>Eficácia:</strong> 95% dos casos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Segurança e Eficácia Comprovadas
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">✅ Aprovações Científicas</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Aprovado pela ANVISA para uso odontológico</li>
                  <li>• Mais de 20 anos de uso seguro na medicina</li>
                  <li>• Estudos clínicos comprovam 95% de eficácia</li>
                  <li>• Procedimento minimamente invasivo</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">🛡️ Contraindicações</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Gravidez ou amamentação</li>
                  <li>• Doenças neuromusculares</li>
                  <li>• Alergia à toxina botulínica</li>
                  <li>• Infecção ativa no local</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Liberte-se do Bruxismo com Botox
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Não deixe o bruxismo controlar sua vida. Com apenas uma sessão,
              você pode ter meses de alívio e proteção para seus dentes.
            </p>
            <div className="bg-white/10 inline-block px-8 py-4 rounded-lg mb-8">
              <div className="text-lg font-semibold mb-2">
                🎯 Consulta de Avaliação Gratuita
              </div>
              <div className="text-sm">
                Descubra se você é candidato ao tratamento
              </div>
            </div>
            <div>
              <Button size="xl" className="bg-white text-purple-600 hover:bg-gray-100">
                Agendar Avaliação Gratuita
              </Button>
            </div>
            <p className="mt-6 text-sm opacity-90">
              ⏰ Atendimento de Segunda a Sábado • 📍 Consultório no Centro
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}