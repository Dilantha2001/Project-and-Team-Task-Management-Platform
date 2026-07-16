"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Users, Search } from "lucide-react";
import { api } from "@/services/api";
import { User } from "@/types";
import { getAvatarGradient } from "@/lib/utils";

export default function ManagerTeamPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [u, p] = await Promise.all([
          api.getUsers().catch(() => []),
          api.getProjects().catch(() => [])
        ]);
        
        // Find member IDs that are part of this manager's projects
        const myProjectMemberIds = new Set(p.flatMap(proj => proj.memberIds));
        
        // Show only team members who are assigned to at least one of this manager's projects
        setUsers(u.filter((user: any) => user.role === "TEAM_MEMBER" && myProjectMemberIds.has(user.id)));
      } catch {
        console.error("error loading team data");
      }
    };
    loadData();
  }, []);

  return (
    <DashboardLayout role="PROJECT_MANAGER">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Team Members</h1>
          <p className="text-sm text-gray-500 mt-1">Directory of all available team members.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex justify-between items-center w-full">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search team..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Member</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${getAvatarGradient(user.name)} text-white flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-white mr-3 shrink-0`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

