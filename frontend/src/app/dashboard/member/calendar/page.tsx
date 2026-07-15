"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar } from "@/components/ui/Calendar";

export default function MemberCalendarPage() {
  const role = typeof window !== "undefined" ? localStorage.getItem("role") as any || "TEAM_MEMBER" : "TEAM_MEMBER";
  
  // Generate some mock events for the current month
  const today = new Date();
  const mockEvents = [
    {
      id: '1',
      title: 'UI Design Review',
      date: new Date(today.getFullYear(), today.getMonth(), 8),
      type: 'meeting' as const
    },
    {
      id: '2',
      title: 'Submit Timesheet',
      date: new Date(today.getFullYear(), today.getMonth(), 15),
      type: 'deadline' as const
    },
    {
      id: '3',
      title: 'Code Refactoring',
      date: new Date(today.getFullYear(), today.getMonth(), 22),
      type: 'task' as const
    },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Your personal schedule and deadlines.</p>
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
