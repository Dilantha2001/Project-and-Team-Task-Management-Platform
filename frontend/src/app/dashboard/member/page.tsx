"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MemberDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "MEMBER") {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border max-w-4xl">
        <ul className="space-y-4">
          <li className="p-4 border rounded hover:bg-gray-50 transition flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Update Homepage UI</h3>
              <p className="text-gray-600 mb-2">Project: Website Redesign</p>
              <p className="text-sm text-gray-500">Revamp the hero section to include new illustrations.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">IN_PROGRESS</span>
              <select className="border rounded p-1 text-sm bg-white cursor-pointer mt-2">
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </li>
          
          <li className="p-4 border rounded hover:bg-gray-50 transition flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Fix Login Bug</h3>
              <p className="text-gray-600 mb-2">Project: Auth System</p>
              <p className="text-sm text-gray-500">Resolve the issue where users are logged out randomly.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">TODO</span>
              <select className="border rounded p-1 text-sm bg-white cursor-pointer mt-2">
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
