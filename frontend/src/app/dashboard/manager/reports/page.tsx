"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText } from "lucide-react";

export default function GenericReportsPage() {
  const role = typeof window !== "undefined" ? localStorage.getItem("role") as any || "PROJECT_MANAGER" : "PROJECT_MANAGER";
  
  return (
    <DashboardLayout role={role}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Generate project performance and team productivity reports.</p>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Reporting Engine</h2>
          <p className="text-gray-500 mb-6">Advanced PDF and Excel reporting will be available in the next release.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
