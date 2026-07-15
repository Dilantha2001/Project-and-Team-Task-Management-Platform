"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, FolderKanban, CheckSquare, 
  Search, Bell, User, Calendar, FileText, Shield, LogOut, ChevronRight,
  Command, CheckCircle2, AlertCircle
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut for Command Palette (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
  
  // Filter links for Command Palette search
  const filteredLinks = links.filter(link => link.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const href = '/' + pathParts.slice(0, index + 1).join('/');
    const name = part.charAt(0).toUpperCase() + part.slice(1).replace("-", " ");
    return { name, href, isLast: index === pathParts.length - 1 };
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-[#111827]">
      {/* Command Palette Modal (High-Mark Feature) */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[20vh] bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsCommandPaletteOpen(false)}>
          <div 
            className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center px-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search pages, tasks, or settings..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 py-4 pl-3 text-gray-900 placeholder:text-gray-400 outline-none"
              />
              <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-500">ESC</div>
            </div>
            
            <div className="max-h-72 overflow-y-auto p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pages</div>
              {filteredLinks.length > 0 ? (
                filteredLinks.map(link => (
                  <button 
                    key={link.name}
                    onClick={() => { router.push(link.href); setIsCommandPaletteOpen(false); }}
                    className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors text-left"
                  >
                    <link.icon className="w-4 h-4 mr-3" />
                    {link.name}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">No results found for "{searchQuery}"</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0 relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Nexus</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar">
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
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
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
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm"
           >
             <LogOut className="w-4 h-4" />
             <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative z-30">
          <div className="flex-1 flex items-center">
            {/* Command Palette Trigger */}
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center w-72 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-colors focus:outline-none"
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="flex-1 text-left">Quick search...</span>
              <div className="flex items-center space-x-1">
                <Command className="w-3 h-3" />
                <span className="text-xs font-semibold">K</span>
              </div>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Interactive Notifications */}
            <div className="relative">
              <button 
                onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
                className="text-gray-400 hover:text-gray-600 relative p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">Mark all as read</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto no-scrollbar">
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 flex items-start">
                      <div className="bg-indigo-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Task Completed</p>
                        <p className="text-xs text-gray-500 mt-0.5">Alice finished "UI Design"</p>
                        <p className="text-[10px] text-gray-400 mt-1">2 mins ago</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start">
                      <div className="bg-amber-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Deadline Approaching</p>
                        <p className="text-xs text-gray-500 mt-0.5">"Frontend Release" is due tomorrow</p>
                        <p className="text-[10px] text-gray-400 mt-1">1 hr ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100 text-center">
                    <a href="#" className="text-xs text-indigo-600 font-medium hover:underline">View all notifications</a>
                  </div>
                </div>
              )}
            </div>

            <div className="relative border-l border-gray-200 pl-4">
              <button 
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none"
              >
                <img 
                  src={`https://ui-avatars.com/api/?name=${role.replace('_', '+')}&background=6366f1&color=fff`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <div className="hidden sm:block text-sm text-left">
                  <p className="font-medium text-gray-900 leading-none capitalize">{role.toLowerCase().replace('_', ' ')}</p>
                </div>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">Your Profile</Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">Settings</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8F9FA] flex flex-col relative z-10">
          <div className="p-6 md:p-8 flex-1">
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                    {crumb.isLast ? (
                      <span className="font-medium text-gray-900">{crumb.name}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-indigo-600 transition-colors">{crumb.name}</Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>

              {/* Page Content */}
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
