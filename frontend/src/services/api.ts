import axios from 'axios';
import { User, Project, Task, Role, TaskStatus } from "@/types"; // Reusing types for now

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

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
  login: async (credentials: Record<string, unknown>) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData: Record<string, unknown>) => {
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
  createUser: async (userData: Record<string, unknown>): Promise<User> => {
    // Admins creating a user is basically registering them
    const response = await apiClient.post('/auth/register', userData);
    return response.data.data;
  },
  updateUser: async (id: string, userData: Record<string, unknown>): Promise<User> => {
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
    return response.data.data.map((p: Omit<Project, 'memberIds'> & { members?: { userId: string }[] }) => ({
      ...p,
      memberIds: p.members?.map(m => m.userId) || []
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
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get('/notifications');
    return response.data.data;
  },
  markNotificationAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/notifications/${id}/read`);
  },
  markAllNotificationsAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/mark-all-read');
  },
};

export default apiClient;

