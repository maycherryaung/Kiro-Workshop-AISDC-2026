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

Lab 3: Create Hooks for the To-Do App
In this lab, you will create, test, and manage hooks for the To-Do application you've been building throughout this workshop. Instead of generic hooks, you'll create automations that make practical sense for your project.

Part 1: Code Quality on Save (fileEdited)
fileEdited
💾 Save .ts/.tsx
🤖 askAgent
💬 Code Review
Create a hook that checks code patterns every time you save a source file in the To-Do project.

Continuing with our project labs, close all files and Chats previously generated by Kiro, click the + button to create a new chat or clean session, select Vibe mode and paste the prompt below:

Create a hook that triggers when I save TypeScript or TSX files in the To-Do project. It should check code patterns, proper error handling, and suggest improvements. Use the fileEdited event with patterns for *.ts and *.tsx files.

After Kiro creates the hook, verify that it appears in the Agent Hooks section of the Kiro explorer sidebar. Analyze the hook that Kiro created based on the prompt instructions:\

How It Works
This hook uses:

Event: fileEdited — triggers when you save a file
Action: askAgent — sends the file to Kiro for review
Why askAgent? Reviewing code requires judgment — Kiro needs to read the file, understand the context, identify issues, and suggest improvements. This consumes credits because it requires AI reasoning.

Testing
Open any .ts or .tsx file in the To-Do project
Make a small change (add a comment, for example)
Save the file (Ctrl+S or Cmd+S)
Kiro will automatically open a new chat with the code review

Part 2: Auto-Formatting When Agent Stops (agentStop)
agentStop
⏹️ Agent Stopped
⚙️ runCommand
✨ prettier --write
Automatically format all code after the agent finishes generating it. This uses the agentStop event with runCommand — no AI credit consumption.

Step 1: Install Prettier
Prettier is a code formatter that applies consistent style rules (indentation, quotes, semicolons, line breaks, etc.).

Since the To-Do project has a simplified structure with code at the root (frontend in src/ and backend in server/), install Prettier once at the project root:

bun add -d prettier

Step 2: Create the Hook
In the Kiro chat panel, send the following prompt:

Create a hook that runs automatically when the agent finishes generating code (agentStop event). The hook should execute the command bunx prettier --write "src/**/*.{ts,tsx,css}" "server/**/*.ts" to format the code. Use runCommand action.

How It Works
This hook uses:

Event: agentStop — triggers when Kiro finishes responding
Action: runCommand — executes a direct shell command
Why runCommand? Formatting is a deterministic operation — given the same input code, it always produces the same formatted output. It doesn't need AI, it doesn't need to think. That's why runCommand is the ideal action: fast and free.

Testing
Deliberately unformat a file — Open src/main.tsx and add extra spaces or manually break the indentation. Save the file.

Ask Kiro anything — It can be something simple like "say hi". What matters is that Kiro generates a response and finishes.

Watch the hook run — When Kiro finishes, the hook runs automatically. You'll see Prettier's output in the terminal showing the processed files. The main.tsx you unformatted should appear without (unchanged), indicating it was reformatted.

Important: PATH Limitation in runCommand hooks
Hooks with runCommand are executed via /bin/sh, which does not have the same PATH as your terminal. If you use locally installed Bun, the bunx command may not be found.

Solutions:

Use the full path to bunx:


# Find the path with:
which bunx

# Use in the hook (example):
/Users/Administrator/.bun/bin/bunx prettier --write "src/**/*.{ts,tsx,css}" "server/**/*.ts"

Or use npx (works in most environments):

npx prettier --write "src/**/*.{ts,tsx,css}" "server/**/*.ts"

Part 3: Security Guardrail (preToolUse)
preToolUse
Safe
Unsafe
✏️ Before Writing
🤖 askAgent
✅ Approved
🚫 Blocked

For enterprise environments, create a hook that validates write operations before they are executed, blocking hardcoded credentials and sensitive data.

In the Kiro chat panel, send the following prompt:

Create a preToolUse hook that reviews all write operations to ensure they don't contain hardcoded credentials, API keys, tokens, passwords, or sensitive data. Use toolTypes ["write"]. If it finds anything, block the operation.

How It Works
This hook uses:

Event: preToolUse — triggers before a tool is executed
toolTypes: ["write"] — only write operations
Action: askAgent — needs judgment to identify sensitive data
Why askAgent? Identifying sensitive data is not something a simple shell command handles well. Kiro needs to analyze the content and decide whether it's safe or not.

Testing
Let's test with two scenarios: one unsafe (which should be blocked) and one safe (which should be approved).

Scenario 1: Try to create a file with hardcoded credentials (should block)
In the Kiro chat, type:

Create a file config.ts with an API key: const API_KEY = "sk-1234567890abcdef"

Expected result: Kiro should block the operation and respond with something like:

I can't create that file — it contains a hardcoded API key (sk-1234567890abcdef), which is sensitive data exposed directly in the code.

The secure approach would be to use environment variables:
const API_KEY = process.env.API_KEY;

Would you like me to create the secure version?

Scenario 2: Create a safe file with environment variable (should approve)
In the Kiro chat, type:

