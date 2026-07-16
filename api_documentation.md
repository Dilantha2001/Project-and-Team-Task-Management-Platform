# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication (`/api/auth`)

### POST `/api/auth/login`
Authenticates a user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": { "id": "uuid", "name": "...", "role": "ADMIN|PROJECT_MANAGER|TEAM_MEMBER" }
  }
  ```

### GET `/api/auth/me`
Retrieves the currently authenticated user's profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with user object.

---

## Users (`/api/users`)

### GET `/api/users`
Retrieves a list of users. Admins see all users, Managers see team members.
- **Headers**: `Authorization: Bearer <token>`

---

## Projects (`/api/projects`)

### GET `/api/projects`
Retrieves projects based on role. Admins see all, Managers see managed projects, Members see assigned projects.
- **Headers**: `Authorization: Bearer <token>`

### POST `/api/projects`
*(Admin & Project Manager only)* Creates a new project.
- **Request Body**:
  ```json
  {
    "name": "Project Name",
    "description": "...",
    "memberIds": ["uuid-1", "uuid-2"]
  }
  ```

---

## Tasks (`/api/tasks`)

### GET `/api/tasks`
Retrieves tasks.
- **Headers**: `Authorization: Bearer <token>`

### POST `/api/tasks`
*(Project Manager only)* Creates a new task.
- **Request Body**:
  ```json
  {
    "title": "Task Title",
    "description": "...",
    "projectId": "uuid",
    "assigneeId": "uuid",
    "dueDate": "2024-12-31T00:00:00Z"
  }
  ```

### PUT `/api/tasks/:id/status`
Updates task status (`TODO`, `IN_PROGRESS`, `DONE`).
- **Request Body**:
  ```json
  {
    "status": "DONE"
  }
  ```

---

## Notifications (`/api/notifications`)

### GET `/api/notifications`
Retrieves user notifications.

### PUT `/api/notifications/:id/read`
Marks a specific notification as read.

### PUT `/api/notifications/read-all`
Marks all notifications as read for the user.
