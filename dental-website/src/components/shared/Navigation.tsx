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

export function Navigation({ onOpenModal }: { onOpenModal?: () => void }) {
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
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-xl font-bold text-heading-light dark:text-heading-dark tracking-tight">
              OESP - <span className="text-[#2563EB]">Odontologia Especializada</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
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
                    className="flex items-center gap-1 text-sm font-medium text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {link.label}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === link.label ? "rotate-180" : "")} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors"
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
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-text-light dark:text-text-dark hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <button 
              onClick={onOpenModal}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-500/30"
            >
              Agendar Consulta
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-20 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="p-4 space-y-2 h-[calc(100vh-5rem)] overflow-y-auto">
          {navLinks.map((link) => (
            <div key={link.label}>
              {link.children ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(link.label)}
                    className="flex items-center justify-between w-full px-3 py-3 text-base font-medium text-text-light dark:text-text-dark hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                  >
                    {link.label}
                    <ChevronDown className={cn("w-5 h-5 transition-transform", activeDropdown === link.label ? "rotate-180" : "")} />
                  </button>
                  {activeDropdown === link.label && (
                    <div className="pl-4 space-y-1 border-l-2 border-blue-100 dark:border-blue-900 ml-3">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-text-light dark:text-text-dark hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
                  className="block px-3 py-3 text-base font-medium text-text-light dark:text-text-dark hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenModal?.();
              }}
              className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-500/30"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Consulta
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
