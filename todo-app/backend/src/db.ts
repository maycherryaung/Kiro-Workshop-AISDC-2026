import { Database } from "bun:sqlite";

const db = new Database("tasks.db", { create: true });

// Enable WAL mode for better performance
db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA foreign_keys = ON;");

// ── Schema ────────────────────────────────────────────────────────────────────

db.run(`
  CREATE TABLE IF NOT EXISTS priorities (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL UNIQUE,
    icon TEXT    NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS categories (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL UNIQUE,
    emoji TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    status      TEXT    NOT NULL DEFAULT 'todo'
                        CHECK(status IN ('todo','in_progress','completed')),
    priority_id INTEGER NOT NULL REFERENCES priorities(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    due_date    TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS comments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id    INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    body       TEXT    NOT NULL,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

// ── Seed reference data ───────────────────────────────────────────────────────

const priorityCount = (db.query("SELECT COUNT(*) as c FROM priorities").get() as any).c;
if (priorityCount === 0) {
  db.run(`INSERT INTO priorities (name, icon) VALUES ('High','🔴'),('Medium','🟡'),('Low','🟢')`);
}

const categoryCount = (db.query("SELECT COUNT(*) as c FROM categories").get() as any).c;
if (categoryCount === 0) {
  db.run(`
    INSERT INTO categories (name, emoji) VALUES
      ('Work','💼'),
      ('Personal','🏠'),
      ('Health','💪'),
      ('Finance','💰'),
      ('Learning','📚'),
      ('Shopping','🛒')
  `);
}

// ── Seed 10 sample tasks ──────────────────────────────────────────────────────

const taskCount = (db.query("SELECT COUNT(*) as c FROM tasks").get() as any).c;
if (taskCount === 0) {
  const sampleTasks = [
    { title: "Prepare Q3 report",        desc: "Compile sales data and write executive summary for Q3.",          status: "todo",        priority: 1, category: 1, due: "2026-06-10" },
    { title: "Team standup setup",        desc: "Configure recurring calendar invite for daily standups.",         status: "in_progress", priority: 2, category: 1, due: "2026-05-28" },
    { title: "Morning jog routine",       desc: "Run 5 km every morning before 7 AM.",                            status: "completed",   priority: 3, category: 3, due: "2026-05-25" },
    { title: "Read Clean Code",           desc: "Finish chapters 4–8 of Clean Code by Robert C. Martin.",         status: "todo",        priority: 2, category: 5, due: "2026-06-15" },
    { title: "Pay electricity bill",      desc: "Online payment via bank portal before due date.",                status: "todo",        priority: 1, category: 4, due: "2026-05-30" },
    { title: "Grocery shopping",          desc: "Buy vegetables, fruits, and weekly essentials.",                  status: "in_progress", priority: 3, category: 6, due: "2026-05-26" },
    { title: "Update resume",             desc: "Add recent projects and refresh skills section.",                 status: "todo",        priority: 2, category: 2, due: "2026-06-05" },
    { title: "Doctor appointment",        desc: "Annual health check-up at City Medical Center.",                  status: "completed",   priority: 1, category: 3, due: "2026-05-22" },
    { title: "React hooks deep dive",     desc: "Study useCallback, useMemo, and custom hooks patterns.",         status: "in_progress", priority: 2, category: 5, due: "2026-06-01" },
    { title: "Budget spreadsheet",        desc: "Track monthly expenses and update savings goals for June.",      status: "todo",        priority: 3, category: 4, due: "2026-06-01" },
  ];

  const insert = db.prepare(`
    INSERT INTO tasks (title, description, status, priority_id, category_id, due_date)
    VALUES ($title, $desc, $status, $priority, $category, $due)
  `);

  for (const t of sampleTasks) {
    insert.run({ $title: t.title, $desc: t.desc, $status: t.status, $priority: t.priority, $category: t.category, $due: t.due });
  }

  // Add sample comments to first 3 tasks
  const insertComment = db.prepare(`INSERT INTO comments (task_id, body) VALUES ($taskId, $body)`);
  insertComment.run({ $taskId: 1, $body: "Started gathering data from the analytics dashboard." });
  insertComment.run({ $taskId: 1, $body: "Need to confirm numbers with the finance team." });
  insertComment.run({ $taskId: 2, $body: "Zoom link created, waiting for manager approval." });
  insertComment.run({ $taskId: 9, $body: "Completed useCallback examples, moving to useMemo." });
}

export default db;
