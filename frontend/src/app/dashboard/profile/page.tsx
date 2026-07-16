"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Camera, Shield, User } from "lucide-react";
import { api } from "@/services/api";

export default function ProfilePage() {
  const [role, setRole] = useState("TEAM_MEMBER");
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  
  // Custom simple jwt decoder since we don't have jwt-decode library
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedRole = localStorage.getItem("role") || "TEAM_MEMBER";
      const token = localStorage.getItem("token");
      
      setRole(storedRole);
      
      if (token) {
        const decoded = parseJwt(token);
        if (decoded && decoded.id) {
          setUserId(decoded.id);
          try {
            // This relies on api.getUserById which doesn't exist on frontend yet. Let's add it.
            // Wait, we need to add getUserById to api.ts
            const response = await api.getUserById(decoded.id);
            if (response) {
              setFormData({
                name: response.name,
                email: response.email
              });
            }
          } catch (err) {
            console.error("Failed to load user profile", err);
          }
        }
      }
    };
    
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      await api.updateUser(userId, formData);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout role={role as any}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your profile information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 group cursor-pointer">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center font-bold text-5xl transition-transform group-hover:scale-105">
                    {(formData.name || role).charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{formData.name || role.replace('_', ' ')}</h2>
                <p className="text-sm text-gray-500 mt-1">{formData.email}</p>
                <div className="mt-4 inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {role.replace('_', ' ')}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Shield className="w-4 h-4 mr-2 text-gray-400" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-factor Authentication</p>
                    <p className="text-xs text-gray-500">Not enabled</p>
                  </div>
                  <button className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              
              {message && (
                <div className={`mb-6 p-4 rounded-xl text-sm border flex items-start ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  {message.text}
                </div>
              )}
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSaving || !userId}
                    className="bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 flex items-center shadow-sm hover:shadow"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
