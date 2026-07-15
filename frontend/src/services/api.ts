import { User, Project, Task, Role, TaskStatus, mockUsers, mockProjects, mockTasks } from "@/lib/mockData";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get data from localStorage or fallback to initial mock data
const getStoredData = <T>(key: string, initialData: T): T => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
    // Initialize if not present
    localStorage.setItem(key, JSON.stringify(initialData));
  }
  return initialData;
};

// Helper to save data to localStorage
const saveData = <T>(key: string, data: T) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const api = {
  // Users
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return getStoredData("mock_users", mockUsers);
  },
  
  createUser: async (userData: Omit<User, "id" | "avatarUrl">): Promise<User> => {
    await delay(500);
    const users = getStoredData("mock_users", mockUsers);
    const newUser: User = {
      ...userData,
      id: `u${users.length + 1}`,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}`,
    };
    saveData("mock_users", [...users, newUser]);
    return newUser;
  },

  updateUserRole: async (id: string, role: Role): Promise<void> => {
    await delay(200);
    const users = getStoredData("mock_users", mockUsers);
    saveData("mock_users", users.map(u => (u.id === id ? { ...u, role } : u)));
  },

  deleteUser: async (id: string): Promise<void> => {
    await delay(300);
    const users = getStoredData("mock_users", mockUsers);
    saveData("mock_users", users.filter(u => u.id !== id));
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    await delay(300);
    return getStoredData("mock_projects", mockProjects);
  },

  createProject: async (projectData: Omit<Project, "id">): Promise<Project> => {
    await delay(500);
    const projects = getStoredData("mock_projects", mockProjects);
    const newProject: Project = {
      ...projectData,
      id: `p${projects.length + 1}`,
    };
    saveData("mock_projects", [...projects, newProject]);
    return newProject;
  },

  deleteProject: async (id: string): Promise<void> => {
    await delay(300);
    const projects = getStoredData("mock_projects", mockProjects);
    saveData("mock_projects", projects.filter(p => p.id !== id));
  },

  // Tasks
  getTasks: async (): Promise<Task[]> => {
    await delay(300);
    return getStoredData("mock_tasks", mockTasks);
  },

  createTask: async (taskData: Omit<Task, "id">): Promise<Task> => {
    await delay(500);
    const tasks = getStoredData("mock_tasks", mockTasks);
    const newTask: Task = {
      ...taskData,
      id: `t${tasks.length + 1}`,
    };
    saveData("mock_tasks", [...tasks, newTask]);
    return newTask;
  },

  updateTaskStatus: async (id: string, status: TaskStatus): Promise<void> => {
    await delay(200);
    const tasks = getStoredData("mock_tasks", mockTasks);
    saveData("mock_tasks", tasks.map(t => (t.id === id ? { ...t, status } : t)));
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(300);
    const tasks = getStoredData("mock_tasks", mockTasks);
    saveData("mock_tasks", tasks.filter(t => t.id !== id));
  },
};
