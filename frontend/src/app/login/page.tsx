"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { authApi } from "@/services/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password
      });

      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.user.role);
        
        const userRole = response.user.role;
        if (userRole === "ADMIN") router.push("/dashboard/admin");
        else if (userRole === "PROJECT_MANAGER") router.push("/dashboard/manager");
        else router.push("/dashboard/member");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Dynamic Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-violet-500/20 blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
              <span className="text-indigo-900 font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Nexus</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
              Manage your teams <br/>
              <span className="text-indigo-300">with precision.</span>
            </h1>
            <p className="text-lg text-indigo-100/80 leading-relaxed font-light">
              Nexus is the complete SaaS platform for project managers to assign tasks, track deadlines, and collaborate without friction.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex -space-x-3">
              <img src="https://ui-avatars.com/api/?name=Alice&background=10b981&color=fff" alt="" className="w-10 h-10 rounded-full border-2 border-indigo-900"/>
              <img src="https://ui-avatars.com/api/?name=Bob&background=f59e0b&color=fff" alt="" className="w-10 h-10 rounded-full border-2 border-indigo-900"/>
              <img src="https://ui-avatars.com/api/?name=Charlie&background=ef4444&color=fff" alt="" className="w-10 h-10 rounded-full border-2 border-indigo-900"/>
            </div>
            <p className="text-sm text-indigo-200">Join <span className="font-semibold text-white">4,000+</span> teams using Nexus.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-left">
            {/* Mobile Logo (hidden on desktop) */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Nexus</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="mt-3 text-gray-500">Please enter your details to sign in.</p>
          </div>
          
          {error && (
            <div className="bg-red-50/50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start">
              <svg className="w-5 h-5 mr-3 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
              <div className="relative">
                <Mail className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                <input 
                  type="email" 
                  {...register("email")}
                  className={`w-full bg-gray-50/50 border pl-11 pr-4 py-3 rounded-xl text-gray-900 focus:bg-white focus:ring-4 outline-none transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                  }`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <Lock className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                <input 
                  type="password" 
                  {...register("password")}
                  className={`w-full bg-gray-50/50 border pl-11 pr-4 py-3 rounded-xl text-gray-900 focus:bg-white focus:ring-4 outline-none transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox"
                    id="rememberMe"
                    {...register("rememberMe")}
                    className="peer w-5 h-5 cursor-pointer appearance-none rounded-md border border-gray-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 select-none group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>
              
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="group w-full relative bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Sign in to account <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-500 font-medium">
            Don't have an account?{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
              Request access
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
