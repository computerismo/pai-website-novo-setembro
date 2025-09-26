import { Metadata } from 'next';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { LeadForm } from '@/components/landing/LeadForm';
import { Button } from '@/components/ui/Button';
import { CheckCircle, AlertCircle, Users, Clock, Award, Shield, Stethoscope, Heart, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tratamento de Bruxismo - Pare de Ranger os Dentes',
  description: 'Tratamento especializado para bruxismo com placa miorrelaxante e toxina botulínica. Recupere sua qualidade de vida e elimine as dores.',
  keywords: 'bruxismo, ranger dentes, placa dental, dor de cabeça, tratamento bruxismo',
};

export default function TratamentoBruxismoPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 pt-36 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-100 rounded-full opacity-20 transform -translate-x-24 translate-y-24"></div>

          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <Stethoscope className="w-4 h-4" />
                  <span>Tratamento Especializado</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Livre-se do{' '}
                  <span className="text-blue-600 relative">
                    Bruxismo
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-200 rounded"></div>
                  </span>{' '}
                  e Recupere sua Qualidade de Vida
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Tratamento especializado com resultados clinicamente comprovados.
                  Elimine as dores, proteja seus dentes e volte a ter noites tranquilas de sono.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Avaliação</div>
                      <div className="text-sm text-gray-600">100% Gratuita</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Personalizado</div>
                      <div className="text-sm text-gray-600">Para seu caso</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Resultados</div>
                      <div className="text-sm text-gray-600">Em 7 dias</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="xl" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                    Agendar Avaliação Gratuita
                  </Button>
                  <Button size="xl" variant="secondary" className="border-2 border-green-600 text-green-600 hover:bg-green-50">
                    Ver Tratamentos
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      ✨ Oferta Especial
                    </div>
                  </div>

                  <div className="text-center mb-8 pt-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Avaliação Completa Gratuita
                    </h2>
                    <p className="text-gray-600">
                      Diagnóstico profissional sem compromisso
                    </p>
                    <div className="text-3xl font-bold text-green-600 mt-4">
                      R$ 0,00
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      Valor normal: R$ 350,00
                    </div>
                  </div>

                  <LeadForm campaignId="tratamento-bruxismo" source="landing-page" />

                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Mais de 500 pacientes atendidos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Symptoms Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Você Reconhece Estes Sintomas?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                O bruxismo afeta milhões de pessoas, mas muitas não sabem que têm a condição.
                Identifique os sinais e procure ajuda profissional.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {[
                { symptom: 'Dores de cabeça matinais', severity: 'alta', icon: '🤕' },
                { symptom: 'Desgaste visível nos dentes', severity: 'alta', icon: '🦷' },
                { symptom: 'Dor na mandíbula ao acordar', severity: 'alta', icon: '😬' },
                { symptom: 'Estalos ao abrir a boca', severity: 'media', icon: '🔊' },
                { symptom: 'Zumbido no ouvido', severity: 'media', icon: '👂' },
                { symptom: 'Tensão muscular facial', severity: 'media', icon: '😣' },
                { symptom: 'Sensibilidade dental', severity: 'baixa', icon: '❄️' },
                { symptom: 'Dificuldade para mastigar', severity: 'alta', icon: '🍴' },
                { symptom: 'Sono não reparador', severity: 'media', icon: '😴' }
              ].map((item, index) => {
                const severityColors = {
                  alta: 'border-red-200 bg-red-50',
                  media: 'border-yellow-200 bg-yellow-50',
                  baixa: 'border-blue-200 bg-blue-50'
                };
                const iconColors = {
                  alta: 'text-red-500',
                  media: 'text-yellow-500',
                  baixa: 'text-blue-500'
                };

                return (
                  <div key={index} className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${severityColors[item.severity as keyof typeof severityColors]}`}>
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-2">{item.symptom}</div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`w-4 h-4 ${iconColors[item.severity as keyof typeof iconColors]}`} />
                          <span className={`text-sm font-medium capitalize ${iconColors[item.severity as keyof typeof iconColors]}`}>
                            Gravidade {item.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Atenção: Não Ignore os Sinais
                </h3>
                <p className="text-lg text-gray-600">
                  Se você identificou <span className="font-bold text-red-600">3 ou mais sintomas</span>,
                  é fundamental buscar tratamento especializado imediatamente.
                </p>
              </div>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8">
                Fazer Autoavaliação Gratuita
              </Button>
            </div>
          </div>
        </section>

        {/* Treatment Options */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tratamentos Especializados para Bruxismo
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Oferecemos as mais modernas técnicas terapêuticas, sempre baseadas em evidências
                científicas e adaptadas às necessidades individuais de cada paciente.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Placa Miorrelaxante Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Placa Miorrelaxante</h3>
                    <div className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block">
                      🏆 Tratamento Gold Standard
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Dispositivo personalizado de alta precisão que protege seus dentes e
                  relaxa a musculatura, proporcionando alívio imediato e duradouro.
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    { text: 'Moldagem digital 3D sem desconforto', icon: '✨' },
                    { text: 'Material biodegradável premium', icon: '🌿' },
                    { text: 'Ajuste perfeito e confortável', icon: '✅' },
                    { text: 'Resultados desde a primeira noite', icon: '🌙' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm">
                        {item.icon}
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-green-200">
                  <div>
                    <div className="text-sm text-gray-600">A partir de</div>
                    <div className="text-2xl font-bold text-green-600">R$ 997</div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Saber Mais
                  </Button>
                </div>
              </div>

              {/* Toxina Botulínica Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Toxina Botulínica</h3>
                    <div className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
                      💬 Tecnologia Avançada
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Aplicação terapêutica de precisão que reduz a força muscular excessiva,
                  tratando a causa raiz do bruxismo com eficácia comprovada.
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    { text: 'Procedimento rápido (15 minutos)', icon: '⏱️' },
                    { text: 'Aplicação minimamente invasiva', icon: '🎯' },
                    { text: 'Efeito duradouro (4-6 meses)', icon: '💪' },
                    { text: '95% de taxa de sucesso', icon: '🏆' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm">
                        {item.icon}
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-blue-200">
                  <div>
                    <div className="text-sm text-gray-600">Consulte valores</div>
                    <div className="text-lg font-semibold text-blue-600">Personalizado</div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Saber Mais
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Stethoscope className="w-6 h-6 text-amber-600" />
                  <span className="text-lg font-semibold text-amber-800">Tratamento Combinado</span>
                </div>
                <p className="text-amber-700 mb-4">
                  Para casos mais complexos, podemos combinar ambas as técnicas,
                  potencializando os resultados e garantindo máxima eficácia.
                </p>
                <Button variant="secondary" className="border-amber-400 text-amber-700 hover:bg-amber-100">
                  Avaliação Personalizada
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Por que Somos Referência em Bruxismo?
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Números que demonstram nossa experiência e compromisso
                com a excelência no tratamento.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <p className="text-blue-100 font-medium">Pacientes Tratados</p>
                <p className="text-blue-200 text-sm mt-1">com sucesso</p>
              </div>

              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">98%</div>
                <p className="text-blue-100 font-medium">Taxa de Satisfação</p>
                <p className="text-blue-200 text-sm mt-1">dos nossos pacientes</p>
              </div>

              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">7</div>
                <p className="text-blue-100 font-medium">Dias para Resultados</p>
                <p className="text-blue-200 text-sm mt-1">primeiros sinais</p>
              </div>

              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">15+</div>
                <p className="text-blue-100 font-medium">Anos de Experiência</p>
                <p className="text-blue-200 text-sm mt-1">especializados</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Star className="w-5 h-5 text-yellow-300 fill-current" />
                <span className="text-white font-medium">Clínica Certificada pela ANVISA</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full transform translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500 opacity-10 rounded-full transform -translate-x-32 translate-y-32"></div>

          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium">Sua Saúde Bucal é Nossa Prioridade</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Pare de Sofrer com o Bruxismo.
                <br />
                <span className="text-blue-300">Comece sua Transformação Hoje!</span>
              </h2>

              <p className="text-xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Não deixe o bruxismo roubar mais noites de sono tranquilas.
                Agende sua avaliação gratuita e descubra como podemos devolver
                sua qualidade de vida em apenas alguns dias.
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">
                    OFERTA ESPECIAL
                  </div>
                  <div className="text-lg text-white mb-4">
                    Avaliação Completa + Plano de Tratamento
                  </div>
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="text-gray-400 line-through text-xl">R$ 350,00</div>
                    <div className="text-4xl font-bold text-green-300">GRÁTIS</div>
                  </div>
                  <div className="text-sm text-blue-200">
                    ⏳ Oferta válida apenas para os próximos 15 pacientes
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button size="xl" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold">
                  🎆 Garantir Minha Vaga Gratuita
                </Button>
                <Button size="xl" variant="secondary" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                  📞 Ligar Agora: (11) 99999-9999
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-blue-300" />
                  <span className="text-sm text-blue-200">Seg-Sáb: 8h-18h</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-green-300" />
                  <span className="text-sm text-blue-200">Atendimento Seguro</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm text-blue-200">Resultados Garantidos</span>
                </div>
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