/**
 * Property-Based Tests for useDragDrop hook
 * Feature: kanban-drag-drop
 *
 * Uses fast-check for property generation and Vitest + @testing-library/react
 * for hook rendering.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import * as fc from "fast-check";
import { useDragDrop } from "./useDragDrop";
import type { Task } from "../types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUSES: Task["status"][] = ["todo", "in_progress", "completed"];

/** Build a mock DragEvent that carries an optional taskId in dataTransfer. */
const mockDragEvent = (taskId?: number) =>
  ({
    preventDefault: vi.fn(),
    dataTransfer: {
      setData: vi.fn(),
      getData: (_key: string) =>
        taskId !== undefined ? String(taskId) : "",
    },
  } as unknown as React.DragEvent);

/** Arbitrary for a single Task with all required fields. */
const taskArb = fc.record<Task>({
  id: fc.integer({ min: 1, max: 10_000 }),
  title: fc.string({ minLength: 1, maxLength: 80 }),
  description: fc.string({ maxLength: 200 }),
  status: fc.constantFrom(...STATUSES),
  due_date: fc.option(fc.string({ minLength: 1, maxLength: 20 }), {
    nil: null,
  }),
  created_at: fc.string({ minLength: 1, maxLength: 30 }),
  updated_at: fc.string({ minLength: 1, maxLength: 30 }),
  priority: fc.record({
    id: fc.integer({ min: 1, max: 3 }),
    name: fc.constantFrom("High" as const, "Medium" as const, "Low" as const),
    icon: fc.string({ minLength: 1, maxLength: 10 }),
  }),
  category: fc.record({
    id: fc.integer({ min: 1, max: 100 }),
    name: fc.string({ minLength: 1, maxLength: 40 }),
    emoji: fc.string({ minLength: 1, maxLength: 4 }),
  }),
});

/** Arbitrary for a non-empty list of tasks with unique ids. */
const taskListArb = fc
  .array(taskArb, { minLength: 1, maxLength: 20 })
  .map((tasks) => {
    // Deduplicate by id — keep first occurrence
    const seen = new Set<number>();
    return tasks.filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
  })
  .filter((tasks) => tasks.length > 0);

/**
 * Render the hook with controllable tasks state.
 * Returns the result ref and a helper to read the current tasks.
 */
function setupHook(
  initialTasks: Task[],
  changeStatus: (id: number, status: Task["status"]) => Promise<void>,
  onError: (msg: string) => void
) {
  let tasks = [...initialTasks];
  const setTasks: React.Dispatch<React.SetStateAction<Task[]>> = (
    updater
  ) => {
    tasks =
      typeof updater === "function" ? updater(tasks) : updater;
  };

  const { result } = renderHook(() =>
    useDragDrop({ tasks, setTasks, changeStatus, onError })
  );

  return { result, getTasks: () => tasks };
}

// ---------------------------------------------------------------------------
// Property 1 — drag start identifies the active drag source
// Validates: Requirements 1.1
// ---------------------------------------------------------------------------

