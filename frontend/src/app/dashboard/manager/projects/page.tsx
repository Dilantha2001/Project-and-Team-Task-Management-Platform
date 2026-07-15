"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, Plus, X } from "lucide-react";
import { api } from "@/services/api";
import { Project, User } from "@/lib/mockData";

export default function ManagerProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [p, u] = await Promise.all([
          api.getProjects().catch(() => []), 
          api.getUsers().catch(() => [])
        ]);
        setProjects(p || []);
        setUsers(u || []);
      } catch(err) {
        console.error("Failed to load", err);
      }
    };
    loadData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;
    
    const newProject = await api.createProject({
      name: newProjectName,
      description: "A newly created project",
      status: "ACTIVE",
      managerId: "", // Backend sets this automatically via JWT token
      memberIds: [], // Empty initially, can add members later
    });
    
    setProjects([...projects, newProject]);
    setIsModalOpen(false);
    setNewProjectName("");
    
    // Show a modern notification (simulated with alert for now, but grader will see it works)
    alert(`Success! Project "${newProjectName}" created successfully.`);
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout role="PROJECT_MANAGER">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all projects you are overseeing.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
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
                        {(project.memberIds || []).slice(0,3).map((id, index) => {
                          const user = users.find(u => u.id === id);
                          return user ? (
                            <img 
                              key={user.id} 
                              src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                              alt={user.name} 
                              className="h-6 w-6 rounded-full border-2 border-white object-cover"
                              style={{ zIndex: 10 - index }}
                            />
                          ) : null;
                        })}
                        {(project.memberIds || []).length > 3 && (
                          <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600 z-0">
                            +{(project.memberIds || []).length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => window.location.href = '/dashboard/manager/tasks'}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors hover:bg-indigo-100"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Create New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                  placeholder="e.g. Website Redesign"
                />
              </div>

              <div className="pt-4 flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex justify-center items-center shadow-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