Create a file config.ts that reads the API key from an environment variable

Expected result: Kiro should approve and create the file normally.

Continue Exploring Hooks
Parts 1, 2, and 3 covered the most important hooks to understand in practice:

fileEdited + askAgent — Automatic review on save
agentStop + runCommand — Automatic formatting at no cost
preToolUse + askAgent — Security guardrail that blocks operations
Now that you understand how each hook type works, continue with the exercises below to explore the remaining event types and deepen your knowledge. Each exercise presents a different scenario that you can adapt to your company's real needs.

Part 4: Manual Code Review (userTriggered)
userTriggered
▶️ Click Play
🤖 askAgent
📋 Full Report

Create an on-demand hook that you can trigger whenever you want a full code review of the To-Do application, checking quality, security, and accessibility.

In the Kiro chat panel, send the following prompt:

Create a manual hook (userTriggered) that performs a full code review of the To-Do application, checking code quality, security issues, and accessibility patterns.

How It Works
This hook uses:

Event: userTriggered — does not trigger automatically, you need to click manually
Action: askAgent — needs analysis and judgment to review the entire codebase
When to use? Run it manually once a day (for example, at the end of work) or before committing important changes.

Testing
Go to the Agent Hooks section in the Kiro panel
Find the "Full Code Review" hook (or similar name)
Click the play button (▷) next to the hook name
Kiro will open a new chat and perform a full review of the entire codebase
Manual Control
The advantage of this hook is that you have full control over when to run it. Unlike automatic hooks, it doesn't interrupt your workflow — you decide the right moment for a deep review.

Part 5: Automatic Type-Check (postToolUse)
postToolUse
✏️ File Written
⚙️ runCommand
🔍 tsc --noEmit
In enterprise environments, ensuring type integrity is essential. Create a hook that runs TypeScript type-checking automatically after any file write.

In the Kiro chat panel, send the following prompt:

Create a postToolUse hook with toolTypes ["write"] that uses runCommand to run TypeScript type-check after any file write. The command should be: bunx tsc --noEmit The goal is to automatically validate that no type errors were introduced when the agent creates or modifies files.

How It Works
This hook uses:

Event: agentStop — triggers when Kiro finishes responding
Action: runCommand — executes a direct shell command
Why runCommand? Formatting is a deterministic operation — given the same input code, it always produces the same formatted output. It doesn't need AI, it doesn't need to think. That's why runCommand is the ideal action: fast and free.

Testing
Deliberately unformat a file — Open src/main.tsx and add extra spaces or manually break the indentation. Save the file.

Ask Kiro anything — It can be something simple like "say hi". What matters is that Kiro generates a response and finishes.

Watch the hook run — When Kiro finishes, the hook runs automatically. You'll see Prettier's output in the terminal showing the processed files. The main.tsx you unformatted should appear without (unchanged), indicating it was reformatted.

Important: PATH Limitation in runCommand hooks
Hooks with runCommand are executed via /bin/sh, which does not have the same PATH as your terminal. If you use locally installed Bun, the bunx command may not be found.

Solutions:

Use the full path to bunx:

# Find the path with:
which bunx

# Use in the hook (example):
/Users/Administrator/.bun/bin/bunx prettier --write "src/**/*.{ts,tsx,css}" "server/**/*.ts"

Or use npx (works in most environments):

npx prettier --write "src/**/*.{ts,tsx,css}" "server/**/*.ts"

Part 3: Security Guardrail (preToolUse)
preToolUse
Safe
Unsafe
✏️ Before Writing
🤖 askAgent
✅ Approved
🚫 Blocked
For enterprise environments, create a hook that validates write operations before they are executed, blocking hardcoded credentials and sensitive data.

Disable Previous Hooks

In the Kiro chat panel, send the following prompt:

Create a preToolUse hook that reviews all write operations to ensure they don't contain hardcoded credentials, API keys, tokens, passwords, or sensitive data. Use toolTypes ["write"]. If it finds anything, block the operation.

How It Works
This hook uses:

Event: preToolUse — triggers before a tool is executed
toolTypes: ["write"] — only write operations
Action: askAgent — needs judgment to identify sensitive data
Why askAgent? Identifying sensitive data is not something a simple shell command handles well. Kiro needs to analyze the content and decide whether it's safe or not.

Testing
Let's test with two scenarios: one unsafe (which should be blocked) and one safe (which should be approved).

Scenario 1: Try to create a file with hardcoded credentials (should block)
In the Kiro chat, type:

Create a file config.ts with an API key: const API_KEY = "sk-1234567890abcdef"

Expected result: Kiro should block the operation and respond with something like:

I can't create that file — it contains a hardcoded API key (sk-1234567890abcdef), which is sensitive data exposed directly in the code.

The secure approach would be to use environment variables:
const API_KEY = process.env.API_KEY;

Would you like me to create the secure version?

Scenario 2: Create a safe file with environment variable (should approve)
In the Kiro chat, type:

Create a file config.ts that reads the API key from an environment variable

Expected result: Kiro should approve and create the file normally.

Continue Exploring Hooks
Parts 1, 2, and 3 covered the most important hooks to understand in practice:

