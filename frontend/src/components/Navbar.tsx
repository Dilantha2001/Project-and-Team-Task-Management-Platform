import Link from 'next/link';
import { LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <nav className="glass w-full max-w-5xl rounded-2xl px-6 py-3 flex justify-between items-center shadow-lg shadow-black/10">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">TaskFlow</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Link>
          <Link 
            href="/register" 
            className="text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Register
          </Link>
        </div>
      </nav>
    </div>
  );
}

