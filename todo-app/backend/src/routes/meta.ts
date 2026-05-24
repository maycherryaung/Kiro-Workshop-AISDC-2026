import db from "../db";

export function handleMeta(_req: Request, url: URL): Response {
  const segment = url.pathname.split("/").filter(Boolean)[1]; // "priorities" | "categories"

  if (segment === "priorities") {
    const rows = db.query("SELECT * FROM priorities ORDER BY id").all();
    return json(rows);
  }

  if (segment === "categories") {
    const rows = db.query("SELECT * FROM categories ORDER BY id").all();
    return json(rows);
  }

  return json({ error: "Not found" }, 404);
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
