"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar } from "@/components/ui/Calendar";

export default function ManagerCalendarPage() {
  const role = typeof window !== "undefined" ? localStorage.getItem("role") as any || "PROJECT_MANAGER" : "PROJECT_MANAGER";
  
  // Generate some mock events for the current month
  const today = new Date();
  const mockEvents = [
    {
      id: '1',
      title: 'Project Kickoff',
      date: new Date(today.getFullYear(), today.getMonth(), 5),
      type: 'meeting' as const
    },
    {
      id: '2',
      title: 'Frontend Release',
      date: new Date(today.getFullYear(), today.getMonth(), 15),
      type: 'deadline' as const
    },
    {
      id: '3',
      title: 'Review PRs',
      date: new Date(today.getFullYear(), today.getMonth(), 15),
      type: 'task' as const
    },
    {
      id: '4',
      title: 'Client Demo',
      date: new Date(today.getFullYear(), today.getMonth(), 28),
      type: 'meeting' as const
    }
  ];

  return (
    <DashboardLayout role={role}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Team Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule, deadlines, and meetings.</p>
        </div>
      </div>
      
      <div className="mb-4 flex space-x-4 text-sm">
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span> Task</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span> Meeting</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Deadline</div>
      </div>
      
      <Calendar events={mockEvents} />
      
    </DashboardLayout>
  );
}