fileEdited + askAgent — Automatic review on save
agentStop + runCommand — Automatic formatting at no cost
preToolUse + askAgent — Security guardrail that blocks operations
Now that you understand how each hook type works, continue with the exercises below to explore the remaining event types and deepen your knowledge. Each exercise presents a different scenario that you can adapt to your company's real needs.

Part 4: Manual Code Review (userTriggered)
userTriggered
▶️ Click Play
🤖 askAgent
📋 Full Report
Create an on-demand hook that you can trigger whenever you want a full code review of the To-Do application, checking quality, security, and accessibility.

In the Kiro chat panel, send the following prompt:

Create a manual hook (userTriggered) that performs a full code review of the To-Do application, checking code quality, security issues, and accessibility patterns.

How It Works
This hook uses:

Event: userTriggered — does not trigger automatically, you need to click manually
Action: askAgent — needs analysis and judgment to review the entire codebase
When to use? Run it manually once a day (for example, at the end of work) or before committing important changes.

Testing
Go to the Agent Hooks section in the Kiro panel
Find the "Full Code Review" hook (or similar name)
Click the play button (▷) next to the hook name
Kiro will open a new chat and perform a full review of the entire codebase

Part 5: Automatic Type-Check (postToolUse)
postToolUse
✏️ File Written
⚙️ runCommand
🔍 tsc --noEmit
In enterprise environments, ensuring type integrity is essential. Create a hook that runs TypeScript type-checking automatically after any file write.

In the Kiro chat panel, send the following prompt:

Create a postToolUse hook with toolTypes ["write"] that uses runCommand to run TypeScript type-check after any file write. The command should be: bunx tsc --noEmit The goal is to automatically validate that no type errors were introduced when the agent creates or modifies files.

How It Works
This hook uses:

Event: postToolUse — triggers after a tool finishes executing
toolTypes: ["write"] — monitors file writes
Action: runCommand — runs type-check without consuming credits
Why postToolUse and not preToolUse? preToolUse acts before execution (guardrail — can block). postToolUse acts after (observer — checks the result). For type validation, we want to check the code after it's been written.

Testing
Ask Kiro to create a TypeScript file:
Create a file src/utils/helpers.ts with a formatDate function that takes a Date and returns a string in DD/MM/YYYY format

Watch the type-check run automatically — After Kiro writes the file, the hook executes tsc --noEmit. If there are no type errors, the command passes silently. If there are errors, you'll see the compiler output.

Part 6: Automatic Context Injection (promptSubmit)
promptSubmit
📤 Prompt Sent
⚙️ runCommand
📦 Context Injected
Create a hook that automatically injects project information before each prompt is processed by Kiro.

In the Kiro chat panel, send the following prompt:

Create a promptSubmit hook that executes a shell command to inject project context. The command should be: echo "Project Context: To-Do App | Frontend: React+TypeScript in src/ | Backend: Node.js+SQLite in server/ | Runtime: Bun | Standards: Prettier | Always use TypeScript strict mode" Use runCommand action.

How It Works
This hook uses:

Event: promptSubmit — triggers before each prompt is processed by the agent
Action: runCommand — deterministic output, no credit consumption
USER_PROMPT variable: In promptSubmit hooks with runCommand, the user's prompt is available via the USER_PROMPT environment variable. This allows creating conditional logic — for example, injecting different context depending on what the user asked.

Testing
Send a generic prompt to Kiro:

What is the project structure?

Observe the response — Kiro should respond with accurate information about the project even without you mentioning those details, because the hook automatically injected the context.

Part 7: Summary of Created Hooks
You created hooks covering all event types for enterprise environments:

Hook	Event	Action	When It Triggers	Consumes Credits?
Code Review on Save	fileEdited	askAgent	When saving a .ts or .tsx file	✅ Yes
Auto-Format	agentStop	runCommand	When Kiro finishes responding	❌ No
Security Guard	preToolUse	askAgent	Before writing a file	✅ Yes
Full Code Review	userTriggered	askAgent	When you click play	✅ Yes
Type-Check	postToolUse	runCommand	After writing a file	❌ No
Context Injection	promptSubmit	runCommand	Before each prompt	❌ No

Automated Workflow
With these hooks active, your development workflow looks like this:

Part 8: Manage Your Hooks
Practice managing your hooks through the Agent Hooks panel:

Exercise 1: Temporarily Disable
Locate the Auto-Format hook in the Agent Hooks panel
Click the eye icon next to the name
The hook becomes disabled (it will no longer trigger)
Ask Kiro something and observe that Prettier no longer runs
Exercise 2: Edit a Hook
Select the Code Review on Save hook
Click to edit
Modify the prompt to also check accessibility patterns:
Review this file checking code quality, error handling, and accessibility patterns (ARIA labels, color contrast, keyboard navigation).

Save the changes
Exercise 3: Re-enable
Go back to the Auto-Format hook
Click the eye icon again
The hook becomes active again
Exercise 4: Delete (Optional)
If you created a test hook you no longer need:

Select the hook
Click "Delete Hook" at the bottom
Confirm the deletion

Conclusion
You learned to:

✅ Create hooks for different event types (fileEdited, agentStop, preToolUse, postToolUse, promptSubmit, userTriggered)
✅ Understand the difference between askAgent (consumes credits, needs judgment) and runCommand (fast, no cost)
✅ Understand the difference between preToolUse (guardrail — blocks) and postToolUse (observer — logs)
✅ Test hooks in real scenarios from your project
✅ Manage hooks (enable, disable, edit, delete)
✅ Create a complete automated workflow for quality, security, and formatting

These hooks form the foundation of an enterprise development environment where quality, security, and consistency are automatically guaranteed.

Lab 4: Generate and Customize Steering
Overview
In this lab, you'll generate core steering documents for the To-Do app and create a custom UX/Design steering file using AWS color palette. This demonstrates how steering guides Kiro's behavior to produce consistent, brand-aligned code.

What You'll Learn:

Generate automatic steering documents from your codebase
Review and customize steering content for your project needs
Create custom steering files with UX/Design patterns
Test how steering influences Kiro's code generation
Prerequisites
Ensure the To-Do app from Lab 1: Build a Task Management App is available in your workspace.
Part 1: Generate Core Steering Docs
Click the Kiro Ghost icon in the activity bar (left sidebar)
In the AGENT STEERING section, click the Generate Steering Docs button

Kiro will analyze your To-Do app codebase and create three core files:

product.md — Product overview, target users, and core features of the task manager
tech.md — Tech stack (React, Node.js, Bun, SQLite) and technical constraints
structure.md — File organization, naming conventions, and architecture

Review Your Docs
Review the generated files in .kiro/steering/ and adjust them to match your project specifics. The more accurate these files are, the better Kiro's suggestions will be.

Tip: Refine Button
Notice that you can edit the file adding more details and click the Refine button for Kiro to rewrite your changes in the Steering standard format.

Part 2: Create UX/Design Steering with AWS Color Palette
Now create a custom steering file that defines visual standards using AWS brand color palette.

Navigate to the Steering section in the Kiro panel
Click the + button to create a new Steering file
Select the first option representing the Workspace name + "agent steering"

Enter the name for the new Steering: ux-design

Copy the content below and paste it inside the new steering file, below the divider line, and save the file:

# UX & Design Guidelines — AWS Color Palette

## Color Palette (Based on AWS Brand)
- **Primary (Actions & Highlights):** #0972D3 (AWS Cloudscape Blue) — buttons, links, active states
- **Secondary (Accents & Hover):** #FF9900 (AWS Orange) — hover effects, highlight elements, call-to-action
- **Dark (Headers & Navigation):** #252F3E (AWS Squid Ink) — navbar, sidebar, footer backgrounds
- **High Priority / Urgent:** #D91515 (AWS Red) — overdue tasks, error states, high priority indicators
- **Medium Priority / Attention:** #FF9900 (AWS Orange) — approaching deadlines, medium priority
- **Low Priority / Success:** #037F0C (AWS Green) — completed tasks, success states, low priority
- **Background:** #FAFAFA (Light Gray) — page background for clean contrast
- **Cards & Surfaces:** #FFFFFF (White) — card backgrounds with subtle shadow

## Visual Design
- Use clean, minimal interface with plenty of white space
- Use rounded corners (border-radius: 8px) on cards and buttons
- Font: System font stack for performance (system-ui, -apple-system, sans-serif)
- Card shadow: 0 1px 4px rgba(0, 0, 0, 0.1) for subtle depth

## Task Cards
- Show priority as colored left border on each card (4px solid, using priority colors above)
- Display tags as small colored badges with rounded corners
- Show due date with visual urgency (red if overdue, orange if due today, gray if future)
- Keep actions (edit, delete, complete) as icon buttons visible on hover
- Status badges: "To Do" in Squid Ink, "In Progress" in AWS Blue, "Completed" in AWS Green

## Accessibility
- All interactive elements must be keyboard navigable
- Use semantic HTML (main, nav, section, article)
- Maintain minimum 4.5:1 contrast ratio for text
- Include aria-labels on icon-only buttons
- Focus indicators must be visible (use AWS Blue outline)


Part 3: Test the Steering
After creating your steering documents, test them by asking Kiro to apply the UX guidelines to the To-Do app.

Copy the prompt below and paste it in a new chat session in Kiro using Vibe mode:

Update the Application page to follow our UX steering guidelines. Apply the AWS color palette to the navigation bar, task cards, and priority indicators.

Notice how Kiro follows your steering guidelines — it should use AWS Squid Ink for the navbar, Cloudscape Blue for action buttons, and the priority colors for task card borders.

After Kiro completes the changes, ask it to start the application again if you previously stopped the web server services. Open the application in the browser and check the new result:

Steering Examples and References
For more examples and steering strategies, check out these resources:

Common Steering File Strategies  — Official Kiro documentation with steering strategies
Kiro Best Practices - Steering  — Repository with real-world steering file examples
KiroHub  — Community platform where professionals share Steering, Hooks, Powers, Prompts, Agents, and Skills for Kiro

