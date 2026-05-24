import React from "react";
import type { Task } from "../types";

interface Props {
  task:         Task;
  onEdit:       (task: Task) => void;
  onDelete:     (task: Task) => void;
  onStatusChange: (task: Task, status: Task["status"]) => void;
  onClick:      (task: Task) => void;
  isDragging:   boolean;
  isInFlight:   boolean;
  onDragStart:  (e: React.DragEvent) => void;
  onDragEnd:    (e: React.DragEvent) => void;
}

const STATUS_NEXT: Record<Task["status"], { label: string; value: Task["status"] }> = {
  todo:        { label: "▶ Start",    value: "in_progress" },
  in_progress: { label: "✔ Complete", value: "completed"   },
  completed:   { label: "↩ Reopen",  value: "todo"         },
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onClick, isDragging, isInFlight, onDragStart, onDragEnd }: Props) {
  const isOverdue =
    task.due_date &&
    task.status !== "completed" &&
    new Date(task.due_date) < new Date();

  return (
    <article
      className={`task-card priority-${task.priority.name.toLowerCase()}${isDragging ? " dragging" : ""}${isInFlight ? " in-flight" : ""}`}
      onClick={() => onClick(task)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick(task)}
      aria-label={`Task: ${task.title}`}
      draggable={!isInFlight}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      aria-grabbed={isDragging}
    >
      {/* Priority stripe */}
      <div className="task-card__stripe" aria-hidden="true" />

      <div className="task-card__body">
        {/* Header row */}
        <div className="task-card__header">
          <span className="task-card__category">
            {task.category.emoji} {task.category.name}
          </span>
          <span className="task-card__priority" title={`Priority: ${task.priority.name}`}>
            {task.priority.icon}
          </span>
        </div>

        {/* Title */}
        <h3 className="task-card__title">{task.title}</h3>

        {/* Description preview */}
        {task.description && (
          <p className="task-card__desc">{task.description}</p>
        )}

        {/* Due date */}
        {task.due_date && (
          <p className={`task-card__due ${isOverdue ? "overdue" : ""}`}>
            📅 {isOverdue ? "⚠ " : ""}
            {new Date(task.due_date).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="task-card__actions" onClick={e => e.stopPropagation()}>
        <button
          className="btn btn--ghost btn--sm"
          onClick={e => { e.stopPropagation(); onStatusChange(task, STATUS_NEXT[task.status].value); }}
          title={STATUS_NEXT[task.status].label}
          aria-label={STATUS_NEXT[task.status].label}
        >
          {STATUS_NEXT[task.status].label}
        </button>
        <button
          className="btn btn--ghost btn--sm btn--icon"
          onClick={e => { e.stopPropagation(); onEdit(task); }}
          title="Edit task"
          aria-label="Edit task"
        >
          ✏️
        </button>
        <button
          className="btn btn--ghost btn--sm btn--icon btn--danger"
          onClick={e => { e.stopPropagation(); onDelete(task); }}
          title="Delete task"
          aria-label="Delete task"
        >
          🗑️
        </button>
      </div>
    </article>
  );
}
