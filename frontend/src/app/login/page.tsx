"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Dummy login without backend
    let userRole = "MEMBER";
    if (email.includes("admin")) userRole = "ADMIN";
    else if (email.includes("manager")) userRole = "MANAGER";
    
    localStorage.setItem("token", "dummy-token-123");
    localStorage.setItem("role", userRole);
    
    if (userRole === "ADMIN") router.push("/dashboard/admin");
    else if (userRole === "MANAGER") router.push("/dashboard/manager");
    else router.push("/dashboard/member");
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Sign In
        </button>
      </form>
    </div>
  );
}