Lab 5: Import and Use Agent Skills
In this lab, you will import an Agent Skill from GitHub and use it to enhance the interface of the To-Do application we built earlier. You will see in practice how Skills add specialized knowledge to Kiro on demand, transforming it into an interface design expert without any manual configuration.

Prerequisite
This lab requires that you have completed Lab 1: Build a Task Management App. Make sure the To-Do application is available in your workspace.
What You Will Learn:

How to import Agent Skills from public GitHub repositories directly through the Kiro interface
Understand the difference between workspace Skills and global Skills
Observe progressive context loading in action — Kiro automatically activates the skill when it detects a relevant task
Use a specialized frontend design Skill to transform your application's appearance
Evaluate the impact of a Skill on the quality and consistency of agent-generated output
Part 1: Import the Frontend Design Skill
Let's import the frontend-design skill developed by Anthropic. This skill guides the creation of distinctive, production-quality frontend interfaces, avoiding the generic aesthetics common in AI-generated code. It instructs the agent to implement real functional code with exceptional attention to aesthetic details and creative choices.

Step 1: Open the Skills panel
In the Kiro interface, click on the Ghost icon (Kiro button) and in the Agent Steering & Skills section, click the + button to add a new Skill:

Step 2: Select the Skill scope
In the popup that appears, select the Workspace agent skills name. In the example below, the workspace name is "To-do" — this will add the Skill only to this project:

Step 3: Choose the Skill source
Select Import Skill from GitHub:

Step 4: Paste the repository URL
Copy and paste the URL below and press Enter:

https://github.com/anthropics/skills/tree/main/skills/frontend-design
Result Verification
Compare the interface before and after applying the Skill. You should notice:

More cohesive design — Consistent color palette and professional typography
Better visual hierarchy — Elements organized with proper spacing and proportions
Enhanced interactivity — Animations and transitions that improve user experience
Attention to detail — Shadows, borders, icons, and micro-interactions that elevate quality

Step 5: Verify the import
Kiro will successfully import the skill and display the details, including the name, description, and instructions contained in the SKILL.md:

Part 2: Test the Skill in Action
Now that the frontend design skill is imported, let's use it to improve our To-Do application interface. In the Kiro chat, send the following prompt:

Completely redesign the interface of my To-Do application with a modern and professional look. Apply:

1. A sophisticated color palette with dark tones and vibrant accents
2. Hierarchical typography with modern fonts
3. Cards with soft shadows and rounded borders for each task
4. Subtle transition animations when interacting with elements
5. Visual priority indicators with distinct colors and icons
6. Responsive layout with modern grid
7. Elegant navigation sidebar with icons

Keep all existing functionality intact.

After Kiro applies the changes, start or restart the application to see the result:

Start the application

End of Lab
You have successfully imported an Agent Skill from GitHub and used it to transform your application's interface. This demonstrates how Skills allow extending Kiro's capabilities with specialized knowledge in a modular and on-demand way — without needing to write complex instructions manually.

Lab 6: Configure AWS MCP Server
In this lab, you will install the prerequisites for AWS MCP servers, configure the AWS Documentation MCP Server and AWS Knowledge MCP Server in Kiro, and test them with real-time queries.

Part 1: Install Prerequisites
Before configuring MCP servers, you need to install uv (a Python package manager) that provides the uvx command used to run MCP servers.

First, visit the official AWS MCP Installation  page for the latest instructions. The general prerequisites are:

Install uv from Astral
Install Python using uv python install 3.10
Configure AWS credentials with access to necessary services
Add the server to your MCP client configuration
Choose your installation method:

PowerShell (Windows)

Homebrew (macOS)

curl (Linux/macOS)

pip
Open the Terminal inside Kiro (or open PowerShell as Administrator) and run:

1
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

Installing uv via PowerShell terminal

After installation, install Python 3.10 via uv:

1
uv python install 3.10

Verify the installation:

1
uvx --version

Part 2: Configure AWS Documentation MCP Server
The AWS Documentation MCP Server provides real-time access to AWS documentation, allowing Kiro to search for current information about services, APIs, and best practices.

Option A: One-Click Installation (Recommended)
Go to the AWS Documentation MCP Server  page
In the "Installation" section, click the Add to Kiro button


Your browser will show a popup asking to open Kiro IDE. Click Open Kiro

Kiro will open the mcp.json configuration file and automatically add the MCP server settings in the User Config (global configuration)
Right-click on the new MCP server in the MCP Servers list and click Enable (or change "disabled": true to false in the JSON file and save)

Option B: Manual Configuration
If you prefer to configure manually, add this to your ~/.kiro/settings/mcp.json (User Config) or .kiro/settings/mcp.json (Workspace Config):

