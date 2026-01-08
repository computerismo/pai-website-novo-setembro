"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navLinks: NavLink[] = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  {
    label: "Tratamentos",
    href: "#",
    children: [
      { label: "Botox para Bruxismo", href: "/botox-bruxismo" },
      { label: "Placa Miorrelaxante", href: "/placa-miorrelaxante" },
      { label: "Tratamento de Bruxismo", href: "/tratamento-bruxismo" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

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
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => link.children && setActiveDropdown(null)}
              >
                {link.children ? (
                  <button
                    className="flex items-center gap-1 text-slate-800/90 hover:text-primary-600 hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-300 font-medium"
                  >
                    {link.label}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === link.label ? "rotate-180" : "")} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-slate-800/90 hover:text-primary-600 hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-300 font-medium"
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {link.children && (
                  <div
                    className={cn(
                      "absolute top-full left-0 w-56 pt-2 transition-all duration-200 opacity-0 invisible translate-y-2",
                      activeDropdown === link.label && "opacity-100 visible translate-y-0"
                    )}
                  >
                    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/40 p-2 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-slate-700 hover:text-primary-600 hover:bg-blue-50/50 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
            "md:hidden fixed top-20 left-4 right-4 z-50",
            mobileMenuOpen ? "block" : "hidden"
          )}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/40 p-4 space-y-2 h-[80vh] overflow-y-auto">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="flex items-center justify-between w-full px-3 py-3 text-base text-slate-800/90 hover:text-primary-600 hover:bg-white/10 rounded-lg transition-all duration-300"
                    >
                      {link.label}
                      <ChevronDown className={cn("w-5 h-5 transition-transform", activeDropdown === link.label ? "rotate-180" : "")} />
                    </button>
                    {activeDropdown === link.label && (
                      <div className="pl-4 space-y-1 border-l-2 border-blue-100 ml-3">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-primary-600 hover:bg-blue-50/50 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-3 py-3 text-base text-slate-800/90 hover:text-primary-600 hover:bg-white/10 rounded-lg transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-3 border-t border-slate-100 mt-4">
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
