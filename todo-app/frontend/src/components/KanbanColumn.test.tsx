import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import KanbanColumn from "./KanbanColumn";
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
    priority: { id: 1, name: "Medium", icon: "🟡" },
    category: { id: 1, name: "General", emoji: "📋" },
    ...overrides,
  };
}

const defaultProps = {
  title: "To Do",
  emoji: "📝",
  status: "todo" as Task["status"],
  tasks: [],
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onStatusChange: vi.fn(),
  onCardClick: vi.fn(),
  isDragOver: false,
  onDragOver: vi.fn(),
  onDragLeave: vi.fn(),
  onDrop: vi.fn(),
  draggedTaskId: null,
  inFlightTaskIds: new Set<number>(),
  onDragStart: vi.fn(),
  onDragEnd: vi.fn(),
};

// ---------------------------------------------------------------------------
// 9.2 — drag-over CSS class is applied when isDragOver is true
// ---------------------------------------------------------------------------

describe("KanbanColumn drop target behavior", () => {
  it("applies the drag-over CSS class to the cards container when isDragOver is true", () => {
    render(<KanbanColumn {...defaultProps} isDragOver={true} />);

    const container = document.querySelector(".kanban-column__cards");
    expect(container).not.toBeNull();
    expect(container).toHaveClass("drag-over");
  });

  // -------------------------------------------------------------------------
  // 9.3 — drag-over CSS class is absent when isDragOver is false
  // -------------------------------------------------------------------------

  it("does not apply the drag-over CSS class when isDragOver is false", () => {
    render(<KanbanColumn {...defaultProps} isDragOver={false} />);

    const container = document.querySelector(".kanban-column__cards");
    expect(container).not.toBeNull();
    expect(container).not.toHaveClass("drag-over");
  });

  // -------------------------------------------------------------------------
  // 9.4 — aria-dropeffect="move" is present when draggedTaskId is non-null
  // -------------------------------------------------------------------------

  it('sets aria-dropeffect="move" on the cards container when draggedTaskId is non-null', () => {
    render(<KanbanColumn {...defaultProps} draggedTaskId={42} />);

    const container = screen.getByRole("list");
    expect(container).toHaveAttribute("aria-dropeffect", "move");
  });

  it("does not set aria-dropeffect on the cards container when draggedTaskId is null", () => {
    render(<KanbanColumn {...defaultProps} draggedTaskId={null} />);

    const container = screen.getByRole("list");
    expect(container).not.toHaveAttribute("aria-dropeffect");
  });

  // -------------------------------------------------------------------------
  // 9.5 — onDrop callback is called when a drop event fires on the cards container
  // -------------------------------------------------------------------------

  it("calls onDrop when a drop event fires on the cards container", () => {
    const onDrop = vi.fn();
    render(<KanbanColumn {...defaultProps} onDrop={onDrop} />);

    const container = screen.getByRole("list");
    fireEvent.drop(container);

    expect(onDrop).toHaveBeenCalledOnce();
  });

  // -------------------------------------------------------------------------
  // Additional coverage: onDragOver and onDragLeave are wired up
  // -------------------------------------------------------------------------

  it("calls onDragOver when a dragover event fires on the cards container", () => {
    const onDragOver = vi.fn();
    render(<KanbanColumn {...defaultProps} onDragOver={onDragOver} />);

    const container = screen.getByRole("list");
    fireEvent.dragOver(container);

    expect(onDragOver).toHaveBeenCalledOnce();
  });

  it("calls onDragLeave when a dragleave event fires on the cards container", () => {
    const onDragLeave = vi.fn();
    render(<KanbanColumn {...defaultProps} onDragLeave={onDragLeave} />);

    const container = screen.getByRole("list");
    fireEvent.dragLeave(container);

    expect(onDragLeave).toHaveBeenCalledOnce();
  });

  // -------------------------------------------------------------------------
  // Renders tasks and passes drag props down to TaskCards
  // -------------------------------------------------------------------------

  it("renders task cards when tasks are provided", () => {
    const task = makeTask({ id: 1, title: "My Task", status: "todo" });
    render(<KanbanColumn {...defaultProps} tasks={[task]} />);

    expect(screen.getByText("My Task")).toBeInTheDocument();
  });

  it("shows empty state message when no tasks are provided", () => {
    render(<KanbanColumn {...defaultProps} tasks={[]} />);

    expect(screen.getByText("No tasks here yet")).toBeInTheDocument();
  });
});
