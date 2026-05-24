import React, { useState, useEffect } from "react";
import type { Task, Priority, Category } from "../types";

interface Props {
  task?:       Task | null;   // null = create mode
  priorities:  Priority[];
  categories:  Category[];
  onSave:      (data: {
    title: string; description: string; priority_id: number;
    category_id: number; due_date: string; status: string;
  }) => Promise<void>;
  onClose:     () => void;
}

export default function TaskFormModal({ task, priorities, categories, onSave, onClose }: Props) {
  const [title,       setTitle]       = useState(task?.title       ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priorityId,  setPriorityId]  = useState<number>(task?.priority.id ?? priorities[0]?.id ?? 1);
  const [categoryId,  setCategoryId]  = useState<number>(task?.category.id ?? categories[0]?.id ?? 1);
  const [dueDate,     setDueDate]     = useState(task?.due_date ?? "");
  const [status,      setStatus]      = useState<Task["status"]>(task?.status ?? "todo");
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  // Sync when task prop changes
  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setPriorityId(task?.priority.id ?? priorities[0]?.id ?? 1);
    setCategoryId(task?.category.id ?? categories[0]?.id ?? 1);
    setDueDate(task?.due_date ?? "");
    setStatus(task?.status ?? "todo");
  }, [task, priorities, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    setError("");
    try {
      await onSave({ title: title.trim(), description, priority_id: priorityId, category_id: categoryId, due_date: dueDate, status });
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="form-modal-title" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header className="modal__header">
          <h2 id="form-modal-title">{task ? "Edit Task" : "New Task"}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">✕</button>
        </header>

        <form className="modal__body task-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="form-error" role="alert">{error}</p>}

          <label className="form-field">
            <span>Title <span aria-hidden="true">*</span></span>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              autoFocus
            />
          </label>

          <label className="form-field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more details…"
              rows={3}
            />
          </label>

          <div className="form-row">
            <label className="form-field">
              <span>Priority</span>
              <select value={priorityId} onChange={e => setPriorityId(Number(e.target.value))}>
                {priorities.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Category</span>
              <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-row">
            <label className="form-field">
              <span>Due Date</span>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </label>

            {task && (
              <label className="form-field">
                <span>Status</span>
                <select value={status} onChange={e => setStatus(e.target.value as Task["status"])}>
                  <option value="todo">📋 To Do</option>
                  <option value="in_progress">⚡ In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </label>
            )}
          </div>

          <footer className="modal__footer">
            <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? "Saving…" : task ? "Save Changes" : "Create Task"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
