import { useState, useEffect, useCallback } from "react";
import * as api from "../api";
import type { Task, Priority, Category } from "../types";

export function useTasks() {
  const [tasks,      setTasks]      = useState<Task[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [t, p, c] = await Promise.all([
        api.getTasks(),
        api.getPriorities(),
        api.getCategories(),
      ]);
      setTasks(t);
      setPriorities(p);
      setCategories(c);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addTask = async (data: {
    title: string; description: string; priority_id: number;
    category_id: number; due_date: string; status: string;
  }) => {
    const task = await api.createTask(data);
    setTasks(prev => [task, ...prev]);
    return task;
  };

  const editTask = async (id: number, data: Parameters<typeof api.updateTask>[1]) => {
    const task = await api.updateTask(id, data);
    setTasks(prev => prev.map(t => t.id === id ? task : t));
    return task;
  };

  const removeTask = async (id: number) => {
    await api.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const changeStatus = async (id: number, status: Task["status"]) => {
    const task = await api.updateTask(id, { status });
    setTasks(prev => prev.map(t => t.id === id ? task : t));
  };

  return { tasks, setTasks, priorities, categories, loading, error, addTask, editTask, removeTask, changeStatus, refetch: fetchAll };
}
