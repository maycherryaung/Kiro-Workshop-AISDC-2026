# TaskFlow — To-Do Manager

A full-stack task management app built with **Bun**, **React**, and **bun:sqlite**.

## Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Runtime  | Bun                           |
| Frontend | React 18 + Vite + TypeScript  |
| Backend  | Bun HTTP server (no framework)|
| Database | bun:sqlite (built-in SQLite)  |

## Prerequisites

Install Bun (if not already installed):

```powershell
# Windows (PowerShell)
irm bun.sh/install.ps1 | iex
```

Or visit https://bun.sh for other installation options.

## Quick Start

### 1. Install dependencies

```bash
# Backend
cd todo-app/backend
bun install

# Frontend
cd ../frontend
bun install
```

### 2. Start the backend

```bash
cd todo-app/backend
bun run dev
# → http://localhost:3001
```

### 3. Start the frontend (new terminal)

```bash
cd todo-app/frontend
bun run dev
# → http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## REST API

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/tasks                      | List all tasks           |
| GET    | /api/tasks/:id                  | Get single task          |
| POST   | /api/tasks                      | Create task              |
| PUT    | /api/tasks/:id                  | Update task              |
| DELETE | /api/tasks/:id                  | Delete task              |
| GET    | /api/tasks/:id/comments         | List comments for task   |
| POST   | /api/tasks/:id/comments         | Add comment to task      |
| GET    | /api/priorities                 | List priorities          |
| GET    | /api/categories                 | List categories          |

## Features

- Kanban board with To Do / In Progress / Completed columns
- 10 pre-loaded sample tasks with realistic data
- Priority indicators: 🔴 High · 🟡 Medium · 🟢 Low
- Category emojis: 💼 Work · 🏠 Personal · 💪 Health · 💰 Finance · 📚 Learning · 🛒 Shopping
- Task counter in the top bar (completed vs pending)
- Create / Edit modal with all fields
- Task detail modal with full description, status badge, and comments
- Delete confirmation dialog
- Notes/comments section per task with sample comments
- Overdue date highlighting
- Responsive layout (stacks to single column on mobile)
- Dark theme
