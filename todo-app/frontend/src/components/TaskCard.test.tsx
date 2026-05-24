import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "./TaskCard";
import type { Task } from "../types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: "Test Task",
    description: "A test task description",
    status: "todo",
    due_date: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    priority: { id: 2, name: "Medium", icon: "🟡" },
    category: { id: 1, name: "General", emoji: "📋" },
    ...overrides,
  };
}

const defaultProps = {
  task: makeTask(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onStatusChange: vi.fn(),
  onClick: vi.fn(),
  isDragging: false,
  isInFlight: false,
  onDragStart: vi.fn(),
  onDragEnd: vi.fn(),
};

// ---------------------------------------------------------------------------
// 8.2 — draggable="true" when isInFlight is false
// ---------------------------------------------------------------------------

describe("TaskCard draggable attribute", () => {
  it('has draggable="true" on the article element when isInFlight is false', () => {
    render(<TaskCard {...defaultProps} isInFlight={false} />);
    const article = screen.getByRole("button", { name: /Task: Test Task/i });
    expect(article.getAttribute("draggable")).toBe("true");
  });

  // -------------------------------------------------------------------------
  // 8.3 — draggable="false" when isInFlight is true
  // -------------------------------------------------------------------------
  it('has draggable="false" on the article element when isInFlight is true', () => {
    render(<TaskCard {...defaultProps} isInFlight={true} />);
    const article = screen.getByRole("button", { name: /Task: Test Task/i });
    expect(article.getAttribute("draggable")).toBe("false");
  });
});

// ---------------------------------------------------------------------------
// 8.4 — dragging CSS class applied/absent based on isDragging
// ---------------------------------------------------------------------------

describe("TaskCard dragging CSS class", () => {
  it("applies the dragging class when isDragging is true", () => {
    render(<TaskCard {...defaultProps} isDragging={true} />);
    const article = screen.getByRole("button", { name: /Task: Test Task/i });
    expect(article.classList.contains("dragging")).toBe(true);
  });

  it("does not apply the dragging class when isDragging is false", () => {
    render(<TaskCard {...defaultProps} isDragging={false} />);
    const article = screen.getByRole("button", { name: /Task: Test Task/i });
    expect(article.classList.contains("dragging")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 8.5 — aria-grabbed="true" when isDragging is true
// ---------------------------------------------------------------------------

describe("TaskCard aria-grabbed attribute", () => {
  it('has aria-grabbed="true" when isDragging is true', () => {
    render(<TaskCard {...defaultProps} isDragging={true} />);
    const article = screen.getByRole("button", { name: /Task: Test Task/i });
    expect(article.getAttribute("aria-grabbed")).toBe("true");
  });

  it('has aria-grabbed="false" when isDragging is false', () => {
    render(<TaskCard {...defaultProps} isDragging={false} />);
    const article = screen.getByRole("button", { name: /Task: Test Task/i });
    expect(article.getAttribute("aria-grabbed")).toBe("false");
  });
});

// ---------------------------------------------------------------------------
// 8.6 — Clicking edit button fires onEdit and does NOT fire onDragStart
// ---------------------------------------------------------------------------

describe("TaskCard edit button", () => {
  it("fires onEdit when the edit button is clicked", () => {
    const onEdit = vi.fn();
    const onDragStart = vi.fn();
    render(<TaskCard {...defaultProps} onEdit={onEdit} onDragStart={onDragStart} />);

    fireEvent.click(screen.getByRole("button", { name: /Edit task/i }));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledWith(defaultProps.task);
  });

  it("does not fire onDragStart when the edit button is clicked", () => {
    const onDragStart = vi.fn();
    render(<TaskCard {...defaultProps} onDragStart={onDragStart} />);

    fireEvent.click(screen.getByRole("button", { name: /Edit task/i }));

    expect(onDragStart).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 8.7 — Clicking delete button fires onDelete and does NOT fire onDragStart
// ---------------------------------------------------------------------------

describe("TaskCard delete button", () => {
  it("fires onDelete when the delete button is clicked", () => {
    const onDelete = vi.fn();
    const onDragStart = vi.fn();
    render(<TaskCard {...defaultProps} onDelete={onDelete} onDragStart={onDragStart} />);

    fireEvent.click(screen.getByRole("button", { name: /Delete task/i }));

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith(defaultProps.task);
  });

  it("does not fire onDragStart when the delete button is clicked", () => {
    const onDragStart = vi.fn();
    render(<TaskCard {...defaultProps} onDragStart={onDragStart} />);

    fireEvent.click(screen.getByRole("button", { name: /Delete task/i }));

    expect(onDragStart).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 8.8 — Clicking status-change button fires onStatusChange and NOT onDragStart
// ---------------------------------------------------------------------------

describe("TaskCard status-change button", () => {
  it("fires onStatusChange when the status-change button is clicked", () => {
    const onStatusChange = vi.fn();
    const onDragStart = vi.fn();
    const task = makeTask({ status: "todo" });
    render(
      <TaskCard
        {...defaultProps}
        task={task}
        onStatusChange={onStatusChange}
        onDragStart={onDragStart}
      />
    );

    // For a "todo" task the status-change button label is "▶ Start"
    fireEvent.click(screen.getByRole("button", { name: /▶ Start/i }));

    expect(onStatusChange).toHaveBeenCalledOnce();
    expect(onStatusChange).toHaveBeenCalledWith(task, "in_progress");
  });

  it("does not fire onDragStart when the status-change button is clicked", () => {
    const onDragStart = vi.fn();
    const task = makeTask({ status: "todo" });
    render(<TaskCard {...defaultProps} task={task} onDragStart={onDragStart} />);

    fireEvent.click(screen.getByRole("button", { name: /▶ Start/i }));

    expect(onDragStart).not.toHaveBeenCalled();
  });
});
