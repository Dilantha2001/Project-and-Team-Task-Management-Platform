import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-4 overflow-hidden bg-white">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 zoom-in-95 ease-out max-w-4xl mx-auto flex flex-col items-center">
        
        <div className="glass px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-8 text-sm text-indigo-700 font-medium tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next-Generation Task Management
        </div>

        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight text-gray-900">
          Manage Projects with <br />
          <span className="text-gradient">Unmatched Clarity</span>
        </h1>
        
        
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          Empower your team with a platform designed for speed, visibility, and modern aesthetics. Assign tasks, track progress, and ship faster.
        </p>

        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/register" 
            className="group w-full sm:w-auto bg-gradient-primary text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            Get Started for Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto glass text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <Layers className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Workspaces</h3>
          <p className="text-gray-500 text-sm">Organize your initiatives into dedicated, clean workspaces.</p>
        </div>
        
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access</h3>
          <p className="text-gray-500 text-sm">Securely manage Admin, Manager, and Team Member permissions.</p>
        </div>
        
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
          <p className="text-gray-500 text-sm">Monitor task statuses in real-time with stunning visualizations.</p>
        </div>
      </div>
    </div>
  );
}
