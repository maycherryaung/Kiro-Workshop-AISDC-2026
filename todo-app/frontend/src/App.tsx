import React, { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import KanbanColumn    from "./components/KanbanColumn";
import TaskFormModal   from "./components/TaskFormModal";
import TaskDetailModal from "./components/TaskDetailModal";
import ConfirmDialog   from "./components/ConfirmDialog";
import type { Task } from "./types";

type Modal =
  | { type: "create" }
  | { type: "edit";   task: Task }
  | { type: "detail"; task: Task }
  | { type: "delete"; task: Task };

const COLUMNS: { status: Task["status"]; title: string; emoji: string }[] = [
  { status: "todo",        title: "To Do",       emoji: "📋" },
  { status: "in_progress", title: "In Progress",  emoji: "⚡" },
  { status: "completed",   title: "Completed",    emoji: "✅" },
];

export default function App() {
  const { tasks, priorities, categories, loading, error, addTask, editTask, removeTask, changeStatus } = useTasks();
  const [modal, setModal] = useState<Modal | null>(null);

  // ── Derived counts ──────────────────────────────────────────────────────────
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending   = tasks.filter(t => t.status !== "completed").length;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSave = async (data: Parameters<typeof addTask>[0]) => {
    if (modal?.type === "edit") {
      await editTask(modal.task.id, data);
    } else {
      await addTask(data);
    }
  };

  const handleDelete = async (task: Task) => {
    setModal({ type: "delete", task });
  };

  const confirmDelete = async () => {
    if (modal?.type === "delete") {
      await removeTask(modal.task.id);
      setModal(null);
    }
  };

  const handleComplete = async (task: Task) => {
    await changeStatus(task.id, "completed");
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* ── Top bar ── */}
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__logo" aria-hidden="true">✅</span>
          <h1 className="topbar__title">TaskFlow</h1>
        </div>

        <div className="topbar__stats" aria-label="Task statistics">
          <span className="stat stat--done"  title="Completed tasks">✅ {completed} done</span>
          <span className="stat stat--pending" title="Pending tasks">⏳ {pending} pending</span>
          <span className="stat stat--total"  title="Total tasks">📊 {tasks.length} total</span>
        </div>

        <button
          className="btn btn--primary"
          onClick={() => setModal({ type: "create" })}
          aria-label="Create new task"
        >
          + New Task
        </button>
      </header>

      {/* ── Main board ── */}
      <main className="board" aria-label="Task board">
        {loading && (
          <div className="board__loading" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            Loading tasks…
          </div>
        )}

        {error && (
          <div className="board__error" role="alert">
            ⚠️ {error} — make sure the backend is running on port 3001.
          </div>
        )}

        {!loading && !error && (
          <div className="kanban">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.status}
                title={col.title}
                emoji={col.emoji}
                status={col.status}
                tasks={tasks.filter(t => t.status === col.status)}
                onEdit={task => setModal({ type: "edit", task })}
                onDelete={handleDelete}
                onStatusChange={(task, status) => changeStatus(task.id, status)}
                onCardClick={task => setModal({ type: "detail", task })}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {(modal?.type === "create" || modal?.type === "edit") && (
        <TaskFormModal
          task={modal.type === "edit" ? modal.task : null}
          priorities={priorities}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "detail" && (
        <TaskDetailModal
          task={modal.task}
          onClose={() => setModal(null)}
          onDelete={task => { setModal(null); handleDelete(task); }}
          onComplete={handleComplete}
        />
      )}

      {modal?.type === "delete" && (
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${modal.task.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
