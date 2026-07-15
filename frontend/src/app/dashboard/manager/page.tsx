"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ManagerDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "MANAGER") {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Projects</h2>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Create Project</button>
          </div>
          <ul className="space-y-3">
            <li className="p-3 border rounded flex justify-between items-center">
              <div>
                <h3 className="font-medium">Website Redesign</h3>
                <p className="text-sm text-gray-500">3 team members</p>
              </div>
              <button className="text-blue-600 text-sm hover:underline">Manage</button>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Create Task</button>
          </div>
          <ul className="space-y-3">
            <li className="p-3 border rounded flex justify-between items-center">
              <div>
                <h3 className="font-medium">Update Homepage UI</h3>
                <p className="text-sm text-gray-500">Assigned to: User 1</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">IN_PROGRESS</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
