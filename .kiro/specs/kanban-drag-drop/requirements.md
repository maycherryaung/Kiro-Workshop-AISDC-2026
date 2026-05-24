# Requirements Document

## Introduction

This feature adds drag-and-drop functionality to the TaskFlow Kanban board, allowing users to move task cards between the "To Do", "In Progress", and "Completed" columns by dragging them. When a card is dropped into a new column, the task's status is updated immediately via the existing backend API. The feature uses the browser's native HTML5 Drag and Drop API to avoid adding new dependencies, and integrates with the existing `changeStatus` hook and `PUT /api/tasks/:id` endpoint.

## Glossary

- **KanbanBoard**: The main board area rendered in `App.tsx` containing all three Kanban columns.
- **KanbanColumn**: A column component (`KanbanColumn.tsx`) representing one task status: `todo`, `in_progress`, or `completed`.
- **TaskCard**: A card component (`TaskCard.tsx`) representing a single task within a column.
- **DragSource**: The TaskCard being dragged by the user.
- **DropTarget**: The KanbanColumn (or the card list area within it) that receives the dragged card.
- **Status**: The `status` field of a Task, one of `"todo"`, `"in_progress"`, or `"completed"`.
- **DragState**: The transient UI state tracking which task is currently being dragged and which column is being hovered over.
- **API**: The backend REST API, specifically the `PUT /api/tasks/:id` endpoint used to persist status changes.

## Requirements

### Requirement 1: Drag Initiation

**User Story:** As a user, I want to pick up a task card by dragging it, so that I can move it to a different column.

#### Acceptance Criteria

1. WHEN a user begins dragging a TaskCard, THE KanbanBoard SHALL identify that task as the active DragSource and apply a CSS class (e.g., `dragging`) to the TaskCard element that visually distinguishes it from non-dragged cards.
2. WHEN a user begins dragging a TaskCard, THE KanbanBoard SHALL store the task's `id` as a string in the drag event's `text/plain` data transfer payload so it can be retrieved on drop.
3. WHILE a drag is in progress, THE TaskCard SHALL render at an opacity of 0.5 (or lower) in its original column so the user can see both the drag ghost and the card's original position.
4. WHEN a drag operation ends without a valid drop (dragend fires without a preceding drop on a KanbanColumn), THE KanbanBoard SHALL remove the `dragging` CSS class and restore the TaskCard to its default opacity with no status change applied.

---

### Requirement 2: Drop Target Highlighting

**User Story:** As a user, I want to see visual feedback on the target column as I drag a card over it, so that I know where the card will be dropped.

#### Acceptance Criteria

1. WHEN a task card being dragged enters a KanbanColumn's card list area (the scrollable container that holds TaskCards), THE KanbanColumn SHALL add a CSS class (e.g., `drag-over`) to that container that produces a visually distinct border or background color different from the column's default style.
2. WHEN a task card being dragged leaves a KanbanColumn's card list area without being dropped, THE KanbanColumn SHALL remove the `drag-over` CSS class from that container, restoring its default appearance.
3. WHEN a task card being dragged enters the KanbanColumn that is its current source column, THE KanbanColumn SHALL apply the same `drag-over` CSS class as it would for any other column.

---

### Requirement 3: Status Change on Drop

**User Story:** As a user, I want to drop a task card into a different column to change its status, so that I can update task progress without opening any menus.

#### Acceptance Criteria

1. WHEN a drag is initiated on a TaskCard and the card is released over a KanbanColumn whose status value differs from the task's current status, THE KanbanBoard SHALL call the `changeStatus` function with the task's `id` and the target column's status value (`"todo"`, `"in_progress"`, or `"completed"`).
2. WHEN `changeStatus` is called, THE API SHALL send a `PUT /api/tasks/:id` request with the new status and return the updated task object with the persisted status value.
3. WHEN the API returns the updated task, THE KanbanBoard SHALL move the TaskCard to the target KanbanColumn and remove it from the source KanbanColumn so the card appears exactly once on the board.
4. WHEN a TaskCard is dropped onto the KanbanColumn it originated from, THE KanbanBoard SHALL make no API call and apply no status change.
5. WHEN a TaskCard is dropped onto a KanbanColumn and the API call fails, THE KanbanBoard SHALL keep the TaskCard in its source column and display an error message to the user.

---

### Requirement 4: Optimistic UI Update

**User Story:** As a user, I want the card to appear in the new column immediately after I drop it, so that the board feels responsive.

#### Acceptance Criteria

1. WHEN a TaskCard is dropped onto a different KanbanColumn, THE KanbanBoard SHALL update the task's status in the local task list to the target column's status before the API call completes, so the card visually moves to the target column without waiting for the server response.
2. IF the API call fails after an optimistic update, THEN THE KanbanBoard SHALL revert the task's status in the local task list to the status value it held immediately before the optimistic update was applied.
3. IF the API call fails after an optimistic update, THEN THE KanbanBoard SHALL display an error message visible to the user for at least 5 seconds indicating the status change could not be saved.
4. WHILE an API call for a status change is in-flight for a given task, THE KanbanBoard SHALL prevent additional drag-and-drop status changes for that same task until the in-flight call resolves.

---

### Requirement 5: Drag-and-Drop Accessibility

**User Story:** As a user who relies on keyboard navigation, I want to still be able to change task status without drag-and-drop, so that the board remains fully usable.

#### Acceptance Criteria

1. THE TaskCard SHALL preserve the existing status-change button ("▶ Start", "✔ Complete", "↩ Reopen") so that keyboard and non-pointer users can change status without dragging.
2. WHILE a TaskCard is rendered on the board, THE TaskCard's root element SHALL be announced by assistive technologies as a draggable item (e.g., via the appropriate HTML attribute or ARIA role) so screen reader users are aware it can be moved.
3. WHILE a drag operation is in progress, THE KanbanColumn's drop zone SHALL be announced by assistive technologies as a valid drop target so screen reader users can identify where the card may be placed.
4. WHEN a status-change button on a TaskCard receives keyboard focus, THE button SHALL have a visible focus indicator (e.g., outline or ring) so keyboard users can identify the focused element.

---

### Requirement 6: Drag Interaction with Existing Card Actions

**User Story:** As a user, I want clicking the edit, delete, and status-change buttons on a card to still work normally while drag-and-drop is enabled, so that existing workflows are not broken.

#### Acceptance Criteria

1. WHEN a user clicks (without dragging) a TaskCard's body area, THE TaskCard SHALL open the task detail modal displaying the task's full details.
2. WHEN a user clicks the edit button on a TaskCard, THE TaskCard SHALL open the task edit modal pre-populated with the task's current field values.
3. WHEN a user clicks the delete button on a TaskCard, THE TaskCard SHALL open the delete confirmation dialog for that task.
4. WHEN a user clicks the status-change button on a TaskCard, THE TaskCard SHALL invoke the existing `onStatusChange` handler with the task's `id` and the next status value, changing the task's status without requiring a drag operation.
5. IF a pointer moves 5px or more from its initial mousedown/touchstart position on a TaskCard action button (edit, delete, or status-change) before mouseup/touchend, THEN THE KanbanBoard SHALL not initiate a drag operation for that gesture.
6. WHEN drag-and-drop is enabled on a TaskCard, THE TaskCard's body area (excluding action buttons) SHALL remain draggable so users can still initiate a drag from the card body.