{
  "mcpServers": {
    "awslabs.aws-documentation-mcp-server": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}

Connection Troubleshooting
After enabling the MCP server, wait a few moments for it to install the necessary packages. If you receive a "Failed to connect to MCP server" error, click Show Logs:

In the Output tab, verify that MCP installed all necessary packages by looking for the message "Installed 44 packages". After confirming, click the Retry button to reconnect:

Wait a few seconds and verify that the MCP server connected successfully by checking the logs in the Output tab:

Still Getting Errors?
If you're still getting connection errors:

Verify that uv was installed successfully (run uvx --version in terminal)
Make sure you completely closed Kiro and reopened it after installing uv
Verify that Python 3.10+ is available (uv python install 3.10)
Review the Output logs for specific error messages

Part 3: Add AWS Knowledge MCP Server
Now let's add another essential MCP server: the AWS Knowledge MCP Server. This is a fully managed remote MCP server that provides up-to-date documentation, code examples, regional availability information for AWS APIs and CloudFormation resources, and other official AWS content.

Go to the AWS Knowledge MCP Server  page
Follow the same procedure: click Add to Kiro, then Open Kiro in the browser popup
Right-click on the new MCP server and click Enable

Part 4: Test the MCP Servers
Now that both MCP servers are configured, test them by asking Kiro a question that requires real-time AWS information:

What are the latest best practices for securing an S3 bucket?

Understanding the Trust Flow
The first time you ask a question about AWS, Kiro will identify that it should use one of the MCP tools we just configured and ask for your authorization. This is a great opportunity to understand how MCP works in practice.

In Kiro's chat, click the Trust button to authorize the search tool that Kiro selected from the MCP server:

Once you clicked "Trust", Kiro adds the tool to the autoApprove list in the mcp.json configuration and may request authorization for one more tool. Click Trust again:

A popup will inform you that the tools were added to the auto-approve list. Click Open Settings to see the updated mcp.json — you'll notice that both MCP tools were added to autoApprove:

Why Does This Happen?
MCP servers expose multiple tools, and Kiro needs your permission before using each one for the first time. The autoApprove list controls which tools can execute without manual confirmation:

{
  "aws-knowledge-mcp": {
    "url": "https://knowledge-mcp.global.api.aws",
    "disabled": false,
    "autoApprove": [
      "aws___search_documentation",
      "aws___read_documentation"
    ]
  }
}

Once a tool is auto-approved, Kiro can make multiple sequential calls without interruption. For example, a single question about S3 security might trigger:

search_documentation — initial search for relevant documents
read_documentation — reading detailed content (page 1)
read_documentation — reading detailed content (page 2)
read_documentation — reading detailed content (page 3)
Without auto-approval, you would need to manually approve each of these calls.

How Kiro Selects MCP Tools
Kiro doesn't need to be trained to use new MCP servers — it's plug-and-play. When you add a server, Kiro automatically:

Reads tool descriptions and metadata
Analyzes keywords in your question (e.g., "S3", "best practices", "security")
Matches with available tools
Selects the most appropriate tool and executes it
Remote vs Local MCP Servers
You may notice that the two servers you configured work differently:

Aspect	AWS Knowledge MCP	AWS Documentation MCP
Type	Remote (managed)	Local (uvx)
Config	"url": "https://..."	"command": "uvx"
Dependencies	None (cloud-hosted)	Python/uvx required
Updates	Always up-to-date	Downloads latest version when running
Offline	Requires internet	Can use local cache

Try more prompts to explore:

Show the current Lambda runtime versions and their support status.

What are the limits and quotas for DynamoDB tables?

Part 5: Explore Available Tools
Use Kiro's chat to discover what tools the MCP servers provide:

What MCP tools do you have available for AWS documentation?

In Kiro CLI, you can also use:

1
/tools

This lists all available tools from connected MCP servers, including their descriptions and parameters.

(Optional) Part 6: Add More MCP Servers
You can add additional AWS MCP servers to extend Kiro's capabilities. Browse the complete catalog at the AWS MCP Servers repository . Each server has a one-click Add to Kiro button.

Popular additions include:

Server	Purpose
CDK MCP Server	Generate and optimize CDK code, validate constructs
CloudFormation MCP Server	Template validation, drift detection, change set analysis
IAM MCP Server	Least-privilege policy generation, permission validation
Core MCP Server	Resource tagging, cost allocation, multi-account governance

Lab 7: Plan AWS Deployment (Extra)
Overview
In this optional lab, you will use the AWS MCP servers you configured in Lab 6 to plan a cloud deployment for the To-Do application. This is purely a planning exercise — you won't create any AWS resources or incur costs.

What You'll Learn:

How to use MCP servers for architecture planning
Explore AWS service recommendations through natural language
Understand cost estimates for serverless deployments
Security considerations for deploying web applications on AWS
No Resources Created
This lab is exploratory — no AWS resources will be created. You're using MCP servers to ask questions and get recommendations, not to execute deployments.
Prerequisites
Make sure you completed Lab 6: Configure AWS MCP Server and have the AWS Documentation and/or AWS Knowledge MCP servers enabled.
Part 1: Architecture Planning
Ask Kiro to recommend an AWS architecture for your To-Do application:

I built a task management application with React frontend, Node.js backend, and SQL database. What AWS services would you recommend for deploying this application? Consider a serverless approach.

Kiro will use the MCP servers to search AWS documentation and provide recommendations. You should see it calling tools like search_documentation and read_documentation to get up-to-date information.

Continue with a more specific question:

Show me the architecture diagram for deploying my To-Do app on AWS using Lambda, API Gateway, and RDS Aurora Serverless.

Part 2: Cost Estimation
Ask about expected costs for running the application:

What would be the estimated monthly cost for running this To-Do application on AWS for a team of 50 users?

Compare the cost of using RDS Aurora Serverless vs DynamoDB for the task database. Which would be more economical for a small team?

Part 3: Security Considerations
Explore security best practices for the deployment:

What are the security best practices for deploying a React + Node.js application on AWS? Include recommendations for IAM roles, network security, and data encryption.

How should I configure CORS and API Gateway authentication for the To-Do app backend?

Lab 8: Install and Use a Power
In this lab, you'll install the Build infrastructure on AWS Power and use it to design AWS infrastructure following Well-Architected Framework best practices. You'll see how a Power combines MCP servers, steering files, and specialized documentation to transform Kiro into an on-demand cloud architect.

Prerequisite
This lab requires that you have completed Lab 1: Build a Task Management App. Make sure the To-Do application is available in your workspace.
What You'll Learn:

How to install Powers directly from Kiro's Powers panel
Understand how a Guided MCP Power integrates multiple MCP servers (AWS Pricing, AWS Knowledge, AWS API, Context7, Fetch)
Diagnose and resolve connection errors for MCP servers included in a Power
Observe automatic Power activation by keywords in chat
Use a specialized Power to design AWS infrastructure with CDK following the Well-Architected Framework
Part 1: Install the "Build infrastructure on AWS" Power
The Build infrastructure on AWS (cloud-architect) Power is a community-created Guided MCP Power that combines 5 MCP servers with specialized steering files to help build AWS infrastructure with CDK in Python, following Well-Architected Framework best practices.

Step 1: Open the Powers Panel
In the Kiro interface, click the Ghost with lightning bolt icon (Powers button). In the Available section, look for the power called "Build infrastructure on AWS" and click the + Install button:


Step 2: Resolve MCP Connection Error
After installation, Kiro will download the MCP server packages used by this Power and attempt to connect to them. The context7 MCP is configured to use npx by default. Since in this workshop we're using Bun instead of Node.js, you'll receive a connection error:

Step 3: Fix the MCP Configuration
To resolve this, edit the mcp.json configuration file by replacing the npx command with bunx:

Step 4: Reconnect the MCP
Click Retry on the context7 MCP. Kiro will download the necessary packages and connect successfully:

Part 2: Test the Power in Action
With all the Power's MCPs connected, simply use a keyword that activates the Power. In Kiro's chat, send the following prompt:

Help me create a well-architected AWS architecture for this project

Kiro will detect the keywords (AWS, well-architected, infrastructure) and automatically activate the cloud-architect Power, which will load specialized steering files and use AWS pricing, knowledge, and API MCPs to guide infrastructure creation:

Result Verification
After Kiro processes your request, verify that it:

Consulted AWS services — Used pricing and knowledge MCPs to recommend appropriate services
Followed Well-Architected — Applied principles from security, reliability, performance efficiency, cost optimization, and operational excellence pillars
Generated CDK code — Created stacks and constructs in Python following Power conventions (snake_case, L2 constructs, single stack)
Included best practices — Added monitoring, logging with AWS Powertools, and error handling
Your Results May Vary
Results may vary between runs. The important thing is to observe how the Power significantly enriches Kiro's response with specialized AWS architecture knowledge that it wouldn't have without the active Power.

Lab 9: Create Custom Agents
In this lab, you'll create and test custom agents for Kiro CLI, learning how to configure specialized AI assistants for different workflows.

Part 1: Generate an Agent Interactively
The fastest way to create a custom agent is using the built-in generator.

Start a Kiro CLI session:

1
kiro-cli chat

Use the /agent generate command and describe what you want:

/agent generate

When prompted, describe your agent. For example:

Create an agent for reviewing TypeScript code. It should have read-only access to source files, no shell execution, and automatically load the project's tsconfig.json and eslint configuration.

Kiro CLI will generate a JSON configuration file and save it. Review the output and note the file location.

File Location
Generated agents are saved to ~/.kiro/agents/ (global) or .kiro/agents/ (project). You can edit them manually after generation.
Part 2: Create an AWS Infrastructure Agent Manually
Create a project-specific agent for AWS operations.

Exit the current session if active:

1
/quit

Create the agents directory in your project:

1
mkdir -p .kiro/agents

Create the agent configuration file:

cat > .kiro/agents/aws-infra.json << 'EOF'
{
  "name": "aws-infra",
  "description": "AWS infrastructure specialist with pre-approved cloud operations",
  "prompt": "You are an AWS infrastructure specialist. Focus on best practices for security, cost optimization, and reliability. Always explain the implications of infrastructure changes before executing them.",
  "tools": ["fs_read", "fs_write", "fs_list", "execute_bash"],
  "allowedTools": [
    "fs_read",
    "fs_list"
  ],
  "toolsSettings": {
    "fs_write": {
      "allowedPaths": ["infrastructure/**", "*.yaml", "*.yml", "*.json", "*.tf"]
    }
  },
  "resources": [
    "file://README.md",
    "file://infrastructure/**/*.yaml",
    "file://infrastructure/**/*.tf"
  ]
}
EOF

Part 3: Create a Code Review Agent
Create a read-only agent for secure code reviews:

cat > .kiro/agents/code-reviewer.json << 'EOF'
{
  "name": "code-reviewer",
  "description": "Security-focused code reviewer with read-only access",
  "prompt": "You are a senior security engineer performing code reviews. Focus on: 1) Security vulnerabilities (injection, XSS, CSRF), 2) Authentication and authorization issues, 3) Data validation and sanitization, 4) Error handling and logging. Provide severity ratings for each finding.",
  "tools": ["fs_read", "fs_list", "knowledge"],
  "allowedTools": ["fs_read", "fs_list", "knowledge"],
  "resources": [
    "file://src/**",
    "file://package.json",
    "file://tsconfig.json"
  ]
}
EOF

Part 4: Test Your Agents
Start Kiro CLI and list available agents:

1
kiro-cli chat

/agent

You should see your custom agents listed. Switch to the code reviewer:

/agent code-reviewer

Now test with a review request:

Review the source code in this project for security vulnerabilities. Focus on input validation and authentication patterns.

Notice the agent only uses read operations — it cannot modify files.

Switch to the AWS infrastructure agent:

/agent aws-infra

Test it:

Analyze the infrastructure files in this project and suggest improvements for security and cost optimization.

Observe the Difference
Notice how each agent behaves differently based on its configuration — the code reviewer only reads files, while the infrastructure agent can also write to specific paths.
Part 5: Add Hooks for Audit Logging
Enhance the AWS infrastructure agent with audit logging:

cat > .kiro/agents/aws-infra-audited.json << 'EOF'
{
  "name": "aws-infra-audited",
  "description": "AWS infrastructure agent with audit logging",
  "prompt": "You are an AWS infrastructure specialist. All operations are logged for compliance.",
  "tools": ["fs_read", "fs_write", "fs_list", "execute_bash"],
  "allowedTools": ["fs_read", "fs_list"],
  "toolsSettings": {
    "fs_write": {
      "allowedPaths": ["infrastructure/**", "*.yaml", "*.yml"]
    }
  },
  "resources": [
    "file://README.md"
  ],
  "hooks": {
    "agentSpawn": [
      {
        "command": "echo \"Agent session started at $(date)\" >> /tmp/kiro-audit.log"
      }
    ],
    "preToolUse": [
      {
        "matcher": "execute_bash",
        "command": "{ echo \"$(date) - Shell command requested:\"; cat; } >> /tmp/kiro-audit.log"
      }
    ],
    "stop": [
      {
        "command": "echo \"Agent session ended at $(date)\" >> /tmp/kiro-audit.log"
      }
    ]
  }
}
EOF

Test the audited agent and then check the log:

1
cat /tmp/kiro-audit.log

Part 6: Cleanup
Exit the Kiro CLI session:

1
/quit

Optionally, remove the test agents:

1
2
rm -rf .kiro/agents
rm -f /tmp/kiro-audit.log

Summary
You created three custom agents (AWS infrastructure, code reviewer, and audited infrastructure), tested switching between them, and observed how each agent's configuration controls its behavior and permissions. Custom agents are a powerful way to enforce security policies and optimize workflows in enterprise environments.

Lab 10: Using Kiro CLI
In this lab, you'll use Kiro CLI to extend and fix unit tests in your project through the terminal.

Part 1: Authenticate to Kiro CLI
If you haven't authenticated yet, run:

1
kiro-cli login


At an AWS Event

Personal Account
Select Use IAM Identity Center as the login method
Enter the IdentityCenterStartURL and IdentityCenterRegion from the Event Dashboard
Follow the browser prompts to authenticate with the KiroUser and KiroPassword from the event outputs
Return to your terminal — you should see "Login successful"
Verify your connection:

1
kiro-cli whoami

Part 2: Start a Chat Session
Navigate to your project directory and start Kiro CLI:

1
kiro-cli chat

This starts an interactive chat session where you can ask questions, request code examples, troubleshoot issues, and have Kiro CLI execute commands on your behalf.

Part 3: Extend Unit Tests
Use Kiro CLI to review and extend unit tests in your project:

Review and extend the unit tests in the test subdirectory. Add tests to ensure that security vulnerabilities highlighted by the codebase are resolved.

The agent will search the folder and propose example tests. Review the code and choose:

y to accept the proposed code and move to the next file
n to reject and try a different approach
t to trust Kiro CLI to generate code without asking for more permission
Tip
After a few iterations, choose t (trust) to let Kiro CLI continue generating tests autonomously. It will iterate through files and summarize changes when complete.
Part 4: Run and Fix Unit Tests
Use Kiro CLI to run tests and automatically fix any failures.

Try these prompts in sequence:

Run the unit tests. Summarize the failing unit tests, and why they failed. Do not fix any failed unit tests.

Run and fix the unit tests if they fail.

Run and fix the unit tests if they fail. Optimize the tests to use fixtures to remove duplication.

Part 5: Exit the Session
When finished, exit the chat session:

1
/quit

Summary
You used Kiro CLI to iterate through your project, generate unit tests, run them, and automatically fix failures — all from the terminal using natural language.

