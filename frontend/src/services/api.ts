import axios from 'axios';
import { User, Project, Task, Role, TaskStatus } from "@/lib/mockData"; // Reusing types for now

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authApi = {
  login: async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
};

export const api = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data.data;
  },
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data;
  },
  createUser: async (userData: any): Promise<User> => {
    // Admins creating a user is basically registering them
    const response = await apiClient.post('/auth/register', userData);
    return response.data.data;
  },
  updateUser: async (id: string, userData: any): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data.data;
  },
  updateUserRole: async (id: string, role: Role): Promise<void> => {
    await apiClient.patch(`/users/${id}/role`, { role });
  },
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects');
    return response.data.data.map((p: any) => ({
      ...p,
      memberIds: p.members?.map((m: any) => m.userId) || []
    }));
  },
  createProject: async (projectData: Omit<Project, "id">): Promise<Project> => {
    const response = await apiClient.post('/projects', projectData);
    return response.data.data;
  },
  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks');
    return response.data.data;
  },
  createTask: async (taskData: Omit<Task, "id">): Promise<Task> => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data.data;
  },
  updateTaskStatus: async (id: string, status: TaskStatus): Promise<void> => {
    await apiClient.patch(`/tasks/${id}/status`, { status });
  },
};

export default apiClient;
