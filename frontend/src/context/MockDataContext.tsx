"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Project, Task, Role, TaskStatus } from "@/lib/mockData";
import { api } from "@/services/api";

interface DataContextType {
  users: User[];
  projects: Project[];
  tasks: Task[];
  addUser: (user: any) => Promise<void>;
  updateUserRole: (id: string, role: Role) => Promise<void>;
  addProject: (project: Omit<Project, "id">) => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      refreshData();
    }
  }, []);

  const refreshData = async () => {
    try {
      // Depending on the role, some of these might fail (e.g. 403 Forbidden). 
      // We will catch errors gracefully.
      const fetchedTasks = await api.getTasks().catch(() => []);
      setTasks(fetchedTasks);

      const fetchedProjects = await api.getProjects().catch(() => []);
      setProjects(fetchedProjects);

      const fetchedUsers = await api.getUsers().catch(() => []);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    }
  };

  const addUser = async (userData: any) => {
    await api.createUser(userData);
    await refreshData();
  };

  const updateUserRole = async (id: string, role: Role) => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
    await api.updateUserRole(id, role);
  };

  const addProject = async (projectData: Omit<Project, "id">) => {
    await api.createProject(projectData);
    await refreshData();
  };

  const addTask = async (taskData: Omit<Task, "id">) => {
    await api.createTask(taskData);
    await refreshData();
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    // Optimistic update
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
    await api.updateTaskStatus(id, status);
  };

  return (
    <DataContext.Provider value={{
      users, projects, tasks,
      addUser, updateUserRole, addProject, addTask, updateTaskStatus, refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}

// Keeping the original hook name so we don't have to rewrite 100 components right now
export function useMockData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}
