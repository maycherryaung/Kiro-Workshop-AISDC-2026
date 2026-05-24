import db from "../db";

// ── Helpers ───────────────────────────────────────────────────────────────────

const taskQuery = `
  SELECT
    t.id, t.title, t.description, t.status, t.due_date, t.created_at, t.updated_at,
    p.id   AS priority_id,   p.name AS priority_name,   p.icon AS priority_icon,
    c.id   AS category_id,   c.name AS category_name,   c.emoji AS category_emoji
  FROM tasks t
  JOIN priorities p ON p.id = t.priority_id
  JOIN categories c ON c.id = t.category_id
`;

function shapeTask(row: any) {
  return {
    id:          row.id,
    title:       row.title,
    description: row.description,
    status:      row.status,
    due_date:    row.due_date,
    created_at:  row.created_at,
    updated_at:  row.updated_at,
    priority: { id: row.priority_id, name: row.priority_name, icon: row.priority_icon },
    category: { id: row.category_id, name: row.category_name, emoji: row.category_emoji },
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function handleTasks(req: Request, url: URL): Promise<Response> {
  const parts = url.pathname.split("/").filter(Boolean); // ["api","tasks",<id>?,...]
  const id    = parts[2] ? parseInt(parts[2]) : null;

  // GET /api/tasks
  if (req.method === "GET" && !id) {
    const rows = db.query(`${taskQuery} ORDER BY t.created_at DESC`).all();
    return json(rows.map(shapeTask));
  }

  // GET /api/tasks/:id
  if (req.method === "GET" && id) {
    const row = db.query(`${taskQuery} WHERE t.id = $id`).get({ $id: id });
    if (!row) return notFound();
    return json(shapeTask(row));
  }

  // POST /api/tasks
  if (req.method === "POST" && !id) {
    const body = await req.json();
    const { title, description = "", priority_id, category_id, due_date = null, status = "todo" } = body;
    if (!title || !priority_id || !category_id) return badRequest("title, priority_id, category_id are required");

    const result = db.run(
      `INSERT INTO tasks (title, description, priority_id, category_id, due_date, status)
       VALUES ($title, $desc, $priority, $category, $due, $status)`,
      { $title: title, $desc: description, $priority: priority_id, $category: category_id, $due: due_date, $status: status }
    );
    const row = db.query(`${taskQuery} WHERE t.id = $id`).get({ $id: result.lastInsertRowid });
    return json(shapeTask(row), 201);
  }

  // PUT /api/tasks/:id
  if (req.method === "PUT" && id) {
    const existing = db.query("SELECT id FROM tasks WHERE id = $id").get({ $id: id });
    if (!existing) return notFound();

    const body = await req.json();
    const { title, description, priority_id, category_id, due_date, status } = body;

    db.run(
      `UPDATE tasks SET
        title       = COALESCE($title,       title),
        description = COALESCE($desc,        description),
        priority_id = COALESCE($priority,    priority_id),
        category_id = COALESCE($category,    category_id),
        due_date    = COALESCE($due,         due_date),
        status      = COALESCE($status,      status),
        updated_at  = datetime('now')
       WHERE id = $id`,
      {
        $id:       id,
        $title:    title    ?? null,
        $desc:     description ?? null,
        $priority: priority_id ?? null,
        $category: category_id ?? null,
        $due:      due_date  ?? null,
        $status:   status    ?? null,
      }
    );
    const row = db.query(`${taskQuery} WHERE t.id = $id`).get({ $id: id });
    return json(shapeTask(row));
  }

  // DELETE /api/tasks/:id
  if (req.method === "DELETE" && id) {
    const existing = db.query("SELECT id FROM tasks WHERE id = $id").get({ $id: id });
    if (!existing) return notFound();
    db.run("DELETE FROM tasks WHERE id = $id", { $id: id });
    return json({ success: true });
  }

  return notFound();
}

// ── Comment sub-routes (/api/tasks/:id/comments) ──────────────────────────────

export async function handleComments(req: Request, url: URL): Promise<Response> {
  const parts  = url.pathname.split("/").filter(Boolean);
  const taskId = parseInt(parts[2]);

  const taskExists = db.query("SELECT id FROM tasks WHERE id = $id").get({ $id: taskId });
  if (!taskExists) return notFound();

  // GET /api/tasks/:id/comments
  if (req.method === "GET") {
    const rows = db.query("SELECT * FROM comments WHERE task_id = $taskId ORDER BY created_at ASC").all({ $taskId: taskId });
    return json(rows);
  }

  // POST /api/tasks/:id/comments
  if (req.method === "POST") {
    const body = await req.json();
    const { body: commentBody } = body;
    if (!commentBody?.trim()) return badRequest("body is required");

    const result = db.run(
      "INSERT INTO comments (task_id, body) VALUES ($taskId, $body)",
      { $taskId: taskId, $body: commentBody.trim() }
    );
    const row = db.query("SELECT * FROM comments WHERE id = $id").get({ $id: result.lastInsertRowid });
    return json(row, 201);
  }

  return notFound();
}

// ── Tiny helpers ──────────────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
function notFound()              { return json({ error: "Not found" }, 404); }
function badRequest(msg: string) { return json({ error: msg }, 400); }
