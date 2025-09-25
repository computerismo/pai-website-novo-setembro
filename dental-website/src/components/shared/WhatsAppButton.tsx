'use client';

import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/constants/site';
import { trackWhatsApp } from '@/lib/analytics/gtag';

export function WhatsAppButton() {
  const message = 'Olá! Gostaria de saber mais sobre os tratamentos odontológicos.';
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    trackWhatsApp(window.location.pathname);
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 animate-pulse"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}