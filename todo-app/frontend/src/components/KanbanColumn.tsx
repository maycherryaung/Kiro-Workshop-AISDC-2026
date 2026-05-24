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
  // Drop target props (4.1)
  isDragOver:  boolean;
  onDragOver:  (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop:      (e: React.DragEvent) => void;
  // Props for passing drag state down to TaskCards (4.2, 4.3)
  draggedTaskId:   number | null;
  inFlightTaskIds: Set<number>;
  // Drag source callbacks forwarded to each TaskCard (4.7)
  onDragStart: (taskId: number, e: React.DragEvent) => void;
  onDragEnd:   () => void;
}

export default function KanbanColumn({
  title, emoji, status, tasks, onEdit, onDelete, onStatusChange, onCardClick,
  isDragOver, onDragOver, onDragLeave, onDrop,
  draggedTaskId, inFlightTaskIds, onDragStart, onDragEnd,
}: Props) {
  const colorMap: Record<Task["status"], string> = {
    todo:        "column--todo",
    in_progress: "column--progress",
    completed:   "column--done",
  };

  // A drag is in progress when any task is being dragged (4.6)
  const isDragging = draggedTaskId !== null;

  return (
    <section className={`kanban-column ${colorMap[status]}`} aria-label={`${title} column`}>
      <header className="kanban-column__header">
        <span className="kanban-column__emoji" aria-hidden="true">{emoji}</span>
        <h2 className="kanban-column__title">{title}</h2>
        <span className="kanban-column__count" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
      </header>

      {/* 4.4: wire drag event handlers; 4.5: conditional drag-over class; 4.6: aria-dropeffect */}
      <div
        className={`kanban-column__cards${isDragOver ? " drag-over" : ""}`}
        role="list"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        aria-dropeffect={isDragging ? "move" : undefined}
      >
        {tasks.length === 0 ? (
          <p className="kanban-column__empty">No tasks here yet</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} role="listitem">
              {/* 4.7: pass isDragging, isInFlight, onDragStart, onDragEnd to each TaskCard */}
              <TaskCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                onClick={onCardClick}
                isDragging={draggedTaskId === task.id}
                isInFlight={inFlightTaskIds.has(task.id)}
                onDragStart={(e) => onDragStart(task.id, e)}
                onDragEnd={onDragEnd}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
