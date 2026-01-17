"use client";

import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { LeadForm } from '@/components/landing/LeadForm';
import {
  MapPin,
  Phone,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Navigation as NavigationIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/constants/site";

export default function ContatoPage() {

  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-[#F8FAFC] dark:bg-background-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-heading-light dark:text-heading-dark mb-6">
                Fale{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                  Conosco
                </span>
              </h1>
              <p className="text-xl text-text-light dark:text-text-dark leading-relaxed">
                Estamos prontos para atendê-lo com dedicação e carinho. Entre em
                contato para agendar sua consulta gratuita ou tirar suas dúvidas
                sobre nossos tratamentos especializados.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 lg:py-24 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#2563EB] font-semibold tracking-wider uppercase text-sm">Mensagem</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mt-2 mb-6">
                Envie Sua Mensagem
              </h2>
              <p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">
                Preencha o formulário abaixo e entraremos em contato em breve
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm hover:shadow-md transition-all">
                <LeadForm source="contact_page" />
              </div>
            </div>
          </div>
        </section>

        {/* Location & Directions Section */}
        <section className="py-16 lg:py-24 bg-[#F8FAFC] dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#2563EB] font-semibold tracking-wider uppercase text-sm">Localização</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mt-2 mb-6">
                Como Chegar
              </h2>
              <p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">
                Estamos localizados no centro de Governador Valadares, com fácil
                acesso
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden h-[500px] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1891.1!2d-41.9510286!3d-18.8435404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDUwJzM2LjciUyA0McKwNTcnMDMuNyJX!5e0!3m2!1spt-BR!2sbr!4v1650000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                ></iframe>

                <a
                  href="https://www.google.com/maps/search/rua+monte+azul+232+governador+valadares+cep+esperan%C3%A7a/@-18.8435404,-41.9510286,8978m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI2MDEwNC4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-white text-[#2563EB] px-4 py-2 rounded-xl shadow-lg hover:bg-gray-50 transition-colors font-medium flex items-center z-10"
                >
                  <NavigationIcon className="w-4 h-4 mr-2" />
                  Abrir no Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp Contact Section */}
        <section className="py-16 lg:py-24 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">WhatsApp</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-heading-light dark:text-heading-dark mt-2 mb-6">
                Atendimento via WhatsApp
              </h2>
              <p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">
                Fale conosco diretamente pelo WhatsApp para um atendimento mais
                rápido e personalizado
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-green-500/30 hover:shadow-md transition-all group">
                <div className="text-center">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-600 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark mb-2">
                    Agendamento
                  </h3>
                  <p className="text-sm text-text-light dark:text-text-dark mb-4">
                    Agende sua consulta rapidamente via WhatsApp
                  </p>
                  <a
                    href="https://wa.me/5533999876543?text=Olá! Gostaria de agendar uma consulta."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Agendar via WhatsApp
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-red-500/30 hover:shadow-md transition-all group">
                <div className="text-center">
                  <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-red-500 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark mb-2">
                    Emergência
                  </h3>
                  <p className="text-sm text-text-light dark:text-text-dark mb-4">
                    Para situações de emergência odontológica
                  </p>
                  <a
                    href="https://wa.me/5533999876543?text=EMERGÊNCIA: Preciso de atendimento urgente."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergência
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#2563EB]/30 hover:shadow-md transition-all group">
                <div className="text-center">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#2563EB] group-hover:scale-110 transition-transform">
                    <Phone className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark mb-2">
                    Informações
                  </h3>
                  <p className="text-sm text-text-light dark:text-text-dark mb-4">
                    Tire suas dúvidas sobre tratamentos
                  </p>
                  <a
                    href="https://wa.me/5533999876543?text=Olá! Gostaria de saber mais sobre os tratamentos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1D4ED8] transition-colors text-sm font-medium"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Falar Conosco
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#2563EB] opacity-90 dark:opacity-80 z-0"></div>
          <div 
            className="absolute inset-0 opacity-10 z-0" 
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
          ></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Pronto para Cuidar do Seu Sorriso?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Entre em contato hoje mesmo e dê o primeiro passo para recuperar
              sua qualidade de vida. Nossa equipe está pronta para atendê-lo
              com excelência e carinho.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/5533999876543?text=Olá! Gostaria de agendar uma consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-[#2563EB] font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Falar via WhatsApp
              </a>
              <a
                href="tel:+553332261234"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Ligar Agora
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
