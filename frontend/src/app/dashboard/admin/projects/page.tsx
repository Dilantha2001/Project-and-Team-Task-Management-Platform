"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FolderKanban, Search, Plus, MoreHorizontal } from "lucide-react";
import { api } from "@/services/api";
import { Project, User } from "@/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [p, u] = await Promise.all([
          api.getProjects().catch(() => []), 
          api.getUsers().catch(() => [])
        ]);
        setProjects(p || []);
        setUsers(u || []);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };
    loadData();
  }, []);

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of all platform projects.</p>
        </div>
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
                <th className="px-6 py-4 font-semibold">Manager</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Members</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => {
                const manager = users.find(u => u.id === project.managerId);
                return (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{project.name}</td>
                    <td className="px-6 py-4 text-gray-500">{manager?.name || "Unassigned"}</td>
                    <td className="px-6 py-4">
                      <Badge variant={project.status === "ACTIVE" ? "success" : "neutral"}>
                        {project.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{(project.memberIds || []).length} members</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors p-1.5 rounded-md hover:bg-indigo-50">
                        <MoreHorizontal className="w-4 h-4" />
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

