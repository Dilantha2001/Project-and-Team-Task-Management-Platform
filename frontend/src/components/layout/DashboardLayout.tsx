"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, FolderKanban, CheckSquare, 
  Settings, HelpCircle, Search, Bell, User, Calendar, FileText, Shield, LogOut, ChevronRight
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  const navItems = {
    ADMIN: [
      { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      { name: "Roles", href: "/dashboard/admin/roles", icon: Shield },
      { name: "Projects", href: "/dashboard/admin/projects", icon: FolderKanban },
    ],
    PROJECT_MANAGER: [
      { name: "Dashboard", href: "/dashboard/manager", icon: LayoutDashboard },
      { name: "Projects", href: "/dashboard/manager/projects", icon: FolderKanban },
      { name: "Tasks", href: "/dashboard/manager/tasks", icon: CheckSquare },
      { name: "Team Members", href: "/dashboard/manager/team", icon: Users },
      { name: "Calendar", href: "/dashboard/manager/calendar", icon: Calendar },
      { name: "Reports", href: "/dashboard/manager/reports", icon: FileText },
    ],
    TEAM_MEMBER: [
      { name: "Dashboard", href: "/dashboard/member", icon: LayoutDashboard },
      { name: "My Projects", href: "/dashboard/member/projects", icon: FolderKanban },
      { name: "My Tasks", href: "/dashboard/member/tasks", icon: CheckSquare },
      { name: "Calendar", href: "/dashboard/member/calendar", icon: Calendar },
      { name: "Profile", href: "/dashboard/profile", icon: User },
    ],
  };

  const links = navItems[role] || [];

  // Generate breadcrumbs from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const href = '/' + pathParts.slice(0, index + 1).join('/');
    const name = part.charAt(0).toUpperCase() + part.slice(1).replace("-", " ");
    return { name, href, isLast: index === pathParts.length - 1 };
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-[#111827]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Nexus</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-gray-400 mb-2 tracking-wider uppercase">Menu</p>
            <div className="space-y-1">
              {links.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/dashboard/${role.toLowerCase().replace('_', '')}`);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
           <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
           >
             <LogOut className="w-4 h-4" />
             <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative z-10">
          <div className="flex-1 flex items-center">
            <div className="relative w-96 hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="block w-full pl-10 pr-3 py-1.5 border border-gray-200 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>
            <div className="relative border-l border-gray-200 pl-4">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none"
              >
                <img 
                  src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden sm:block text-sm text-left">
                  <p className="font-medium text-gray-900 leading-none">{role.replace("_", " ")}</p>
                </div>
              </button>
              
              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                  <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Your Profile</Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8F9FA] flex flex-col">
          <div className="p-6 md:p-8 flex-1">
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    {crumb.isLast ? (
                      <span className="font-medium text-gray-900">{crumb.name}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-indigo-600">{crumb.name}</Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>

              {/* Page Content */}
              {children}
            </div>
          </div>
          
          {/* Footer */}
          <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-200 bg-white mt-auto">
            &copy; 2026 Nexus Platform. CyphLab Assignment.
          </footer>
        </div>
      </main>
    </div>
  );
}
