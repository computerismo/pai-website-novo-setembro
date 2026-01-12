"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { NotificationBell } from "./NotificationBell";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
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
            ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white shadow-lg shadow-blue-500/10"
            : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
          active 
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30" 
            : "bg-slate-700/50 group-hover:bg-slate-600/50"
        }`}>
          <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
        </div>
        {label}
        {active && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse" />
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Premium Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transform transition-transform duration-300 ease-out lg:translate-x-0 shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">OESP</span>
                <span className="text-lg font-light text-blue-400">Dental</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <p className="px-4 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Menu Principal
            </p>
            <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            
            <div className="py-3">
              <div className="border-t border-white/5 mx-2"></div>
            </div>
            
            <p className="px-4 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Conteúdo
            </p>
            <NavItem href="/admin/posts" icon={FileText} label="Posts do Blog" />

            <div className="py-3">
              <div className="border-t border-white/5 mx-2"></div>
            </div>

            <p className="px-4 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Comercial
            </p>
            <NavItem href="/admin/leads" icon={Users} label="Gerenciador de Leads" />
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-white/5 bg-slate-900/50">
            <div className="flex items-center mb-4 p-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-400 rounded-xl hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
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
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-10 shadow-sm">
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-100/80 hover:bg-blue-50 rounded-xl transition-all duration-200"
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
