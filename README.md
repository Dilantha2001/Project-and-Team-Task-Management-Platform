# CyphTask - Project and Team Task Management Platform

**Manage your teams with precision.**

CyphTask is the complete SaaS platform for project managers to assign tasks, track deadlines, and collaborate without friction. It features role-based access control and real-time dashboard analytics.

## 🚀 Features

- **Role-Based Access Control**: Secure dashboards tailored for Admins, Project Managers, and Team Members.
- **Task & Project Management**: Create, assign, and track tasks across multiple projects.
- **Real-Time Analytics**: Monitor team progress, task completion rates, and project health.
- **Collaboration**: Instant notifications and updates keep your team in sync.


## 🛠️ Technology Stack

**Frontend**:
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS v4
- Lucide React (Icons)
- Axios & Zod

**Backend**:
- Node.js & Express
- Prisma ORM
- PostgreSQL (Database)
- JSON Web Tokens (JWT) for Authentication

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL instance running

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dilantha2001/Project-and-Team-Task-Management-Platform.git
   cd Project-and-Team-Task-Management-Platform
   ```

2. **Setup the Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Setup the Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   ## 📸 Screenshots

![Dashboard Overview](./Public/Screenshot%202026-07-16%20141502.png)
![Projects View](./Public/Screenshot%202026-07-16%20141513.png)
![Task Management](./Public/Screenshot%202026-07-16%20141536.png)
![Team Collaboration](./Public/Screenshot%202026-07-16%20141552.png)


4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License
This project is licensed under the MIT License.
