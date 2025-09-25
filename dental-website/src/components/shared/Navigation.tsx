'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/lib/constants/site';
import { cn } from '@/lib/utils/cn';

const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Tratamentos', href: '/tratamentos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Depoimentos', href: '/depoimentos' },
  { label: 'Contato', href: '/contato' },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-500">
              {siteConfig.name}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-primary-500 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href={`tel:${siteConfig.phone.replace(/\D/g, '')}`}>
                <Phone className="w-4 h-4" />
                {siteConfig.phone}
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="#agendamento">
                <Calendar className="w-4 h-4" />
                Agendar Consulta
              </a>
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        <div
          className={cn(
            'md:hidden',
            mobileMenuOpen ? 'block' : 'hidden'
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button variant="outline" size="sm" fullWidth asChild>
                <a href={`tel:${siteConfig.phone.replace(/\D/g, '')}`}>
                  <Phone className="w-4 h-4" />
                  {siteConfig.phone}
                </a>
              </Button>
              <Button size="sm" fullWidth asChild>
                <a href="#agendamento">
                  <Calendar className="w-4 h-4" />
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