"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Shield } from "lucide-react";
import { api } from "@/services/api";

export default function AdminRolesPage() {
  const [roleCounts, setRoleCounts] = useState({ ADMIN: 0, PROJECT_MANAGER: 0, TEAM_MEMBER: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const users = await api.getUsers().catch(() => []);
        const counts = { ADMIN: 0, PROJECT_MANAGER: 0, TEAM_MEMBER: 0 };
        users.forEach(u => {
          if (u.role === "ADMIN") counts.ADMIN++;
          if (u.role === "PROJECT_MANAGER") counts.PROJECT_MANAGER++;
          if (u.role === "TEAM_MEMBER") counts.TEAM_MEMBER++;
        });
        setRoleCounts(counts);
      } catch (err) {
        console.error("Failed to load roles data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  const roles = [
    { name: "Administrator", description: "Full access to all system features", users: roleCounts.ADMIN },
    { name: "Project Manager", description: "Can create projects and assign tasks", users: roleCounts.PROJECT_MANAGER },
    { name: "Team Member", description: "Can view and update assigned tasks", users: roleCounts.TEAM_MEMBER },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Role Management</h1>
          <p className="text-sm text-gray-500 mt-1">Configure system roles and permissions.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4 flex flex-row items-center space-x-2">
          <Shield className="w-5 h-5 text-gray-400" />
          <CardTitle>System Roles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Role Name</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Active Users</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.map((role) => (
                <tr key={role.name} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{role.name}</td>
                  <td className="px-6 py-4 text-gray-500">{role.description}</td>
                  <td className="px-6 py-4 font-medium">{role.users}</td>
                  <td className="px-6 py-4 text-right text-gray-400 italic text-xs">
                    Fixed Role
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
