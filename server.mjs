import http from "http";
import { readFileSync, statSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import handler from "./api/contact.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 10000;

// Load .env manually for local development if available
try {
  const envPath = resolve(__dirname, ".env");
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    }
    console.log("✅ Loaded .env");
  }
} catch (e) {
  // Ignore in production
}

// Content types map for static files
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

// Shims for request and response matching Vercel Serverless environment
function createReq(req, body) {
  return Object.assign(req, {
    body,
    headers: req.headers,
    method: req.method,
  });
}

function createRes(res) {
  const headers = {};
  return {
    statusCode: 200,
    _res: res,
    setHeader(k, v) { headers[k] = v; return this; },
    status(code) { this.statusCode = code; return this; },
    json(data) {
      res.writeHead(this.statusCode, { "Content-Type": "application/json", ...headers });
      res.end(JSON.stringify(data));
    },
    end() {
      res.writeHead(this.statusCode, headers);
      res.end();
    },
  };
}

const server = http.createServer(async (req, res) => {
  // CORS configurations for API calls
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // 1. API Route mapping
  if (req.url.startsWith("/api/contact")) {
    let body = {};
    if (req.method === "POST") {
      const raw = await new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk) => { data += chunk; });
        req.on("end", () => { resolve(data); });
      });
      try {
        body = JSON.parse(raw);
      } catch (e) {
        body = {};
      }
    }
    await handler(createReq(req, body), createRes(res));
    return;
  }

  // 2. Static Site routing (serving /dist folder built by Vite)
  // Strip query parameters
  const pathname = req.url.split("?")[0];
  let filePath = join(__dirname, "dist", pathname === "/" ? "index.html" : pathname);

  let exists = existsSync(filePath) && statSync(filePath).isFile();

  // If path doesn't exist, fall back to index.html (supports Single Page Application client routing)
  if (!exists) {
    filePath = join(__dirname, "dist", "index.html");
    exists = existsSync(filePath);
  }

  if (exists) {
    try {
      const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      const content = readFileSync(filePath);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Production server running on http://localhost:${PORT}`);
});
