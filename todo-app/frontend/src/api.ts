import type { Task, Comment, Priority, Category } from "./types";

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

// Tasks
export const getTasks       = ()                          => request<Task[]>("/tasks");
export const getTask        = (id: number)                => request<Task>(`/tasks/${id}`);
export const createTask     = (data: Partial<Task>)       => request<Task>("/tasks", { method: "POST", body: JSON.stringify(data) });
export const updateTask     = (id: number, data: Partial<Task> & { priority_id?: number; category_id?: number }) =>
  request<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteTask     = (id: number)                => request<{ success: boolean }>(`/tasks/${id}`, { method: "DELETE" });

// Comments
export const getComments    = (taskId: number)            => request<Comment[]>(`/tasks/${taskId}/comments`);
export const createComment  = (taskId: number, body: string) =>
  request<Comment>(`/tasks/${taskId}/comments`, { method: "POST", body: JSON.stringify({ body }) });

// Meta
export const getPriorities  = ()                          => request<Priority[]>("/priorities");
export const getCategories  = ()                          => request<Category[]>("/categories");
