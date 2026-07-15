"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, FolderKanban, CheckSquare, 
  Settings, HelpCircle, Search, Bell, Download, Filter, User
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  const navItems = {
    ADMIN: [
      { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    ],
    PROJECT_MANAGER: [
      { name: "Projects", href: "/dashboard/manager", icon: FolderKanban },
    ],
    TEAM_MEMBER: [
      { name: "My Tasks", href: "/dashboard/member", icon: CheckSquare },
    ],
  };

  const links = navItems[role] || [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-[#111827]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Nexus</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-gray-400 mb-2 tracking-wider">GENERAL</p>
            <div className="space-y-1">
              {links.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-gray-100/50 text-gray-900" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-gray-900" : "text-gray-400"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-gray-400 mb-2 tracking-wider">SUPPORT</p>
            <div className="space-y-1">
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors">
                <Settings className="mr-3 h-5 w-5 text-gray-400" />
                Settings
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors">
                <HelpCircle className="mr-3 h-5 w-5 text-gray-400" />
                Help
              </button>
            </div>
          </div>
        </nav>

        {/* User Info Bottom */}
        <div className="p-4 border-t border-gray-100">
           <button 
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
           >
             Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex-1 flex items-center">
            {/* Search Bar */}
            <div className="relative w-96 hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search" 
                className="block w-full pl-10 pr-3 py-1.5 border border-gray-200 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xs border border-gray-200 rounded px-1">⌘F</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-gray-900 leading-none">{role.replace("_", " ")}</p>
                <p className="text-xs text-gray-500 mt-1">Business</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
