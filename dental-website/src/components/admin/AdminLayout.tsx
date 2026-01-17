"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  BarChart3,
  ChevronDown,
  Settings,
  Search,
} from "lucide-react";
import { useState, Suspense } from "react";
import { NotificationBell } from "./NotificationBell";

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
          active
            ? "bg-blue-50 text-[#2563EB]"
            : "text-slate-600 hover:text-[#2563EB] hover:bg-slate-50"
        }`}
      >
        <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
          active 
            ? "bg-white shadow-sm text-[#2563EB]" 
            : "bg-slate-100 group-hover:bg-white group-hover:shadow-sm text-slate-500 group-hover:text-[#2563EB]"
        }`}>
          <Icon className="w-4 h-4" />
        </div>
        {label}
        {active && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
        )}
      </Link>
    );
  };

  const CollapsibleNavItem = ({ 
    icon: Icon, 
    label, 
    children, 
    basePath 
  }: { 
    icon: any; 
    label: string; 
    children: React.ReactNode;
    basePath: string;
  }) => {
    const isChildActive = pathname?.startsWith(basePath);
    const [isOpen, setIsOpen] = useState(isChildActive);
    
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
            isChildActive
              ? "text-[#2563EB]"
              : "text-slate-600 hover:text-[#2563EB] hover:bg-slate-50"
          }`}
        >
          <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
            isChildActive 
              ? "bg-white shadow-sm text-[#2563EB]" 
              : "bg-slate-100 group-hover:bg-white group-hover:shadow-sm text-slate-500 group-hover:text-[#2563EB]"
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="flex-1 text-left">{label}</span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#2563EB]' : 'text-slate-400'}`} 
          />
        </button>
        
        <div 
          className={`grid transition-all duration-200 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
             <div className="ml-6 mt-1 space-y-1 border-l border-slate-200 pl-2">
               {children}
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Premium Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white transform transition-transform duration-300 ease-out lg:translate-x-0 border-r border-slate-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
            <Link href="/admin/dashboard" className="flex items-center group">
              <div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">OESP</span>
                <span className="text-xl font-light text-[#2563EB]">Dental</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto sidebar-scrollbar">
            <p className="px-4 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Visão Geral
            </p>
            <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            
            <div className="py-3">
              <div className="border-t border-slate-100 mx-2"></div>
            </div>
            
            <p className="px-4 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Análise Web
            </p>
            <CollapsibleNavItem 
              icon={BarChart3} 
              label="Análise de Tráfego" 
              basePath="/admin/analytics"
            >
              <Link
                href="/admin/analytics"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/analytics'
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Visão Geral
              </Link>
              <Link
                href="/admin/analytics/comportamento"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/analytics/comportamento'
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Comportamento
              </Link>
              <Link
                href="/admin/analytics/audiencia"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/analytics/audiencia'
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Audiência
              </Link>
              <Link
                href="/admin/analytics/aquisicao"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/analytics/aquisicao'
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Aquisição
              </Link>
              <Link
                href="/admin/analytics/tempo-real"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/analytics/tempo-real'
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Tempo Real
              </Link>
            </CollapsibleNavItem>
            <CollapsibleNavItem 
              icon={Search} 
              label="Análise de SEO"
              basePath="/admin/seo"
            >
              <Link
                href="/admin/seo"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/seo'
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Visão Geral
              </Link>
              <Link
                href="/admin/seo/palavras-chave"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/seo/palavras-chave'
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Palavras-chave
              </Link>
              <Link
                href="/admin/seo/conteudo"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/seo/conteudo'
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Conteúdo
              </Link>
              <Link
                href="/admin/seo/tecnico"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/seo/tecnico'
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Técnico
              </Link>
            </CollapsibleNavItem>
            
            <div className="py-3">
              <div className="border-t border-slate-100 mx-2"></div>
            </div>
            
            <p className="px-4 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Conteúdo
            </p>
            <NavItem href="/admin/posts" icon={FileText} label="Posts do Blog" />

            <div className="py-3">
              <div className="border-t border-slate-100 mx-2"></div>
            </div>

            <p className="px-4 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Comercial
            </p>
            <CollapsibleNavItem 
              icon={Users} 
              label="Gerenciador de Leads"
              basePath="/admin/leads"
            >
              <Link
                href="/admin/leads?view=list"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/leads' && (!viewParam || viewParam === 'list')
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Lista
              </Link>
              <Link
                href="/admin/leads?view=kanban"
                className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  pathname === '/admin/leads' && viewParam === 'kanban'
                    ? 'text-[#2563EB] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Kanban
              </Link>
            </CollapsibleNavItem>

            <div className="py-3">
              <div className="border-t border-slate-100 mx-2"></div>
            </div>

            <p className="px-4 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Gestão
            </p>
            <NavItem href="/admin/users" icon={Settings} label="Gestão de Usuários" />
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <div className="flex items-center mb-4 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:text-red-600 hover:bg-red-50 border border-transparent transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair da Conta
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#2563EB] bg-slate-100 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                Ver Site 
                <span className="text-xs opacity-60">↗</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
