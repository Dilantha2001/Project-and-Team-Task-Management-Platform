"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useMockData } from "@/context/MockDataContext";
import { Users, FolderKanban, Info, ArrowUpRight, ArrowDownRight, Search, X } from "lucide-react";
import { Role } from "@/lib/mockData";

export default function AdminDashboard() {
  const router = useRouter();
  const { users, projects, addUser, updateUserRole } = useMockData();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<Role>("TEAM_MEMBER");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      router.push("/login");
    }
  }, [router]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName && newUserEmail) {
      addUser({ name: newUserName, email: newUserEmail, role: newUserRole });
      setIsAddUserOpen(false);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserRole("TEAM_MEMBER");
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white shadow-sm">
            <span>Monthly</span>
            <span className="text-xs text-gray-400">▼</span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Total Users
            </CardTitle>
            <Info className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <h2 className="text-3xl font-bold text-gray-900">{users.length.toLocaleString()}</h2>
              <Badge variant="success" className="flex items-center font-bold">
                12.5% <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <FolderKanban className="w-4 h-4 mr-2" />
              Active Projects
            </CardTitle>
            <Info className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <h2 className="text-3xl font-bold text-gray-900">
                {projects.filter(p => p.status === "ACTIVE").length}
              </h2>
              <Badge variant="success" className="flex items-center font-bold">
                8.1% <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              System Admins
            </CardTitle>
            <Info className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <h2 className="text-3xl font-bold text-gray-900">
                {users.filter(u => u.role === "ADMIN").length}
              </h2>
              <Badge variant="danger" className="flex items-center font-bold">
                2.4% <ArrowDownRight className="w-3 h-3 ml-0.5" />
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-400" />
            <CardTitle>User Directory</CardTitle>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsAddUserOpen(true)}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Add User
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">User Profile</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Role Access</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center">
                      <img 
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`} 
                        alt={user.name} 
                        className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as Role)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded focus:ring-indigo-500 focus:border-indigo-500 block p-1.5"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="PROJECT_MANAGER">PROJECT MANAGER</option>
                        <option value="TEAM_MEMBER">TEAM MEMBER</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-red-500 hover:text-red-700 font-medium text-xs">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Add New User</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" required value={newUserName} onChange={e => setNewUserName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" required value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  value={newUserRole} onChange={e => setNewUserRole(e.target.value as Role)}
                  className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="TEAM_MEMBER">Team Member</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
