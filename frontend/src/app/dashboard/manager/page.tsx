"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useMockData } from "@/context/MockDataContext";
import { FolderKanban, Users, Filter, Download, Plus, X, CheckSquare } from "lucide-react";
import { ProjectStatus, TaskStatus } from "@/lib/mockData";

export default function ManagerDashboard() {
  const router = useRouter();
  const { projects, users, addProject, addTask } = useMockData();
  
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const [managingProjectId, setManagingProjectId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "PROJECT_MANAGER") {
      router.push("/login");
    }
  }, [router]);

  const teamMembers = users.filter(u => u.role === "TEAM_MEMBER");

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName) {
      addProject({
        name: newProjectName,
        description: newProjectDesc,
        status: "ACTIVE",
        managerId: "u2", // Mock manager ID
        memberIds: selectedMembers
      });
      setIsAddProjectOpen(false);
      setNewProjectName("");
      setNewProjectDesc("");
      setSelectedMembers([]);
    }
  };

  const toggleMemberSelection = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(m => m !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle && managingProjectId) {
      addTask({
        title: newTaskTitle,
        description: newTaskDesc,
        status: "TODO",
        projectId: managingProjectId,
        assigneeId: newTaskAssignee || null,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Next week
      });
      setManagingProjectId(null);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskAssignee("");
    }
  };

  return (
    <DashboardLayout role="PROJECT_MANAGER">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Active Projects</h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white shadow-sm">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white shadow-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setIsAddProjectOpen(true)}
            className="flex items-center px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="border-b border-gray-50 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                      {project.name}
                    </CardTitle>
                    <Badge variant={project.status === "ACTIVE" ? "success" : "warning"} className="mt-1">
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <button 
                  onClick={() => setManagingProjectId(project.id)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-indigo-50 px-2 py-1 rounded"
                >
                  + Add Task
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                {project.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 pt-6">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900 mr-1">{project.memberIds.length}</span> Team Members
                </div>
                <div className="flex -space-x-2">
                  {project.memberIds.map((id, index) => {
                    const user = users.find(u => u.id === id);
                    return user ? (
                      <img 
                        key={user.id}
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full border-2 border-white relative object-cover shadow-sm"
                        title={user.name}
                        style={{ zIndex: project.memberIds.length - index }}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Create New Project</h3>
              <button onClick={() => setIsAddProjectOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProject} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input 
                  type="text" required value={newProjectName} onChange={e => setNewProjectName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Describe the project..." rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Team Members</label>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                  {teamMembers.map(member => (
                    <label key={member.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => toggleMemberSelection(member.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{member.name}</span>
                    </label>
                  ))}
                  {teamMembers.length === 0 && <span className="text-xs text-gray-500 p-1">No team members available.</span>}
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {managingProjectId && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Add Task to Project</h3>
              <button onClick={() => setManagingProjectId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input 
                  type="text" required value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Design Homepage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Describe the task..." rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select 
                  value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="">Unassigned</option>
                  {projects.find(p => p.id === managingProjectId)?.memberIds.map(id => {
                    const u = users.find(user => user.id === id);
                    return u ? <option key={u.id} value={u.id}>{u.name}</option> : null;
                  })}
                </select>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 mr-2" /> Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