describe("useDragDrop property-based tests", () => {
  // Feature: kanban-drag-drop, Property 1: drag start identifies the active drag source
  it("Property 1: onDragStart sets draggedTaskId to the dragged task id", () => {
    fc.assert(
      fc.property(taskListArb, (tasks) => {
        // Pick a random task from the list
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        const taskId = task.id;

        const changeStatus = vi.fn().mockResolvedValue(undefined);
        const onError = vi.fn();
        const { result } = setupHook(tasks, changeStatus, onError);

        act(() => {
          result.current.onDragStart(taskId, mockDragEvent(taskId));
        });

        expect(result.current.draggedTaskId).toBe(taskId);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: kanban-drag-drop, Property 2: drag end without drop is a no-op
  // Validates: Requirements 1.4
  it("Property 2: onDragStart then onDragEnd leaves task list unchanged and draggedTaskId null", () => {
    fc.assert(
      fc.property(taskListArb, (tasks) => {
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        const taskId = task.id;

        const changeStatus = vi.fn().mockResolvedValue(undefined);
        const onError = vi.fn();
        const { result, getTasks } = setupHook(tasks, changeStatus, onError);

        act(() => {
          result.current.onDragStart(taskId, mockDragEvent(taskId));
        });

        act(() => {
          result.current.onDragEnd();
        });

        // draggedTaskId must be null
        expect(result.current.draggedTaskId).toBeNull();

        // Task list must be structurally identical (no status changes)
        const finalTasks = getTasks();
        expect(finalTasks).toHaveLength(tasks.length);
        for (let i = 0; i < tasks.length; i++) {
          expect(finalTasks[i].id).toBe(tasks[i].id);
          expect(finalTasks[i].status).toBe(tasks[i].status);
        }

        // changeStatus must not have been called
        expect(changeStatus).not.toHaveBeenCalled();
      }),
      { numRuns: 100 }
    );
  });

  // Feature: kanban-drag-drop, Property 3: drag-over sets column highlight state
  // Validates: Requirements 2.1, 2.3
  it("Property 3: onDragOver sets dragOverColumn to the given status", () => {
    fc.assert(
      fc.property(fc.constantFrom(...STATUSES), (status) => {
        const tasks: Task[] = [];
        const changeStatus = vi.fn().mockResolvedValue(undefined);
        const onError = vi.fn();
        const { result } = setupHook(tasks, changeStatus, onError);

        act(() => {
          result.current.onDragOver(status, mockDragEvent());
        });

        expect(result.current.dragOverColumn).toBe(status);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: kanban-drag-drop, Property 4: cross-column drop applies optimistic update immediately
  // Validates: Requirements 3.1, 4.1
  it("Property 4: cross-column drop updates task status synchronously before API resolves", () => {
    fc.assert(
      fc.property(
        taskListArb.chain((tasks) => {
          // Pick a task index and a target status different from the task's current status
          return fc
            .integer({ min: 0, max: tasks.length - 1 })
            .chain((idx) => {
              const task = tasks[idx];
              const otherStatuses = STATUSES.filter(
                (s) => s !== task.status
              );
              return fc
                .constantFrom(...otherStatuses)
                .map((targetStatus) => ({ tasks, task, targetStatus }));
            });
        }),
        ({ tasks, task, targetStatus }) => {
          // Use a never-resolving promise so we can check state before resolution
          let resolveChangeStatus!: () => void;
          const changeStatus = vi.fn().mockReturnValue(
            new Promise<void>((resolve) => {
              resolveChangeStatus = resolve;
            })
          );
          const onError = vi.fn();
          const { result, getTasks } = setupHook(tasks, changeStatus, onError);

          act(() => {
            result.current.onDrop(targetStatus, mockDragEvent(task.id));
          });

          // Optimistic update must be visible synchronously
          const updatedTask = getTasks().find((t) => t.id === task.id);
          expect(updatedTask).toBeDefined();
          expect(updatedTask!.status).toBe(targetStatus);

          // Resolve the pending promise to avoid unhandled rejection warnings
          resolveChangeStatus();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: kanban-drag-drop, Property 5: same-column drop is a no-op
  // Validates: Requirements 3.4
  it("Property 5: dropping onto the same column leaves task list unchanged and does not call changeStatus", () => {
    fc.assert(
      fc.property(taskListArb, (tasks) => {
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        const sameStatus = task.status;

        const changeStatus = vi.fn().mockResolvedValue(undefined);
        const onError = vi.fn();
        const { result, getTasks } = setupHook(tasks, changeStatus, onError);

        act(() => {
          result.current.onDrop(sameStatus, mockDragEvent(task.id));
        });

        // changeStatus must not be called
        expect(changeStatus).not.toHaveBeenCalled();

        // Task list must be structurally identical
        const finalTasks = getTasks();
        expect(finalTasks).toHaveLength(tasks.length);
        for (let i = 0; i < tasks.length; i++) {
          expect(finalTasks[i].id).toBe(tasks[i].id);
          expect(finalTasks[i].status).toBe(tasks[i].status);
        }
      }),
      { numRuns: 100 }
    );
  });

  // Feature: kanban-drag-drop, Property 6: API failure reverts optimistic update to original status
  // Validates: Requirements 3.5, 4.2
  it("Property 6: API failure reverts task status to original and calls onError with non-empty string", async () => {
    await fc.assert(
      fc.asyncProperty(
        taskListArb.chain((tasks) => {
          return fc
            .integer({ min: 0, max: tasks.length - 1 })
            .chain((idx) => {
              const task = tasks[idx];
              const otherStatuses = STATUSES.filter(
                (s) => s !== task.status
              );
              return fc
                .constantFrom(...otherStatuses)
                .map((targetStatus) => ({ tasks, task, targetStatus }));
            });
        }),
        async ({ tasks, task, targetStatus }) => {
          const originalStatus = task.status;

          // changeStatus always rejects
          const changeStatus = vi
            .fn()
            .mockRejectedValue(new Error("API error"));
          const onError = vi.fn();
          const { result, getTasks } = setupHook(tasks, changeStatus, onError);

          await act(async () => {
            await result.current.onDrop(targetStatus, mockDragEvent(task.id));
          });

          // Task status must be reverted to original
          const finalTask = getTasks().find((t) => t.id === task.id);
          expect(finalTask).toBeDefined();
          expect(finalTask!.status).toBe(originalStatus);

          // onError must have been called with a non-empty string
          expect(onError).toHaveBeenCalledTimes(1);
          const errorArg = onError.mock.calls[0][0];
          expect(typeof errorArg).toBe("string");
          expect(errorArg.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: kanban-drag-drop, Property 7: in-flight guard prevents concurrent drops on the same task
  // Validates: Requirements 4.4
  it("Property 7: a second drop on an in-flight task is ignored and changeStatus is not called again", async () => {
    await fc.assert(
      fc.asyncProperty(
        taskListArb.chain((tasks) => {
          return fc
            .integer({ min: 0, max: tasks.length - 1 })
            .chain((idx) => {
              const task = tasks[idx];
              const otherStatuses = STATUSES.filter(
                (s) => s !== task.status
              );
              return fc
                .constantFrom(...otherStatuses)
                .map((targetStatus) => ({ tasks, task, targetStatus }));
            });
        }),
        async ({ tasks, task, targetStatus }) => {
          // Use a never-resolving promise so the task stays in-flight
          let resolveFirst!: () => void;
          const changeStatus = vi.fn().mockReturnValue(
            new Promise<void>((resolve) => {
              resolveFirst = resolve;
            })
          );
          const onError = vi.fn();
          const { result, getTasks } = setupHook(tasks, changeStatus, onError);

          // First drop — puts the task in-flight
          act(() => {
            result.current.onDrop(targetStatus, mockDragEvent(task.id));
          });

          // changeStatus should have been called exactly once
          expect(changeStatus).toHaveBeenCalledTimes(1);

          // Snapshot the task list after the first (optimistic) drop
          const tasksAfterFirstDrop = getTasks().map((t) => ({ ...t }));

          // Second drop on the same task — should be ignored
          act(() => {
            result.current.onDrop(targetStatus, mockDragEvent(task.id));
          });

          // changeStatus must still have been called only once
          expect(changeStatus).toHaveBeenCalledTimes(1);

          // Task list must be identical to after the first drop
          const finalTasks = getTasks();
          expect(finalTasks).toHaveLength(tasksAfterFirstDrop.length);
          for (let i = 0; i < tasksAfterFirstDrop.length; i++) {
            expect(finalTasks[i].id).toBe(tasksAfterFirstDrop[i].id);
            expect(finalTasks[i].status).toBe(tasksAfterFirstDrop[i].status);
          }

          // Resolve the first drop to clean up
          resolveFirst();
        }
      ),
      { numRuns: 100 }
    );
  });
});
