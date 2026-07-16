"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { api } from "@/services/api";
import { Task } from "@/types";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  
  async function fetchTasks() {
    try {
      const data = await api.getTasks();
      setTasks(data || []);
    } catch {
      console.error("error fetching tasks");
    }
  }

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "TEAM_MEMBER") {
      router.push("/login");
    } else {
      fetchTasks();
    }
  }, [router]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const today = () => setCurrentDate(new Date());

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getTasksForDay = (day: number) => {
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await api.updateTaskStatus(taskId, newStatus as any);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="TEAM_MEMBER">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center">
          <CalendarIcon className="mr-2 w-7 h-7 text-indigo-600" /> Task Calendar
        </h1>
        <div className="flex items-center space-x-4">
          <button onClick={today} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm">
            Today
          </button>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-50 transition border-r border-gray-300">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="px-4 py-2 font-semibold text-gray-800 min-w-[140px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-50 transition border-l border-gray-300">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      <Card className="shadow-lg border-0 ring-1 ring-gray-200">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/80 rounded-t-xl">
          {dayNames.map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 bg-gray-200 gap-px rounded-b-xl overflow-hidden">
          {paddingDays.map(p => (
            <div key={`pad-${p}`} className="bg-white min-h-[140px]" />
          ))}
          
          {days.map(day => {
            const dayTasks = getTasksForDay(day);
            const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
            
            return (
              <div key={day} className={`bg-white min-h-[140px] p-2 transition-colors hover:bg-gray-50/30 ${isToday ? 'ring-2 ring-indigo-500 ring-inset z-10' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1.5 overflow-y-auto max-h-[100px] pr-1 custom-scrollbar">
                  {dayTasks.map(task => (
                    <div key={task.id} className={`p-1.5 rounded text-xs border ${
                      task.status === 'DONE' ? 'bg-green-50 border-green-200 text-green-700' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      'bg-orange-50 border-orange-200 text-orange-700'
                    } shadow-sm group relative`}>
                      <div className="font-semibold truncate mb-1" title={task.title}>{task.title}</div>
                      <select 
                        value={task.status} 
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className={`w-full text-[10px] font-medium rounded outline-none p-0.5 cursor-pointer appearance-none ${
                          task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #d1d5db; }
      `}} />
    </DashboardLayout>
  );
}

