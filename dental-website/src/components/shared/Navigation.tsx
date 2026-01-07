'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/lib/constants/site';
import { cn } from '@/lib/utils/cn';

const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contato', href: '/contato' },
] as const;

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-4 right-4 z-50 md:max-w-7xl md:mx-auto">
      <nav className="bg-white/80 backdrop-blur-xl backdrop-saturate-150 border border-white/40 rounded-2xl shadow-2xl shadow-blue-900/20 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className="text-slate-800/90 hover:text-primary-600 hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-300 font-medium"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
{/* <div className="relative p-[2px] bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
              <Button variant="ghost" size="sm" className="bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white/60 rounded-md" asChild>
                <a href={`tel:${siteConfig.phone.replace(/\D/g, '')}`} className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{siteConfig.phone}</span>
                </a>
              </Button>
            </div> */}
            <Button size="sm" asChild>
              <a href="#agendamento">
                <Calendar className="w-4 h-4" />
                Agendar Consulta
              </a>
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-slate-800/90 hover:bg-white/10 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <div
          className={cn(
            'md:hidden fixed top-20 left-4 right-4 z-50',
            mobileMenuOpen ? 'block' : 'hidden'
          )}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/40 p-4 space-y-2">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="block px-3 py-3 text-base text-slate-800/90 hover:text-primary-600 hover:bg-white/10 rounded-lg transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </div>
            ))}
            <div className="pt-4 space-y-3">
{/* <div className="relative p-[2px] bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
                <Button variant="ghost" size="md" className="bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white/70 rounded-md py-4 text-base" fullWidth asChild>
                  <a href={`tel:${siteConfig.phone.replace(/\D/g, '')}`} className="flex items-center justify-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{siteConfig.phone}</span>
                  </a>
                </Button>
              </div> */}
              <Button size="md" className="py-4 text-base" fullWidth asChild>
                <a href="#agendamento">
                  <Calendar className="w-5 h-5" />
                  Agendar Consulta
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}