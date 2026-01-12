"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { NotificationBell } from "./NotificationBell";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Navigation items are now defined inline for better grouping

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
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
          active
            ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
            : "text-gray-600 hover:bg-neutral-50 hover:text-gray-900"
        }`}
      >
        <Icon className={`w-5 h-5 mr-3 ${active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"}`} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-100">
            <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
              Admin Panel
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            
            <div className="py-2">
              <div className="border-t border-gray-100 mx-2"></div>
            </div>

            <NavItem href="/admin/posts" icon={FileText} label="Posts" />

            <div className="py-2">
              <div className="border-t border-gray-100 mx-2"></div>
            </div>

            <NavItem href="/admin/leads" icon={Users} label="Gerenciador de Leads" />
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-neutral-100">
            <div className="flex items-center mb-4 px-2">
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <NotificationBell />
              <Link
                href="/"
                target="_blank"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                Ver Site <span className="text-xs">↗</span>
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
