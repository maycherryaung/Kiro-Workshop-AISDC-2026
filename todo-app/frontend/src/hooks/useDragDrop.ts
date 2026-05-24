import { useState, useCallback } from "react";
import type { Task } from "../types";

// 2.1 — TypeScript interfaces as specified in the design document

interface UseDragDropOptions {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  changeStatus: (id: number, status: Task["status"]) => Promise<void>;
  onError: (message: string) => void;
}

interface UseDragDropReturn {
  draggedTaskId: number | null;
  dragOverColumn: Task["status"] | null;
  inFlightTaskIds: Set<number>;
  onDragStart: (taskId: number, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (status: Task["status"], e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (targetStatus: Task["status"], e: React.DragEvent) => void;
}

export function useDragDrop({
  tasks,
  setTasks,
  changeStatus,
  onError,
}: UseDragDropOptions): UseDragDropReturn {
  // 2.2 — draggedTaskId and dragOverColumn state
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Task["status"] | null>(null);

  // 2.3 — inFlightTaskIds as a Set<number>
  const [inFlightTaskIds, setInFlightTaskIds] = useState<Set<number>>(new Set());

  // 2.4 — onDragStart: set draggedTaskId, write task id to dataTransfer as text/plain
  const onDragStart = useCallback((taskId: number, e: React.DragEvent) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", String(taskId));
  }, []);

  // 2.5 — onDragEnd: clear draggedTaskId and dragOverColumn
  const onDragEnd = useCallback(() => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  }, []);

  // 2.6 — onDragOver: call e.preventDefault() and set dragOverColumn
  const onDragOver = useCallback((status: Task["status"], e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(status);
  }, []);

  // 2.7 — onDragLeave: clear dragOverColumn
  const onDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  // 2.8 — onDrop: full optimistic update with revert on failure
  const onDrop = useCallback(
    async (targetStatus: Task["status"], e: React.DragEvent) => {
      e.preventDefault();

      // Read task id from dataTransfer
      const rawId = e.dataTransfer.getData("text/plain");
      const taskId = parseInt(rawId, 10);
      if (isNaN(taskId)) return;

      // Find the task and its current status
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Skip if same column
      if (task.status === targetStatus) return;

      // Skip if task is already in-flight
      if (inFlightTaskIds.has(taskId)) return;

      // Snapshot previous status for potential revert
      const previousStatus = task.status;

      // Apply optimistic update immediately
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
      );

      // Mark task as in-flight (new Set to trigger re-render)
      setInFlightTaskIds((prev) => new Set(prev).add(taskId));

      // Clear drag visual state
      setDraggedTaskId(null);
      setDragOverColumn(null);

      try {
        await changeStatus(taskId, targetStatus);
      } catch {
        // Revert optimistic update on failure
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: previousStatus } : t))
        );
        onError(`Failed to move task. Please try again.`);
      } finally {
        // Always remove task from in-flight set
        setInFlightTaskIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }
    },
    [tasks, inFlightTaskIds, setTasks, changeStatus, onError]
  );

  return {
    draggedTaskId,
    dragOverColumn,
    inFlightTaskIds,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
  };
}
