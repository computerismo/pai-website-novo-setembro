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
    <footer className="relative bg-gradient-to-tr from-sky-900 via-slate-800 to-sky-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-teal-400 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400 rounded-full filter blur-2xl"></div>
      </div>

      {/* Decorative Top Border */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl hover:bg-white/10 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-white">{siteConfig.name}</h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex space-x-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm p-3 rounded-full text-white/90 hover:text-white hover:bg-blue-500/20 transition-all duration-300 hover:scale-110 border border-white/10"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm p-3 rounded-full text-white/90 hover:text-white hover:bg-teal-500/20 transition-all duration-300 hover:scale-110 border border-white/10"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl hover:bg-white/10 transition-all duration-300">
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full mr-3"></div>
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Sobre Nós', href: '/sobre' },
                { label: 'Tratamentos', href: '/tratamentos' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contato', href: '/contato' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/90 hover:text-white transition-all duration-200 flex items-center group hover:translate-x-1"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 text-blue-300 group-hover:text-teal-300 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl hover:bg-white/10 transition-all duration-300">
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full mr-3"></div>
              Tratamentos
            </h4>
            <ul className="space-y-3">
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
                    className="text-white/90 hover:text-white transition-all duration-200 flex items-center group hover:translate-x-1"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 text-teal-300 group-hover:text-blue-300 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl hover:bg-white/10 transition-all duration-300">
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3"></div>
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mr-3 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-blue-300 group-hover:text-teal-300 transition-colors" />
                </div>
                <span className="text-white/90 text-sm leading-relaxed">
                  {siteConfig.address.street}<br />
                  {siteConfig.address.neighborhood}<br />
                  {siteConfig.address.city} - {siteConfig.address.state}<br />
                  CEP: {siteConfig.address.zipCode}
                </span>
              </li>
              <li className="flex items-center group">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mr-3">
                  <Phone className="w-4 h-4 text-blue-300 group-hover:text-teal-300 transition-colors" />
                </div>
                <a
                  href={`tel:${siteConfig.phone.replace(/\D/g, '')}`}
                  className="text-white/90 hover:text-white transition-colors text-sm"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center group">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mr-3">
                  <Mail className="w-4 h-4 text-blue-300 group-hover:text-teal-300 transition-colors" />
                </div>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-white/90 hover:text-white transition-colors text-sm"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <div className="flex items-start group">
                  <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mr-3 flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-300 group-hover:text-teal-300 transition-colors" />
                  </div>
                  <div className="text-white/90 text-sm leading-relaxed">
                    <p>{siteConfig.openingHours.weekdays}</p>
                    <p>{siteConfig.openingHours.saturday}</p>
                    <p>{siteConfig.openingHours.sunday}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 relative">
          {/* Decorative Line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/90 text-sm mb-4 md:mb-0 flex items-center">
                <span className="mr-2">©</span>
                {currentYear} {siteConfig.name}. Todos os direitos reservados.
              </p>
              <div className="flex space-x-6 text-sm">
                <Link
                  href="/politica-privacidade"
                  className="text-white/90 hover:text-white transition-all duration-200 hover:translate-y-[-1px]"
                >
                  Política de Privacidade
                </Link>
                <div className="w-px h-4 bg-white/20"></div>
                <Link
                  href="/termos-uso"
                  className="text-white/90 hover:text-white transition-all duration-200 hover:translate-y-[-1px]"
                >
                  Termos de Uso
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Border */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>
    </footer>
  );
}