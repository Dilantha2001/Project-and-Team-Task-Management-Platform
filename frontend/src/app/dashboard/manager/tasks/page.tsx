"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, CheckSquare } from "lucide-react";
import { api } from "@/services/api";
import { Task, Project, User } from "@/lib/mockData";

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [t, p, u] = await Promise.all([api.getTasks(), api.getProjects(), api.getUsers()]);
      setTasks(t);
      setProjects(p);
      setUsers(u);
    };
    loadData();
  }, []);

  return (
    <DashboardLayout role="PROJECT_MANAGER">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">All Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of all tasks across your projects.</p>
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
                <th className="px-6 py-4 font-semibold">Assignee</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => {
                const project = projects.find(p => p.id === task.projectId);
                const assignee = users.find(u => u.id === task.assigneeId);
                return (
                  <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 text-gray-500">{project?.name || "N/A"}</td>
                    <td className="px-6 py-4">
                      {assignee ? (
                        <div className="flex items-center">
                          <img src={assignee.avatarUrl} alt="" className="w-6 h-6 rounded-full mr-2" />
                          <span className="text-gray-700">{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={task.status === "DONE" ? "success" : task.status === "IN_PROGRESS" ? "info" : "neutral"}>
                        {task.status.replace("_", " ")}
                      </Badge>
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
