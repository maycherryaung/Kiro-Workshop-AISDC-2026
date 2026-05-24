# Implementation Plan: Kanban Drag and Drop

## Overview

This plan implements native HTML5 drag-and-drop on the TaskFlow Kanban board. The work is organized into ten groups: testing infrastructure, the new `useDragDrop` hook, updates to `TaskCard` and `KanbanColumn`, wiring in `App.tsx`, CSS visual states, and unit + property-based tests. No new runtime npm dependencies are introduced; fast-check and Vitest are added as dev dependencies only.

## Tasks

- [x] 1. Set up testing infrastructure
  - [x] 1.1 Install Vitest, @vitest/ui, jsdom, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, and fast-check as dev dependencies in the frontend package
  - [x] 1.2 Add a `vitest.config.ts` (or update `vite.config.ts`) to configure the jsdom test environment and setup files
  - [x] 1.3 Add a `src/setupTests.ts` file that imports `@testing-library/jest-dom` matchers
  - [x] 1.4 Add a `"test"` script to `package.json` that runs `vitest run`

- [x] 2. Create the `useDragDrop` hook
  - [x] 2.1 Create `frontend/src/hooks/useDragDrop.ts` with the `UseDragDropOptions` and `UseDragDropReturn` TypeScript interfaces as specified in the design document
  - [x] 2.2 Implement `draggedTaskId` and `dragOverColumn` state with `useState`
  - [x] 2.3 Implement `inFlightTaskIds` state as a `Set<number>` to track pending API calls
  - [x] 2.4 Implement `onDragStart(taskId, e)`: set `draggedTaskId`, write task id to `e.dataTransfer` as `text/plain`
  - [x] 2.5 Implement `onDragEnd()`: clear `draggedTaskId` and `dragOverColumn`
  - [x] 2.6 Implement `onDragOver(status, e)`: call `e.preventDefault()` and set `dragOverColumn` to the given status
  - [x] 2.7 Implement `onDragLeave()`: clear `dragOverColumn`
  - [x] 2.8 Implement `onDrop(targetStatus, e)`: call `e.preventDefault()`, read task id from `dataTransfer`, skip if same column or task is in-flight, snapshot `previousStatus`, apply optimistic `setTasks` update, add task id to `inFlightTaskIds`, call `changeStatus`, on failure revert `setTasks` and call `onError`, always remove task id from `inFlightTaskIds` and clear drag state

- [x] 3. Update `TaskCard` with drag source props and behavior
  - [x] 3.1 Add `isDragging: boolean`, `isInFlight: boolean`, `onDragStart: (e: React.DragEvent) => void`, and `onDragEnd: (e: React.DragEvent) => void` to the `TaskCard` Props interface
  - [x] 3.2 Add `draggable={!isInFlight}` to the `<article>` element
  - [x] 3.3 Add `onDragStart` and `onDragEnd` handlers to the `<article>` element
  - [x] 3.4 Add `aria-grabbed={isDragging}` to the `<article>` element (announces draggable state to screen readers, satisfying Requirement 5.2)
  - [x] 3.5 Apply the `dragging` CSS class conditionally on the `<article>` when `isDragging` is true
  - [x] 3.6 Apply a visual dim style (e.g., `in-flight` CSS class) when `isInFlight` is true
  - [x] 3.7 Ensure action buttons (`onEdit`, `onDelete`, `onStatusChange`) retain `onClick` with `e.stopPropagation()` so clicks do not bubble to the drag handler (Requirement 6.1–6.4)

