"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Camera, Mail, User, Shield, Bell } from "lucide-react";

export default function ProfilePage() {
  const role = typeof window !== "undefined" ? localStorage.getItem("role") as any || "TEAM_MEMBER" : "TEAM_MEMBER";
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <DashboardLayout role={role}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your profile information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 group cursor-pointer">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${role.replace('_', '+')}&background=6366f1&color=fff&size=128`} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{role.replace('_', ' ')}</h2>
                <p className="text-sm text-gray-500 mt-1">user@nexus.com</p>
                <div className="mt-6 w-full pt-6 border-t border-gray-100 flex justify-center space-x-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">48</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Tasks</p>
                  </div>
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

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      defaultValue="John"
                      className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue="Doe"
                      className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        defaultValue="user@nexus.com"
                        className="w-full border border-gray-200 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea 
                      rows={3}
                      defaultValue="Frontend developer specializing in React and Next.js."
                      className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 flex items-center"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-gray-400" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { title: "Email Notifications", desc: "Receive email updates about project changes." },
                  { title: "Task Assignments", desc: "Get notified when you are assigned a new task." },
                  { title: "Weekly Reports", desc: "Receive a weekly digest of team progress." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
