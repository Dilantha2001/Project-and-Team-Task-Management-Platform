"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function ProfilePage() {
  return (
    <DashboardLayout role="TEAM_MEMBER">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Your Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences.</p>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-400 text-3xl font-bold">U</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
          <p className="text-gray-500 mb-6">Profile management coming soon in the next update.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