- [x] 4. Update `KanbanColumn` with drop target props and behavior
  - [x] 4.1 Add `isDragOver: boolean`, `onDragOver: (e: React.DragEvent) => void`, `onDragLeave: (e: React.DragEvent) => void`, and `onDrop: (e: React.DragEvent) => void` to the `KanbanColumn` Props interface
  - [x] 4.2 Add `isDragging: boolean` and `inFlightTaskIds: Set<number>` props so the column can pass them down to each `TaskCard`
  - [x] 4.3 Add `draggedTaskId: number | null` prop so the column can pass `isDragging` to the correct `TaskCard`
  - [x] 4.4 Wire `onDragOver`, `onDragLeave`, and `onDrop` event handlers onto the `.kanban-column__cards` container div
  - [x] 4.5 Apply the `drag-over` CSS class to `.kanban-column__cards` conditionally when `isDragOver` is true (Requirement 2.1)
  - [x] 4.6 Add `aria-dropeffect="move"` to the `.kanban-column__cards` container when a drag is in progress (Requirement 5.3)
  - [x] 4.7 Pass `isDragging`, `isInFlight`, `onDragStart`, and `onDragEnd` props down to each `TaskCard`

- [x] 5. Update `App.tsx` to wire drag-and-drop
  - [x] 5.1 Expose `setTasks` from `useTasks` (or add a `setTasksDirectly` escape hatch) so `useDragDrop` can apply optimistic updates
  - [x] 5.2 Instantiate `useDragDrop` in `App.tsx`, passing `tasks`, `setTasks`, `changeStatus`, and an `onError` callback
  - [x] 5.3 Add `errorMessage` state (`string | null`) with a 5-second auto-clear `setTimeout` in the `onError` callback (Requirement 4.3)
  - [x] 5.4 Render a dismissible error banner above the board when `errorMessage` is set (Requirement 3.5, 4.3)
  - [x] 5.5 Pass `isDragOver`, `onDragOver`, `onDragLeave`, `onDrop`, `draggedTaskId`, and `inFlightTaskIds` to each `KanbanColumn` in the `COLUMNS.map` render

- [x] 6. Add CSS for drag-and-drop visual states
  - [x] 6.1 Add `.task-card.dragging { opacity: 0.5; cursor: grabbing; }` to `index.css` (Requirement 1.3)
  - [x] 6.2 Add `.task-card.in-flight { opacity: 0.6; cursor: not-allowed; }` to `index.css`
  - [x] 6.3 Add `.task-card { cursor: grab; }` so cards show a grab cursor when hoverable (Requirement 1.1)
  - [x] 6.4 Add `.kanban-column__cards.drag-over { border: 2px dashed var(--accent, #6366f1); background: rgba(99,102,241,0.06); }` to `index.css` (Requirement 2.1)
  - [x] 6.5 Add `.task-card__actions button { pointer-events: auto; }` and ensure action buttons are not affected by the card's drag cursor (Requirement 6.5)
  - [x] 6.6 Add a visible focus ring style for status-change buttons: `.task-card__actions button:focus-visible { outline: 2px solid var(--accent, #6366f1); outline-offset: 2px; }` (Requirement 5.4)
  - [x] 6.7 Add `.drag-error-banner` styles for the error banner (background, padding, border-radius, auto-dismiss animation)

- [x] 7. Write unit tests for `useDragDrop`
  - [x] 7.1 Create `frontend/src/hooks/useDragDrop.test.ts`
  - [x] 7.2 Test that `onDragStart` sets `draggedTaskId` to the given task id
  - [x] 7.3 Test that `onDragEnd` clears `draggedTaskId` to null and `dragOverColumn` to null
  - [x] 7.4 Test that `onDragOver` sets `dragOverColumn` to the given status
  - [x] 7.5 Test that `onDragLeave` clears `dragOverColumn` to null
  - [x] 7.6 Test that a same-column drop makes no `changeStatus` call and leaves the task list unchanged
  - [x] 7.7 Test that an in-flight task drop is silently ignored (no `changeStatus` call, task list unchanged)
  - [x] 7.8 Test that a successful cross-column drop calls `changeStatus` with the correct id and target status
  - [x] 7.9 Test that a failed API call reverts the task's status to its original value and calls `onError` with a non-empty string

