"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FolderKanban, Search } from "lucide-react";
import { api } from "@/services/api";
import { Project, User } from "@/types";

export default function MemberProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    const loadData = async () => {
      const p = await api.getProjects();
      setProjects(p as any[]); // API returns projects with manager object
    };
    loadData();
  }, []);

  return (
    <DashboardLayout role="TEAM_MEMBER">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Projects you are contributing to.</p>
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
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-indigo-500"
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
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project: any) => {
                const managerName = project.manager?.name || "N/A";
                return (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{project.name}</td>
                    <td className="px-6 py-4 text-gray-500">{managerName}</td>
                    <td className="px-6 py-4">
                      <Badge variant={project.status === "ACTIVE" ? "success" : "neutral"}>
                        {project.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 px-2 py-1 rounded">
                        View Board
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
