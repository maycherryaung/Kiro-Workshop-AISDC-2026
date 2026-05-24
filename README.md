# Kiro-Workshop-AISDC-2026
This workshop was called AWS Technical Hands-On Workshop AI-Driven Development with Kiro – Build Faster, Ship Smarter. 
It was given on AISDC 2026. 
It focused on the following learning objectives: 
* Hands-on use of AWS’s agentic IDE (Kiro) 
* Learn the AI-Driven Development Life Cycle (AIDLC)  Official Open 
* Understand how AI supports AWS cloud service code generation


Lab 1: Build a Task Management App
Overview
In this lab, you'll use Kiro's Vibe Coding to rapidly build a complete task management (To-Do) application through natural language prompts. This exercise demonstrates how Kiro can accelerate development from concept to working application in minutes rather than hours or days.

What You'll Build:

A task management web application with 3-tier architecture
React-based frontend with responsive Kanban-style UI
Node.js backend with RESTful APIs and business logic
Native Bun SQLite database (bun:sqlite) with local persistence
Complete task workflows including creation, status updates, and deletion
What You'll Learn:

How to craft effective prompts for complex application development
Understanding Kiro's code generation and scaffolding capabilities
Testing and validating AI-generated applications
Troubleshooting common full-stack development issues
Iterating and refining applications through conversational development
Let's Vibe!
In Kiro's chat panel, choose Vibe and send the prompt below:

Build a task management (To-Do) web application with the following structure:

Interface (Single Page + Modals)

Dashboard with:
- Task list organized by status (To Do, In Progress, Completed) in Kanban-style columns
- 10 pre-loaded sample tasks
- Emoji for categories and visual priority indicators (High 🔴, Medium 🟡, Low 🟢)
- Task counter by status (completed vs. pending)
- "New Task" button visible at the top
- Each task card displays: title, category, priority, due date, and action buttons (edit, delete, change status)

Task Creation/Edit Modal:
- Fields: title, description, priority (High/Medium/Low), category, due date
- Reused for both creating and editing

Task Details Modal (on card click):
- Full description, due date, priority, category
- Button to mark as completed
- Button to delete (with confirmation dialog)
- Notes/comments section with field to add new ones and list of sample comments

Deletion confirmation via dialog before removing any task.

Architecture (3 Tiers)

- Frontend: React with functional forms for full CRUD
- Backend: Node.js with REST API (endpoints to create, read, update, and delete tasks and comments)
- Database: Bun's native SQLite (bun:sqlite) — no external database dependencies, with tables for tasks, categories, priorities, and comments

Runtime

Use Bun as the runtime and package manager throughout the project, leveraging the built-in SQLite (bun:sqlite) for local persistence without needing an external database server.

When Vibe Coding finishes, send the prompt below to start the application:

Start the application

Testing the Application
With your To-Do app running, test the core functionality:

Navigate the Kanban Dashboard — Verify tasks are organized in columns by status (To Do, In Progress, Completed) with emoji priority indicators
Create a New Task — Click the "New Task" button at the top and fill in the modal with title, description, priority, category, and due date
View Task Details — Click on a task card to open the details modal with full description, notes, and comments
Edit a Task — Use the edit button on the card to open the edit modal and modify the fields
Change Status — Use the action buttons on the card to move the task between status columns
Mark as Completed — Use the complete button in the task details modal
Delete a Task — Test the removal functionality and verify the confirmation dialog appears before deletion
Add a Comment — In the details modal, add a new comment in the notes/comments section 


Lab 2: Add Drag and Drop to Kanban
In this lab, you'll use Spec-Driven Development to plan and implement drag and drop functionality on the Kanban dashboard of the To-Do application you built in Lab 1.

Objective
Create a complete Spec to plan and implement drag and drop on task cards, demonstrating how Kiro generates detailed specifications even from a simple prompt. You'll see how the Spec flow automatically structures requirements, design, and tasks — and how the AI-DLC methodology enables collaborative review with teams at each stage.

Prerequisites
Make sure the To-Do application from Lab 1: Build a Task Management App is available in your workspace. It doesn't need to be running — Kiro will work directly on the code.
Step 1: Open a New Spec Session
In Kiro's chat panel, open a new session, select Spec mode and paste the prompt below:

Add drag and drop functionality to the task cards on the Kanban dashboard to change status

Step 2: Select Build a Feature
Keep the Build a Feature option selected and click Submit Answer:

Step 3: Start with Requirements
Keep the option to start with Requirements and click Submit Answer:

Step 4: Review Requirements
Now is the time to review the requirements with all team stakeholders following the AI-DLC methodology. At this point you can refine the requirements by providing guidance to Kiro as teams request changes.

Kiro generates requirements including:

Functional requirements (dragging cards between columns, status updates)
Non-functional requirements (performance, visual feedback, accessibility)
Edge cases (cancelled drag, simultaneous drags)
Once all requirements are approved by the teams, click Continue to advance to Generate Design:

Step 5: Review the Design
Review the entire Design plan that Kiro generated. To better visualize the diagrams and topologies that Kiro may have suggested, click the Open Preview button:
The design may include:

Component structure for drag and drop (drag handles, drop zones, placeholders)
Status update logic when dropping a card in another column
Visual feedback during drag (shadow, destination column highlight)
Integration with existing Kanban components
Once reviewed and approved by the teams, click Continue to advance to Generate Tasks:

Step 6: Execute Tasks
Review the generated tasks — some are marked as required and others as optional. You can mark optional tasks as required if you want to include them in the implementation.

Click Run All Tasks and choose:

Run Required Tasks — to execute only the required tasks
Run Required and Optional Tasks — to execute all tasks

Step 7: Test the Feature
Once Kiro finishes the tasks, start the application (if not already running):

Start the application

Navigate to the application, refresh the page, and test dragging a task between the Kanban columns to change its status:

Test the following scenarios:

Drag between columns — Drag a card from "To Do" to "In Progress" and verify the status updates
Visual feedback — Observe if there's visual indication during the drag (shadow, destination column highlight)
Persistence — Refresh the page and confirm the task remains in the new column
Multiple moves — Move tasks between all columns (To Do ↔ In Progress ↔ Completed) 
