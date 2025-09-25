'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumb from pathname if items not provided
  const generateBreadcrumb = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Início', href: '/' }
    ];

    const pathMap: Record<string, string> = {
      'tratamento-bruxismo': 'Tratamento de Bruxismo',
      'placa-miorrelaxante': 'Placa Miorrelaxante',
      'botox-bruxismo': 'Botox para Bruxismo',
      'diagnostico-gratuito': 'Diagnóstico Gratuito',
      'tratamentos': 'Tratamentos',
      'sobre': 'Sobre',
      'blog': 'Blog',
      'contato': 'Contato',
      'depoimentos': 'Depoimentos'
    };

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbItems.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = items || generateBreadcrumb();

  if (pathname === '/' || breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index === 0 && <Home className="w-4 h-4 mr-1" />}

              {index === breadcrumbItems.length - 1 ? (
                <span className="text-gray-500 font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  {item.label}
                </Link>
              )}

              {index < breadcrumbItems.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}