- [x] 8. Write unit tests for `TaskCard` drag behavior
  - [x] 8.1 Create (or extend) `frontend/src/components/TaskCard.test.tsx`
  - [x] 8.2 Test that `draggable="true"` is present on the article element when `isInFlight` is false
  - [x] 8.3 Test that `draggable="false"` is present on the article element when `isInFlight` is true
  - [x] 8.4 Test that the `dragging` CSS class is applied when `isDragging` is true and absent when false
  - [x] 8.5 Test that `aria-grabbed="true"` is present when `isDragging` is true
  - [x] 8.6 Test that clicking the edit button fires `onEdit` and does not fire `onDragStart`
  - [x] 8.7 Test that clicking the delete button fires `onDelete` and does not fire `onDragStart`
  - [x] 8.8 Test that clicking the status-change button fires `onStatusChange` and does not fire `onDragStart`

- [x] 9. Write unit tests for `KanbanColumn` drop target behavior
  - [x] 9.1 Create (or extend) `frontend/src/components/KanbanColumn.test.tsx`
  - [x] 9.2 Test that the `drag-over` CSS class is applied to `.kanban-column__cards` when `isDragOver` is true
  - [x] 9.3 Test that the `drag-over` CSS class is absent when `isDragOver` is false
  - [x] 9.4 Test that `aria-dropeffect="move"` is present on the cards container when `draggedTaskId` is non-null
  - [x] 9.5 Test that `onDrop` callback is called when a drop event fires on the cards container

- [x] 10. Write property-based tests for `useDragDrop` using fast-check
  - [x] 10.1 Create `frontend/src/hooks/useDragDrop.pbt.test.ts`
  - [x] 10.2 Write Property 1 test — drag start identifies the active drag source: generate a random task list and a random task id from the list; assert that after `onDragStart(taskId)`, `draggedTaskId` equals `taskId` (**Validates: Requirements 1.1**)
  - [x] 10.3 Write Property 2 test — drag end without drop is a no-op: generate a random task list and task id; simulate `onDragStart` then `onDragEnd` without `onDrop`; assert `draggedTaskId` is null and the task list is structurally identical (**Validates: Requirements 1.4**)
  - [x] 10.4 Write Property 3 test — drag-over sets column highlight state: generate a random `Task["status"]` value; assert that after `onDragOver(status)`, `dragOverColumn` equals that status (**Validates: Requirements 2.1, 2.3**)
  - [x] 10.5 Write Property 4 test — cross-column drop applies optimistic update immediately: generate a random task list, task id, and target status ≠ current status; assert that synchronously after `onDrop(targetStatus)`, the task's status in the list equals `targetStatus` (**Validates: Requirements 3.1, 4.1**)
  - [x] 10.6 Write Property 5 test — same-column drop is a no-op: generate a random task list and task id; assert that calling `onDrop` with the task's current status leaves the task list structurally identical and `changeStatus` is not called (**Validates: Requirements 3.4**)
  - [x] 10.7 Write Property 6 test — API failure reverts optimistic update to original status: generate a random task list, task id, and target status ≠ current status; simulate optimistic update then API failure; assert the task's status equals its original status and `onError` was called with a non-empty string (**Validates: Requirements 3.5, 4.2**)
  - [x] 10.8 Write Property 7 test — in-flight guard prevents concurrent drops on the same task: generate a random task id and target status; add the task id to `inFlightTaskIds`; assert the task list is unchanged and `changeStatus` is not called (**Validates: Requirements 4.4**)

## Task Dependency Graph

```json
{
  "waves": [
    ["1", "6"],
    ["2", "3"],
    ["4", "7", "10"],
    ["5", "8", "9"]
  ]
}
```

## Notes

- Tasks 1–6 are implementation tasks; tasks 7–10 are testing tasks. Testing tasks depend on both the test infrastructure (task 1) and the corresponding implementation task.
- Task 6 (CSS) has no code dependencies and can be worked on in parallel with any other task.
- The `useTasks` hook needs to expose `setTasks` for the optimistic update pattern; this is a small additive change to `useTasks.ts` handled in task 5.1.
- Property-based tests (task 10) test the pure state-transformation logic of `useDragDrop` in isolation — no DOM rendering required, making them fast and deterministic.
- All seven correctness properties from the design document are covered by tasks 10.2–10.8, each tagged with the requirement(s) they validate.
- No new runtime dependencies are introduced. fast-check, Vitest, and Testing Library are dev-only.
