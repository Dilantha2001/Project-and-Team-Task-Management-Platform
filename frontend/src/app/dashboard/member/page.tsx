"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useMockData } from "@/context/MockDataContext";
import { Clock, MoreHorizontal, CheckCircle2, Circle, ArrowRightCircle } from "lucide-react";
import { TaskStatus, Task } from "@/lib/mockData";

export default function MemberDashboard() {
  const router = useRouter();
  // Assume John Developer is logged in for mock purposes
  const [userId] = useState("u3"); 
  const { tasks, projects, updateTaskStatus } = useMockData();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "TEAM_MEMBER") {
      router.push("/login");
    }
  }, [router]);

  const assignedTasks = tasks.filter(t => t.assigneeId === userId);

  return (
    <DashboardLayout role="TEAM_MEMBER">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Task Board</h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white shadow-sm">
            <span>This Week</span>
            <span className="text-xs text-gray-400">▼</span>
          </button>
        </div>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* TODO Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-semibold text-gray-900 flex items-center text-sm">
              <Circle className="w-4 h-4 mr-2 text-gray-400" />
              To Do
            </h3>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {assignedTasks.filter(t => t.status === "TODO").length}
            </span>
          </div>
          {assignedTasks.filter(t => t.status === "TODO").map(task => (
            <TaskCard key={task.id} task={task} projects={projects} updateStatus={updateTaskStatus} />
          ))}
        </div>

        {/* IN PROGRESS Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-semibold text-gray-900 flex items-center text-sm">
              <ArrowRightCircle className="w-4 h-4 mr-2 text-indigo-500" />
              In Progress
            </h3>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {assignedTasks.filter(t => t.status === "IN_PROGRESS").length}
            </span>
          </div>
          {assignedTasks.filter(t => t.status === "IN_PROGRESS").map(task => (
            <TaskCard key={task.id} task={task} projects={projects} updateStatus={updateTaskStatus} />
          ))}
        </div>

        {/* DONE Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-semibold text-gray-900 flex items-center text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
              Completed
            </h3>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {assignedTasks.filter(t => t.status === "DONE").length}
            </span>
          </div>
          {assignedTasks.filter(t => t.status === "DONE").map(task => (
            <TaskCard key={task.id} task={task} projects={projects} updateStatus={updateTaskStatus} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function TaskCard({ task, projects, updateStatus }: { task: Task, projects: any[], updateStatus: (id: string, s: TaskStatus) => void }) {
  const project = projects.find(p => p.id === task.projectId);

  return (
    <Card className="hover:shadow-md transition-all group cursor-pointer border-l-[3px] border-l-indigo-500 relative">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="info">
            {project?.name || "Unknown"}
          </Badge>
          
          <select 
            value={task.status}
            onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
            className="text-xs border border-gray-200 rounded p-1 text-gray-600 bg-gray-50 focus:ring-indigo-500 hover:bg-gray-100 outline-none"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

        </div>
        <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors text-sm">
          {task.title}
        </h4>
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
          {task.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center font-medium">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
            JD
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
