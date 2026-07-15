"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<{id: number, name: string, email: string, role: string}[]>([]);

  useEffect(() => {
    // In a real app, we would fetch users from the API here
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">1</td>
              <td className="py-2">Test Admin</td>
              <td className="py-2">admin@test.com</td>
              <td className="py-2"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">ADMIN</span></td>
              <td className="py-2">
                <button className="text-blue-600 hover:underline mr-2">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
            {/* More user rows would be mapped here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
