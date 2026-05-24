import React from "react";
import type { Task } from "../types";
import TaskCard from "./TaskCard";

interface Props {
  title:    string;
  emoji:    string;
  status:   Task["status"];
  tasks:    Task[];
  onEdit:   (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: Task["status"]) => void;
  onCardClick: (task: Task) => void;
}

export default function KanbanColumn({
  title, emoji, status, tasks, onEdit, onDelete, onStatusChange, onCardClick,
}: Props) {
  const colorMap: Record<Task["status"], string> = {
    todo:        "column--todo",
    in_progress: "column--progress",
    completed:   "column--done",
  };

  return (
    <section className={`kanban-column ${colorMap[status]}`} aria-label={`${title} column`}>
      <header className="kanban-column__header">
        <span className="kanban-column__emoji" aria-hidden="true">{emoji}</span>
        <h2 className="kanban-column__title">{title}</h2>
        <span className="kanban-column__count" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
      </header>

      <div className="kanban-column__cards" role="list">
        {tasks.length === 0 ? (
          <p className="kanban-column__empty">No tasks here yet</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} role="listitem">
              <TaskCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                onClick={onCardClick}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
