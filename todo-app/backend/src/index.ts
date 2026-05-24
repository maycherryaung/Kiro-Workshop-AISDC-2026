import "./db"; // initialise DB + seed on startup
import { handleTasks, handleComments } from "./routes/tasks";
import { handleMeta } from "./routes/meta";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Pre-flight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    let response: Response;

    try {
      if (url.pathname.startsWith("/api/tasks") && url.pathname.includes("/comments")) {
        response = await handleComments(req, url);
      } else if (url.pathname.startsWith("/api/tasks")) {
        response = await handleTasks(req, url);
      } else if (url.pathname.startsWith("/api/priorities") || url.pathname.startsWith("/api/categories")) {
        response = handleMeta(req, url);
      } else {
        response = new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (err) {
      console.error(err);
      response = new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Attach CORS headers to every response
    for (const [k, v] of Object.entries(CORS_HEADERS)) {
      response.headers.set(k, v);
    }

    return response;
  },
});

console.log(`✅  Backend running at http://localhost:${PORT}`);
