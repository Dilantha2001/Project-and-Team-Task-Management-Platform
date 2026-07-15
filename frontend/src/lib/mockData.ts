export type Role = "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
  projectId: string;
  dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  managerId: string;
  memberIds: string[];
}

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alex Administrator",
    email: "admin@platform.com",
    role: "ADMIN",
    avatarUrl: "https://i.pravatar.cc/150?u=u1"
  },
  {
    id: "u2",
    name: "Sarah Manager",
    email: "manager@platform.com",
    role: "PROJECT_MANAGER",
    avatarUrl: "https://i.pravatar.cc/150?u=u2"
  },
  {
    id: "u3",
    name: "John Developer",
    email: "john@platform.com",
    role: "TEAM_MEMBER",
    avatarUrl: "https://i.pravatar.cc/150?u=u3"
  },
  {
    id: "u4",
    name: "Emma Designer",
    email: "emma@platform.com",
    role: "TEAM_MEMBER",
    avatarUrl: "https://i.pravatar.cc/150?u=u4"
  }
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Website Redesign",
    description: "Modernizing the corporate website with a new tech stack and fresh design.",
    status: "ACTIVE",
    managerId: "u2",
    memberIds: ["u3", "u4"]
  },
  {
    id: "p2",
    name: "Mobile App V2",
    description: "Developing the next generation mobile application for our users.",
    status: "PLANNING",
    managerId: "u2",
    memberIds: ["u3"]
  }
];

export const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Setup Next.js Project",
    description: "Initialize the frontend repository using Next.js and Tailwind CSS.",
    status: "DONE",
    assigneeId: "u3",
    projectId: "p1",
    dueDate: "2024-05-10"
  },
  {
    id: "t2",
    title: "Design System Implementation",
    description: "Create core UI components (buttons, cards, inputs) following the new design specs.",
    status: "IN_PROGRESS",
    assigneeId: "u4",
    projectId: "p1",
    dueDate: "2024-05-15"
  },
  {
    id: "t3",
    title: "API Integration Planning",
    description: "Define the REST API endpoints and data models for the backend.",
    status: "TODO",
    assigneeId: "u3",
    projectId: "p2",
    dueDate: "2024-06-01"
  }
];
