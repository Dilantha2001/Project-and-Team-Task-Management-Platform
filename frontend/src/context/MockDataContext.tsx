"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Project, Task, mockUsers, mockProjects, mockTasks, Role, TaskStatus, ProjectStatus } from "@/lib/mockData";

interface MockDataContextType {
  users: User[];
  projects: Project[];
  tasks: Task[];
  addUser: (user: Omit<User, "id" | "avatarUrl">) => void;
  updateUserRole: (id: string, role: Role) => void;
  addProject: (project: Omit<Project, "id">) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("mock_users");
    const savedProjects = localStorage.getItem("mock_projects");
    const savedTasks = localStorage.getItem("mock_tasks");

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mock_users", JSON.stringify(users));
      localStorage.setItem("mock_projects", JSON.stringify(projects));
      localStorage.setItem("mock_tasks", JSON.stringify(tasks));
    }
  }, [users, projects, tasks, isLoaded]);

  const addUser = (userData: Omit<User, "id" | "avatarUrl">) => {
    const newUser: User = {
      ...userData,
      id: `u${users.length + 1}`,
      avatarUrl: `https://i.pravatar.cc/150?u=u${users.length + 1}`
    };
    setUsers([...users, newUser]);
  };

  const updateUserRole = (id: string, role: Role) => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const addProject = (projectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...projectData,
      id: `p${projects.length + 1}`
    };
    setProjects([...projects, newProject]);
  };

  const addTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: `t${tasks.length + 1}`
    };
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  return (
    <MockDataContext.Provider value={{
      users, projects, tasks,
      addUser, updateUserRole, addProject, addTask, updateTaskStatus
    }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}
