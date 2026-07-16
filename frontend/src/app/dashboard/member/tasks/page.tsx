"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search } from "lucide-react";
import { api } from "@/services/api";
import { Task, Project, User } from "@/types";

export default function MemberTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [t, p, u] = await Promise.all([
          api.getTasks().catch(() => []), 
          api.getProjects().catch(() => []), 
          api.getUsers().catch(() => [])
        ]);
        setTasks(t || []);
        setProjects(p || []);
        setUsers(u || []);
      } catch (err) {
        console.error("Load error", err);
      }
    };
    loadData();
  }, []);

  const handleUpdateStatus = async (task: Task) => {
    setIsUpdating(task.id);
    
    let newStatus: any = "TODO";
    if (task.status === "TODO") newStatus = "IN_PROGRESS";
    else if (task.status === "IN_PROGRESS") newStatus = "DONE";
    else newStatus = "TODO";

    await api.updateTaskStatus(task.id, newStatus);
    
    // Update local state
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    setIsUpdating(null);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="TEAM_MEMBER">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your assigned tasks.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex justify-between items-center w-full">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Task</th>
                <th className="px-6 py-4 font-semibold">Project</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map((task) => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 text-gray-500">{project?.name || "N/A"}</td>
                    <td className="px-6 py-4">
                      <Badge variant={task.status === "DONE" ? "success" : task.status === "IN_PROGRESS" ? "info" : "neutral"}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleUpdateStatus(task)}
                        disabled={isUpdating === task.id}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors hover:bg-indigo-100 disabled:opacity-50"
                      >
                        {isUpdating === task.id ? "Updating..." : "Cycle Status"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

