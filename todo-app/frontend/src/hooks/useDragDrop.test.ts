import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDragDrop } from "./useDragDrop";
import type { Task } from "../types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockDragEvent = (data: Record<string, string> = {}) =>
  ({
    preventDefault: vi.fn(),
    dataTransfer: {
      setData: vi.fn(),
      getData: (key: string) => data[key] ?? "",
    },
  } as unknown as React.DragEvent);

const makeTasks = (): Task[] => [
  {
    id: 1,
    title: "Task One",
    description: "",
    status: "todo",
    due_date: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    priority: { id: 1, name: "Medium", icon: "🟡" },
    category: { id: 1, name: "General", emoji: "📋" },
  },
  {
    id: 2,
    title: "Task Two",
    description: "",
    status: "in_progress",
    due_date: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    priority: { id: 1, name: "Medium", icon: "🟡" },
    category: { id: 1, name: "General", emoji: "📋" },
  },
];

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("useDragDrop", () => {
  let tasks: Task[];
  let setTasks: ReturnType<typeof vi.fn>;
  let changeStatus: ReturnType<typeof vi.fn>;
  let onError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    tasks = makeTasks();
    setTasks = vi.fn((updater: unknown) => {
      if (typeof updater === "function") {
        tasks = (updater as (prev: Task[]) => Task[])(tasks);
      } else {
        tasks = updater as Task[];
      }
    });
    changeStatus = vi.fn().mockResolvedValue(undefined);
    onError = vi.fn();
  });

  // -------------------------------------------------------------------------
  // 7.2 — onDragStart sets draggedTaskId
  // -------------------------------------------------------------------------
  it("onDragStart sets draggedTaskId to the given task id", () => {
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    const event = mockDragEvent();

    act(() => {
      result.current.onDragStart(1, event);
    });

    expect(result.current.draggedTaskId).toBe(1);
  });

  it("onDragStart writes the task id to dataTransfer as text/plain", () => {
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    const event = mockDragEvent();

    act(() => {
      result.current.onDragStart(2, event);
    });

    expect(event.dataTransfer.setData).toHaveBeenCalledWith("text/plain", "2");
  });

  // -------------------------------------------------------------------------
  // 7.3 — onDragEnd clears draggedTaskId and dragOverColumn
  // -------------------------------------------------------------------------
  it("onDragEnd clears draggedTaskId to null", () => {
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    act(() => {
      result.current.onDragStart(1, mockDragEvent());
    });
    expect(result.current.draggedTaskId).toBe(1);

    act(() => {
      result.current.onDragEnd();
    });

    expect(result.current.draggedTaskId).toBeNull();
  });

  it("onDragEnd clears dragOverColumn to null", () => {
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    act(() => {
      result.current.onDragOver("in_progress", mockDragEvent());
    });
    expect(result.current.dragOverColumn).toBe("in_progress");

    act(() => {
      result.current.onDragEnd();
    });

    expect(result.current.dragOverColumn).toBeNull();
  });

  // -------------------------------------------------------------------------
  // 7.4 — onDragOver sets dragOverColumn
  // -------------------------------------------------------------------------
  it("onDragOver sets dragOverColumn to the given status", () => {
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    act(() => {
      result.current.onDragOver("completed", mockDragEvent());
    });

    expect(result.current.dragOverColumn).toBe("completed");
  });

  it("onDragOver calls preventDefault on the event", () => {
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    const event = mockDragEvent();

    act(() => {
      result.current.onDragOver("todo", event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // 7.5 — onDragLeave clears dragOverColumn
  // -------------------------------------------------------------------------
  it("onDragLeave clears dragOverColumn to null", () => {
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    act(() => {
      result.current.onDragOver("todo", mockDragEvent());
    });
    expect(result.current.dragOverColumn).toBe("todo");

    act(() => {
      result.current.onDragLeave();
    });

    expect(result.current.dragOverColumn).toBeNull();
  });

  // -------------------------------------------------------------------------
  // 7.6 — Same-column drop: no changeStatus call, task list unchanged
  // -------------------------------------------------------------------------
  it("same-column drop makes no changeStatus call", async () => {
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    // Task 1 is in "todo" — drop onto "todo" (same column)
    const event = mockDragEvent({ "text/plain": "1" });

    await act(async () => {
      await result.current.onDrop("todo", event);
    });

    expect(changeStatus).not.toHaveBeenCalled();
  });

  it("same-column drop leaves the task list unchanged", async () => {
    const originalTasks = makeTasks();
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    const event = mockDragEvent({ "text/plain": "1" });

    await act(async () => {
      await result.current.onDrop("todo", event);
    });

    // setTasks should not have been called with an update
    expect(setTasks).not.toHaveBeenCalled();
    // tasks array is structurally unchanged
    expect(tasks).toEqual(originalTasks);
  });

  // -------------------------------------------------------------------------
  // 7.7 — In-flight task drop is silently ignored
  // -------------------------------------------------------------------------
  it("in-flight task drop makes no changeStatus call and leaves task list unchanged", async () => {
    // Use a never-resolving promise to keep the first drop in-flight
    let resolveFirst!: () => void;
    const firstDropPromise = new Promise<void>((resolve) => {
      resolveFirst = resolve;
    });
    changeStatus = vi.fn().mockReturnValueOnce(firstDropPromise);

    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    // First drop: task 1 from "todo" → "in_progress" (starts in-flight)
    const firstEvent = mockDragEvent({ "text/plain": "1" });
    act(() => {
      result.current.onDrop("in_progress", firstEvent);
    });

    // At this point task 1 should be in-flight
    expect(result.current.inFlightTaskIds.has(1)).toBe(true);

    // Reset call count to isolate the second drop
    changeStatus.mockClear();
    const tasksBefore = [...tasks];

    // Second drop attempt on the same task while it's in-flight
    const secondEvent = mockDragEvent({ "text/plain": "1" });
    await act(async () => {
      await result.current.onDrop("completed", secondEvent);
    });

    // changeStatus must NOT have been called for the second drop
    expect(changeStatus).not.toHaveBeenCalled();
    // Task list must be unchanged since the first optimistic update
    expect(tasks).toEqual(tasksBefore);

    // Clean up: resolve the first drop
    resolveFirst();
  });

  // -------------------------------------------------------------------------
  // 7.8 — Successful cross-column drop calls changeStatus with correct args
  // -------------------------------------------------------------------------
  it("successful cross-column drop calls changeStatus with the correct id and target status", async () => {
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    // Task 1 is in "todo" — drop onto "completed"
    const event = mockDragEvent({ "text/plain": "1" });

    await act(async () => {
      await result.current.onDrop("completed", event);
    });

    expect(changeStatus).toHaveBeenCalledOnce();
    expect(changeStatus).toHaveBeenCalledWith(1, "completed");
  });

  it("successful cross-column drop applies the optimistic status update", async () => {
    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    const event = mockDragEvent({ "text/plain": "1" });

    await act(async () => {
      await result.current.onDrop("completed", event);
    });

    const updatedTask = tasks.find((t) => t.id === 1);
    expect(updatedTask?.status).toBe("completed");
  });

  // -------------------------------------------------------------------------
  // 7.9 — Failed API call reverts status and calls onError with non-empty string
  // -------------------------------------------------------------------------
  it("failed API call reverts the task status to its original value", async () => {
    changeStatus = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    // Task 1 starts as "todo"
    const event = mockDragEvent({ "text/plain": "1" });

    await act(async () => {
      await result.current.onDrop("completed", event);
    });

    // After revert, task 1 should be back to "todo"
    const revertedTask = tasks.find((t) => t.id === 1);
    expect(revertedTask?.status).toBe("todo");
  });

  it("failed API call calls onError with a non-empty string", async () => {
    changeStatus = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      useDragDrop({ tasks, setTasks, changeStatus, onError })
    );

    const event = mockDragEvent({ "text/plain": "1" });

    await act(async () => {
      await result.current.onDrop("completed", event);
    });

    expect(onError).toHaveBeenCalledOnce();
    const errorArg: string = onError.mock.calls[0][0];
    expect(typeof errorArg).toBe("string");
    expect(errorArg.length).toBeGreaterThan(0);
  });
});
