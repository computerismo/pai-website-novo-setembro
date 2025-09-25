import { Metadata } from 'next';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { LeadForm } from '@/components/landing/LeadForm';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Shield, Clock, Zap, Heart, Star, Award, Users, Stethoscope } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Placa Miorrelaxante - Proteção Completa contra Bruxismo',
  description: 'Placa dental personalizada para tratamento de bruxismo. Confecção sob medida, material de alta qualidade e resultados imediatos.',
  keywords: 'placa miorrelaxante, placa dental, protetor bucal, bruxismo, ranger dentes',
};

export default function PlacaMiorrelaxantePage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100 rounded-full opacity-30 transform translate-x-40 -translate-y-40"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100 rounded-full opacity-30 transform -translate-x-32 translate-y-32"></div>

          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <Award className="w-4 h-4" />
                  <span>Tratamento Gold Standard FDA</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Placa Miorrelaxante{' '}
                  <span className="text-emerald-600 relative">
                    Premium
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-emerald-200 rounded"></div>
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  A tecnologia mais avançada em placas odontológicas. Proteção total
                  contra bruxismo com conforto excepcional e resultados imediatos.
                </p>

                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-6 rounded-r-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800 mb-2">PROMOÇÃO LIMITADA</h3>
                      <p className="text-amber-700">
                        Avaliação + Moldagem Digital 3D + Plano Personalizado
                        <br />
                        <span className="font-semibold">TOTALMENTE GRÁTIS</span> para os próximos 10 pacientes!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="xl" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4">
                    Garantir Oferta Especial
                  </Button>
                  <Button size="xl" variant="secondary" className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50">
                    Ver Depoimentos
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>Oferta Exclusiva</span>
                    </div>
                  </div>

                  <div className="text-center mb-8 pt-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Placa Premium Personalizada
                    </h2>

                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Avaliação + Moldagem:</span>
                        <span className="text-gray-500 line-through">R$ 450,00</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Confecção da Placa:</span>
                        <span className="text-gray-900 font-semibold">R$ 997,00</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total Hoje:</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">R$ 997,00</div>
                            <div className="text-sm text-green-600">Economia de R$ 450,00</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-6">
                      💳 Parcelamento em até 12x de R$ 97,90
                    </div>
                  </div>

                  <LeadForm campaignId="placa-miorrelaxante" source="landing-page" />

                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Avaliado por 300+ pacientes satisfeitos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                O que Torna Nossa Placa Única?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tecnologia de ponta, materiais premium e um processo
                de confecção que garante máxima precisão e conforto.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Material Biocompatível</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Resina termoplástica de gra FDA, antialérgica e ultra resistente.
                    Desenvolvida especificamente para uso odontológico prolongado.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Certificado FDA</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Garantia 2 anos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>0% BPA</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Tecnologia 3D</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Scanner intraoral de alta precisão para moldagem digital.
                    Elimina o desconforto das moldagens tradicionais com massa.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Scanner 3D German</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Sem desconforto</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Precisão 0,1mm</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Heart className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Conforto Total</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Design anatômico personalizado que se adapta perfeitamente à sua boca.
                    Uso noturno sem incômodo ou interferência na respiração.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>100% personalizada</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Não interfere na respiração</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Adaptação em 2-3 noites</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-6 py-3 rounded-full">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Certificado ISO 13485 - Dispositivos Médicos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Como Funciona o Tratamento?
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Avaliação Completa',
                    description: 'Análise detalhada da sua condição, incluindo exame clínico e radiográfico.',
                    time: '30 min'
                  },
                  {
                    step: '2',
                    title: 'Moldagem Digital 3D',
                    description: 'Escaneamento digital da sua boca, sem massa de moldagem desconfortável.',
                    time: '15 min'
                  },
                  {
                    step: '3',
                    title: 'Confecção Personalizada',
                    description: 'Sua placa é fabricada em laboratório especializado com tecnologia CAD/CAM.',
                    time: '5-7 dias'
                  },
                  {
                    step: '4',
                    title: 'Entrega e Ajustes',
                    description: 'Prova, ajustes finais e instruções de uso e cuidados.',
                    time: '30 min'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-secondary-500 text-white rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-grow bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {item.time}
                        </div>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              O que Nossos Pacientes Dizem
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: 'Maria Silva',
                  age: '34 anos',
                  text: 'Acabaram as dores de cabeça matinais! A placa é super confortável e nem sinto que estou usando.'
                },
                {
                  name: 'João Santos',
                  age: '42 anos',
                  text: 'Minha esposa agradece! Parei de ranger os dentes e voltamos a dormir tranquilos.'
                },
                {
                  name: 'Ana Costa',
                  age: '28 anos',
                  text: 'Vale cada centavo! Meus dentes estão protegidos e não tenho mais dor na mandíbula.'
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.age}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: 'Quanto tempo dura a placa?',
                  answer: 'Com os cuidados adequados, a placa dura em média 2 a 3 anos. Oferecemos garantia de 2 anos contra defeitos de fabricação.'
                },
                {
                  question: 'É desconfortável para dormir?',
                  answer: 'Não! Nossa placa é confeccionada sob medida e com material flexível. A maioria dos pacientes se adapta em 2-3 noites.'
                },
                {
                  question: 'Posso parcelar o pagamento?',
                  answer: 'Sim! Parcelamos em até 12x no cartão de crédito ou oferecemos desconto especial para pagamento à vista.'
                },
                {
                  question: 'Preciso usar todas as noites?',
                  answer: 'Sim, o uso deve ser diário para máxima eficácia. A placa protege seus dentes e mantém a musculatura relaxada durante o sono.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full transform -translate-x-40 translate-y-40"></div>

          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
                <Stethoscope className="w-5 h-5" />
                <span className="text-sm font-medium">Solução Clinicamente Comprovada</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Sua Última Chance de Proteger
                <br />
                <span className="text-yellow-300">Seus Dentes para Sempre!</span>
              </h2>

              <p className="text-xl mb-8 text-emerald-100 max-w-3xl mx-auto leading-relaxed">
                Não deixe o bruxismo destruir seu sorriso. Aproveite nossa promoção
                exclusiva e garante sua placa personalizada com tecnologia 3D.
              </p>

              <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-8 mb-8 max-w-3xl mx-auto border border-white/20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="text-2xl font-bold text-yellow-300 mb-2">
                      SUPER OFERTA LIMITADA
                    </div>
                    <div className="text-lg text-white mb-4">
                      Avaliação + Moldagem 3D + Placa Premium
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-white/70 line-through text-2xl">R$ 1.447</div>
                      <div className="text-4xl font-bold text-yellow-300">R$ 997</div>
                    </div>
                    <div className="text-sm text-emerald-200 mt-2">
                      ou 12x de R$ 97,90 sem juros
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-500 text-white rounded-full px-4 py-2 text-sm font-bold mb-4 inline-block animate-pulse">
                      APENAS 7 VAGAS RESTANTES
                    </div>
                    <div className="text-sm text-white/80">
                      ⏳ Oferta expira em 24 horas
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <Button size="xl" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-12 py-4 text-lg">
                  🎆 GARANTIR MINHA PLACA AGORA
                </Button>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white/20 border-white/40 text-white hover:bg-white/30">
                    📞 WhatsApp: (11) 99999-9999
                  </Button>
                  <Button size="lg" variant="secondary" className="bg-white/20 border-white/40 text-white hover:bg-white/30">
                    📧 Enviar Mensagem
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold">300+</div>
                  <div className="text-sm text-emerald-200">Placas Entregues</div>
                </div>
                <div className="text-center">
                  <Star className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold">4.9/5</div>
                  <div className="text-sm text-emerald-200">Avaliação Média</div>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold">2 Anos</div>
                  <div className="text-sm text-emerald-200">de Garantia</div>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold">24h</div>
                  <div className="text-sm text-emerald-200">Para Entrega</div>
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