"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/services/api";
import { Clock, CheckCircle2, Circle, ArrowRightCircle } from "lucide-react";
import { TaskStatus } from "@/lib/mockData";

// Define a type for the task returned by the API which includes the joined project name
type ApiTask = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  projectId: string;
  assigneeId?: string;
  dueDate?: string;
  project?: {
    name: string;
  };
};

export default function MemberDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<ApiTask[]>([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "TEAM_MEMBER") {
      router.push("/login");
    } else {
      fetchTasks();
    }
  }, [router]);

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data as ApiTask[]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: TaskStatus) => {
    try {
      await api.updateTaskStatus(id, newStatus);
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

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
              {tasks.filter(t => t.status === "TODO").length}
            </span>
          </div>
          {tasks.filter(t => t.status === "TODO").map(task => (
            <TaskCard key={task.id} task={task} updateStatus={handleUpdateStatus} />
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
              {tasks.filter(t => t.status === "IN_PROGRESS").length}
            </span>
          </div>
          {tasks.filter(t => t.status === "IN_PROGRESS").map(task => (
            <TaskCard key={task.id} task={task} updateStatus={handleUpdateStatus} />
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
              {tasks.filter(t => t.status === "DONE").length}
            </span>
          </div>
          {tasks.filter(t => t.status === "DONE").map(task => (
            <TaskCard key={task.id} task={task} updateStatus={handleUpdateStatus} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function TaskCard({ task, updateStatus }: { task: ApiTask, updateStatus: (id: string, s: TaskStatus) => void }) {
  return (
    <Card className={`hover:shadow-md transition-all group cursor-pointer border-l-[3px] relative ${
      task.status === "DONE" ? "border-l-emerald-500" : 
      task.status === "IN_PROGRESS" ? "border-l-blue-500" : "border-l-indigo-500"
    }`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Badge variant={task.status === "DONE" ? "success" : task.status === "IN_PROGRESS" ? "info" : "neutral"}>
            {task.project?.name || "No Project"}
          </Badge>
          <select 
            value={task.status} 
            onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
            onClick={(e) => e.stopPropagation()}
            className={`px-2 py-1 rounded-full text-[10px] font-semibold outline-none cursor-pointer border ${
              task.status === "DONE" ? "bg-green-50 text-green-700 border-green-200" : 
              task.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border-blue-200" : 
              "bg-orange-50 text-orange-700 border-orange-200"
            }`}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
        <h4 className="font-semibold text-gray-900 leading-snug mb-1.5">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
