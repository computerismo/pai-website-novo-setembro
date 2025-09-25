import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  ChevronRight
} from 'lucide-react';
import { siteConfig } from '@/lib/constants/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{siteConfig.name}</h3>
            <p className="text-gray-400 mb-4">
              {siteConfig.description}
            </p>
            <div className="flex space-x-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {[
                { label: 'Sobre Nós', href: '/sobre' },
                { label: 'Tratamentos', href: '/tratamentos' },
                { label: 'Blog', href: '/blog' },
                { label: 'Depoimentos', href: '/depoimentos' },
                { label: 'Contato', href: '/contato' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Tratamentos</h4>
            <ul className="space-y-2">
              {[
                { label: 'Bruxismo', href: '/tratamentos/bruxismo' },
                { label: 'Placa Miorrelaxante', href: '/tratamentos/placa-miorrelaxante' },
                { label: 'Botox', href: '/tratamentos/botox' },
                { label: 'DTM', href: '/tratamentos/dtm' },
                { label: 'Clareamento', href: '/tratamentos/clareamento' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  {siteConfig.address.street}<br />
                  {siteConfig.address.neighborhood}<br />
                  {siteConfig.address.city} - {siteConfig.address.state}<br />
                  CEP: {siteConfig.address.zipCode}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary-400" />
                <a
                  href={`tel:${siteConfig.phone.replace(/\D/g, '')}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-400" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-2 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div className="text-gray-400">
                    <p>{siteConfig.openingHours.weekdays}</p>
                    <p>{siteConfig.openingHours.saturday}</p>
                    <p>{siteConfig.openingHours.sunday}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} {siteConfig.name}. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 text-sm">
              <Link
                href="/politica-privacidade"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/termos-uso"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}