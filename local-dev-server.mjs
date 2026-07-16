/**
 * local-dev-server.mjs
 * ─────────────────────────────────────────────────────────────────────
 * Lightweight local development server that emulates the Vercel
 * serverless function environment for api/contact.js.
 *
 * Usage:  node local-dev-server.mjs
 * Then:   npm run dev   (Vite on :5173 proxies /api/* → this on :3000)
 *
 * This replaces the old Express server (server/index.js).
 * In production, Vercel runs api/contact.js natively — no server needed.
 */

import http from "http";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env manually (no dotenv package needed) ──────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
try {
  const envContent = readFileSync(resolve(__dir, ".env"), "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
  console.log("✅  Loaded .env");
} catch {
  console.warn("⚠️  No .env file found — MONGODB_URI must be set in environment.");
}

// ── Dynamically import the serverless handler ──────────────────────
const { default: handler } = await import("./api/contact.js");

// ── Minimal req/res shim matching Vercel's signature ──────────────
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

// ── HTTP Server ────────────────────────────────────────────────────
const PORT = 3000;

http.createServer(async (req, res) => {
  // Basic CORS for Vite dev (port 5173)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }

  // Only handle /api/contact
  if (!req.url.startsWith("/api/contact")) {
    res.writeHead(404); res.end("Not found"); return;
  }

  let body = {};
  if (req.method === "POST") {
    const raw = await new Promise((ok) => {
      let d = "";
      req.on("data", c => d += c);
      req.on("end", () => ok(d));
    });
    try { body = JSON.parse(raw); } catch { body = {}; }
  }

  await handler(createReq(req, body), createRes(res));
}).listen(PORT, () => {
  console.log(`🚀  Local API running on http://localhost:${PORT}/api/contact`);
  console.log(`    Run "npm run dev" (Vite) in a separate terminal.`);
});
