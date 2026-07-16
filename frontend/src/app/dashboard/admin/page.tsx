"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/services/api";
import { Users, FolderKanban, CheckSquare, Info, ArrowUpRight } from "lucide-react";
import { Project, Task, User } from "@/types";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [u, p, t] = await Promise.all([
          api.getUsers().catch(() => []), 
          api.getProjects().catch(() => []), 
          api.getTasks().catch(() => [])
        ]);
        setUsers(u || []);
        setProjects(p || []);
        setTasks(t || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [router]);

  if (isLoading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex h-[50vh] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // --- Data for Charts ---
  
  // 1. Task Status
  const taskStatusData = [
    { name: 'To Do', value: tasks.filter(t => t.status === "TODO").length },
    { name: 'In Progress', value: tasks.filter(t => t.status === "IN_PROGRESS").length },
    { name: 'Completed', value: tasks.filter(t => t.status === "DONE").length },
  ];
  const COLORS = ['#94a3b8', '#6366f1', '#10b981'];

  // 2. User Distribution
  const userRolesData = [
    { name: 'Admin', value: users.filter(u => u.role === "ADMIN").length },
    { name: 'Manager', value: users.filter(u => u.role === "PROJECT_MANAGER").length },
    { name: 'Member', value: users.filter(u => u.role === "TEAM_MEMBER").length },
  ];

  // 3. Project Activity Mock (Last 6 Months)
  const projectActivityData = [
    { name: 'Jan', projects: 2 },
    { name: 'Feb', projects: 3 },
    { name: 'Mar', projects: 5 },
    { name: 'Apr', projects: 4 },
    { name: 'May', projects: 7 },
    { name: 'Jun', projects: Object.keys(projects).length },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Overview</h1>
        <p className="text-sm text-gray-500">Monitor your entire platform&apos;s health and statistics.</p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex justify-between">
              Total Users
              <Users className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-2xl font-bold text-gray-900">{users.length}</h2>
              <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex justify-between">
              Total Projects
              <FolderKanban className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-2xl font-bold text-gray-900">{projects.length}</h2>
              <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 4%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{projects.filter(p => p.status === "COMPLETED").length} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex justify-between">
              Pending Tasks
              <CheckSquare className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status !== "DONE").length}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex justify-between">
              Completed Tasks
              <CheckSquare className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === "DONE").length}
              </h2>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full" 
                style={{ width: `${(tasks.filter(t => t.status === "DONE").length / Math.max(1, tasks.length)) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectActivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="projects" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            
            <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-3">
              {taskStatusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-gray-600">{entry.name}</span>
                  <span className="ml-2 font-medium text-gray-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      
      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Project Name</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Members</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{project.name}</td>
                    <td className="px-6 py-4">
                      <Badge variant={project.status === "ACTIVE" ? "success" : "neutral"}>
                        {project.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{(project.memberIds || []).length} members</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => router.push('/dashboard/admin/projects')}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No projects found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

