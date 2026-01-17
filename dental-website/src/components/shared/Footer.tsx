'use client';

import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Stethoscope
} from 'lucide-react';
import { siteConfig } from '@/lib/constants/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description - spans 2 columns */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="font-bold text-xl text-heading-light dark:text-heading-dark">
                OESP - <span className="text-[#2563EB]">Odontologia Especializada</span>
              </span>
            </div>
            <p className="text-sm text-text-light dark:text-text-dark max-w-sm mb-6">
              Especialistas em tratamento de bruxismo e disfunções temporomandibulares. Tecnologia e humanização para o seu sorriso.
            </p>
            <div className="flex space-x-4">
              <a 
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#2563EB] hover:text-white transition-all"
              >
                <span className="text-sm font-bold">IG</span>
              </a>
              <a 
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#2563EB] hover:text-white transition-all"
              >
                <span className="text-sm font-bold">FB</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-heading-light dark:text-heading-dark mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-text-light dark:text-text-dark">
              <li>
                <Link href="/" className="hover:text-[#2563EB] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/#sintomas" className="hover:text-[#2563EB] transition-colors">
                  Sintomas
                </Link>
              </li>
              <li>
                <Link href="/#tratamento" className="hover:text-[#2563EB] transition-colors">
                  Tratamentos
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#2563EB] transition-colors">
                  Dúvidas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-heading-light dark:text-heading-dark mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-text-light dark:text-text-dark">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#2563EB] w-4 h-4 mt-1 flex-shrink-0" />
                <span>
                  {siteConfig.address.street}<br />
                  {siteConfig.address.neighborhood}<br />
                  {siteConfig.address.city} - {siteConfig.address.state}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#2563EB] w-4 h-4 flex-shrink-0" />
                <a 
                  href={`tel:${siteConfig.phone.replace(/\D/g, '')}`}
                  className="hover:text-[#2563EB] transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#2563EB] w-4 h-4 flex-shrink-0" />
                <a 
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-[#2563EB] transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-light dark:text-text-dark opacity-70">
          <p>© {currentYear} Odontologia Especializada. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/politica-privacidade" className="hover:text-[#2563EB] transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos-uso" className="hover:text-[#2563EB] transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}