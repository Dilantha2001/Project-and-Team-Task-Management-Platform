"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Shield, Plus } from "lucide-react";

export default function AdminRolesPage() {
  const roles = [
    { name: "Administrator", description: "Full access to all system features", users: 2 },
    { name: "Project Manager", description: "Can create projects and assign tasks", users: 5 },
    { name: "Team Member", description: "Can view and update assigned tasks", users: 15 },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Role Management</h1>
          <p className="text-sm text-gray-500 mt-1">Configure system roles and permissions.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" /> Create Role
        </button>
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
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">
                      Edit Permissions
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
