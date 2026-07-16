"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { api } from "@/services/api";
import { Task, Project } from "@/lib/mockData";
import { BarChart3, TrendingUp, CheckCircle, Clock } from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "PROJECT_MANAGER") {
      router.push("/login");
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const [t, p] = await Promise.all([api.getTasks(), api.getProjects()]);
      setTasks(t);
      setProjects(p);
    } catch (e) {
      console.error(e);
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const todoTasks = tasks.filter(t => t.status === 'TODO').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <DashboardLayout role="PROJECT_MANAGER">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center">
          <BarChart3 className="mr-2 w-6 h-6 text-indigo-600" /> Project Reports & Metrics
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{completionRate}%</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Overall Completion Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{completedTasks}</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{inProgressTasks}</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Tasks In Progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gray-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{projects.length}</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Active Projects</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map(project => {
              const pTasks = tasks.filter(t => t.projectId === project.id);
              const pDone = pTasks.filter(t => t.status === 'DONE').length;
              const percent = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;
              return (
                <div key={project.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{project.name}</span>
                    <span className="text-sm font-medium text-gray-500">{percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && <p className="text-sm text-gray-500">No projects to report on.</p>}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
