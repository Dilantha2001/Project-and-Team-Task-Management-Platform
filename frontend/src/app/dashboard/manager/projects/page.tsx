"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FolderKanban, Search, Plus, MoreHorizontal } from "lucide-react";
import { api } from "@/services/api";
import { Project, User } from "@/lib/mockData";

export default function ManagerProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const [p, u] = await Promise.all([api.getProjects(), api.getUsers()]);
      setProjects(p);
      setUsers(u);
    };
    loadData();
  }, []);

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout role="PROJECT_MANAGER">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all projects you are overseeing.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" /> Create Project
        </button>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex justify-between items-center w-full">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Project Name</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Team Size</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => {
                return (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{project.name}</td>
                    <td className="px-6 py-4">
                      <Badge variant={project.status === "ACTIVE" ? "success" : "warning"}>
                        {project.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {project.memberIds.slice(0,3).map((id, index) => {
                          const user = users.find(u => u.id === id);
                          return user ? (
                            <img 
                              key={user.id} src={user.avatarUrl} alt={user.name} 
                              className="h-6 w-6 rounded-full border-2 border-white object-cover"
                              style={{ zIndex: 10 - index }}
                            />
                          ) : null;
                        })}
                        {project.memberIds.length > 3 && (
                          <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600 z-0">
                            +{project.memberIds.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 px-2 py-1 rounded">
                        Manage
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
