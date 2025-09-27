'use client';

import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Car,
  Bus,
  AlertTriangle,
  Send,
  CheckCircle,
  Star,
  Navigation as NavigationIcon,
  PhoneCall
} from 'lucide-react';
import { siteConfig } from '@/lib/constants/site';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const subjectOptions = [
    { value: 'consulta', label: 'Agendamento de Consulta' },
    { value: 'bruxismo', label: 'Tratamento de Bruxismo' },
    { value: 'placa', label: 'Placa Miorrelaxante' },
    { value: 'botox', label: 'Botox para Bruxismo' },
    { value: 'emergencia', label: 'Emergência Odontológica' },
    { value: 'informacoes', label: 'Informações Gerais' },
    { value: 'convenio', label: 'Convênios e Pagamentos' },
    { value: 'outro', label: 'Outro Assunto' }
  ];

  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-48 h-48 bg-teal-200 rounded-full filter blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block mb-6">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  Entre em Contato
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Fale <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Conosco</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Estamos prontos para atendê-lo com dedicação e carinho. Entre em contato para agendar
                sua consulta gratuita ou tirar suas dúvidas sobre nossos tratamentos especializados.
              </p>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* Contact Information Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-b border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  💬 Informações de Contato
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Como Nos Encontrar
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Múltiplas formas de entrar em contato conosco para sua comodidade
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full filter blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200 rounded-full filter blur-2xl"></div>
              </div>

              {/* Address Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors">
                  Endereço
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p>Rua das Flores, 456</p>
                  <p>Centro</p>
                  <p>Governador Valadares - MG</p>
                  <p>CEP: 35010-123</p>
                </div>
                <a
                  href="https://maps.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <NavigationIcon className="w-4 h-4 mr-2" />
                  Ver no mapa
                </a>
              </div>

              {/* Phone Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors">
                  Telefones
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:+553332261234"
                    className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    (33) 3226-1234
                  </a>
                  <a
                    href="tel:+5533999876543"
                    className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    (33) 99987-6543
                  </a>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Fixo e WhatsApp
                </p>
              </div>

              {/* Email Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-700 transition-colors">
                  E-mail
                </h3>
                <a
                  href="mailto:contato@odontologiavaladares.com.br"
                  className="text-gray-600 hover:text-purple-600 transition-colors block mb-2"
                >
                  contato@odontologiavaladares.com.br
                </a>
                <a
                  href="mailto:agendamento@odontologiavaladares.com.br"
                  className="text-gray-600 hover:text-purple-600 transition-colors block"
                >
                  agendamento@odontologiavaladares.com.br
                </a>
                <p className="text-sm text-gray-500 mt-2">
                  Resposta em até 2 horas
                </p>
              </div>

              {/* Hours Card */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:-translate-y-1 group">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-teal-700 transition-colors">
                  Horário de Atendimento
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex justify-between">
                    <span>Segunda a Sexta:</span>
                    <span className="font-medium">8h às 18h</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sábado:</span>
                    <span className="font-medium">8h às 12h</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Domingo:</span>
                    <span className="font-medium text-red-500">Fechado</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-b border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  📝 Formulário de Contato
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Envie Sua Mensagem
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Preencha o formulário abaixo e entraremos em contato em breve
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Form */}
                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Mensagem Enviada!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Obrigado pelo contato! Responderemos em breve.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                      >
                        Enviar Nova Mensagem
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Nome Completo"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          required
                          placeholder="Seu nome completo"
                          className="bg-white"
                        />
                        <Input
                          label="E-mail"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="seu@email.com"
                          className="bg-white"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Telefone"
                          name="telefone"
                          type="tel"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          required
                          placeholder="(33) 99999-9999"
                          className="bg-white"
                        />
                        <Select
                          label="Assunto"
                          name="assunto"
                          value={formData.assunto}
                          onChange={handleInputChange}
                          options={subjectOptions}
                          required
                          className="bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mensagem
                        </label>
                        <textarea
                          name="mensagem"
                          value={formData.mensagem}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          placeholder="Descreva como podemos ajudá-lo..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700">
                          <strong>Política de Privacidade:</strong> Seus dados são protegidos e utilizados apenas
                          para fins de contato e agendamento. Não compartilhamos informações com terceiros.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Enviar Mensagem
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>

                {/* Contact Benefits */}
                <div className="space-y-6">
                  <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Por que nos escolher?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Resposta rápida em até 2 horas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Atendimento personalizado</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Primeira consulta gratuita</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Especialistas em bruxismo</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-xl p-6 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Star className="text-white text-lg w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-green-800 mb-2">Garantia de Satisfação</h3>
                        <p className="text-green-700 leading-relaxed">
                          Nosso compromisso é com sua total satisfação. Oferecemos acompanhamento
                          completo e garantia nos nossos tratamentos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* Location & Directions Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 relative border-b border-blue-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                  🗺️ Localização
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Como Chegar
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Estamos localizados no centro de Governador Valadares, com fácil acesso
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Map Placeholder */}
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 shadow-xl overflow-hidden">
                <div className="h-80 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Mapa Interativo</h3>
                    <p className="text-gray-600 max-w-xs">
                      Integração com Google Maps será implementada aqui
                    </p>
                    <a
                      href="https://maps.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <NavigationIcon className="w-4 h-4 mr-2" />
                      Abrir no Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Directions Info */}
              <div className="space-y-6">
                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">De Carro</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Pela Avenida Brasil, siga até o Centro</li>
                    <li>• Vire à direita na Rua Marechal Deodoro</li>
                    <li>• Continue por 500m até a Rua das Flores</li>
                    <li>• Estacionamento próprio disponível</li>
                  </ul>
                </div>

                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Bus className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Transporte Público</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Linhas de ônibus: 101, 205, 308</li>
                    <li>• Ponto de referência: Banco do Brasil Centro</li>
                    <li>• Caminhada de 2 minutos do ponto</li>
                    <li>• Acesso para pessoas com deficiência</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Pontos de Referência</h3>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Próximo ao Shopping Cidade do Vale</li>
                    <li>• Em frente à Praça São João Batista</li>
                    <li>• Entre o Banco do Brasil e a Farmácia Rosário</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        </section>

        {/* WhatsApp Contact Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 via-green-25 to-emerald-50 relative border-b border-green-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-full shadow-sm border border-green-100">
                  💬 WhatsApp
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Atendimento via WhatsApp
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Fale conosco diretamente pelo WhatsApp para um atendimento mais rápido e personalizado
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl border border-green-200 p-6 shadow-xl hover:shadow-2xl hover:bg-green-50/50 transition-all duration-300 hover:-translate-y-1">
                <div className="text-center">
                  <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Agendamento</h3>
                  <p className="text-gray-600 mb-4">
                    Agende sua consulta rapidamente via WhatsApp
                  </p>
                  <a
                    href="https://wa.me/5533999876543?text=Olá! Gostaria de agendar uma consulta."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Agendar via WhatsApp
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-green-200 p-6 shadow-xl hover:shadow-2xl hover:bg-green-50/50 transition-all duration-300 hover:-translate-y-1">
                <div className="text-center">
                  <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Emergência</h3>
                  <p className="text-gray-600 mb-4">
                    Para situações de emergência odontológica
                  </p>
                  <a
                    href="https://wa.me/5533999876543?text=EMERGÊNCIA: Preciso de atendimento urgente."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergência
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-green-200 p-6 shadow-xl hover:shadow-2xl hover:bg-green-50/50 transition-all duration-300 hover:-translate-y-1">
                <div className="text-center">
                  <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Informações</h3>
                  <p className="text-gray-600 mb-4">
                    Tire suas dúvidas sobre tratamentos
                  </p>
                  <a
                    href="https://wa.me/5533999876543?text=Olá! Gostaria de saber mais sobre os tratamentos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Falar Conosco
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-xl border border-green-200 p-6 shadow-xl max-w-3xl mx-auto">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Horário de Atendimento WhatsApp</h3>
                <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                  <div>
                    <strong className="text-gray-900">Segunda a Sexta</strong>
                    <p>7h30 às 18h30</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">Sábado</strong>
                    <p>7h30 às 12h30</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">Domingo</strong>
                    <p className="text-red-500">Apenas emergências</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
        </section>

        {/* Emergency Contact Section */}
        <section className="py-20 bg-gradient-to-br from-red-50 via-red-25 to-orange-50 relative border-b border-red-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-red-600 bg-red-50 px-4 py-2 rounded-full shadow-sm border border-red-100">
                  🚨 Emergências
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Atendimento de Emergência
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Para situações de urgência odontológica, oferecemos atendimento especial
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-red-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Linha de Emergência</h3>
                    <p className="text-gray-600">24 horas por dia, 7 dias por semana</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <a
                    href="tel:+5533999876543"
                    className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <p className="font-bold text-gray-900">(33) 99987-6543</p>
                      <p className="text-sm text-gray-600">WhatsApp de Emergência</p>
                    </div>
                  </a>

                  <a
                    href="tel:+553332261234"
                    className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    <PhoneCall className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <p className="font-bold text-gray-900">(33) 3226-1234</p>
                      <p className="text-sm text-gray-600">Linha Direta de Emergência</p>
                    </div>
                  </a>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> Em casos de emergência fora do horário comercial,
                    será cobrada taxa adicional conforme tabela de plantão.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Situações de Emergência</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Dor intensa de dente</strong>
                      <p className="text-gray-600 text-sm">Dor que não cede com analgésicos comuns</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Trauma dental</strong>
                      <p className="text-gray-600 text-sm">Dente quebrado, avulsionado ou com mobilidade</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Sangramento intenso</strong>
                      <p className="text-gray-600 text-sm">Sangramento que não para após 30 minutos</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Infecção severa</strong>
                      <p className="text-gray-600 text-sm">Inchaço facial, febre ou dificuldade para engolir</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Problemas com aparelho</strong>
                      <p className="text-gray-600 text-sm">Fio cortando ou peça solta causando ferimento</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Primeiro Socorro:</strong> Enquanto aguarda o atendimento, aplique gelo
                    externamente e evite alimentos quentes. Mantenha a calma e entre em contato conosco.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-sky-700 to-cyan-700 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl translate-y-48 -translate-x-48"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-4xl mx-auto">
              <div className="inline-block mb-6">
                <span className="text-sm font-medium text-blue-100 bg-blue-500 px-4 py-2 rounded-full">
                  🦷 Sua Saúde é Nossa Prioridade
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Pronto para Cuidar do Seu Sorriso?
              </h2>

              <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Entre em contato hoje mesmo e dê o primeiro passo para recuperar sua qualidade de vida.
                Nossa equipe está pronta para atendê-lo com excelência e carinho.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                <a
                  href="https://wa.me/5533999876543?text=Olá! Gostaria de agendar uma consulta."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar via WhatsApp
                </a>

                <a
                  href="tel:+553332261234"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-teal-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Ligar Agora
                </a>
              </div>

              <p className="text-sm text-blue-100 mt-6">
                📞 Resposta imediata • 🎯 Atendimento personalizado • ✨ Primeira consulta gratuita
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}