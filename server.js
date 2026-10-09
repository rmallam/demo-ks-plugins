#!/usr/bin/env node
"use strict";

const http = require("http");
const { execFileSync } = require("child_process");

const port = Number(process.env.PORT || 3000);
const appName = "demo-ks-plugins";

function tool(bin, args) {
  try {
    return execFileSync(bin, args, { encoding: "utf8" }).trim().split("\n")[0];
  } catch (err) {
    return `unavailable (${err.message})`;
  }
}

function health() {
  return { status: "ok", app: appName, mesh: "ambient" };
}

function api() {
  return {
    service: appName,
    message: "ok",
    mesh: "ambient",
    ts: new Date().toISOString(),
  };
}

const page = () => `<!doctype html>
<html><head><meta charset="utf-8"><title>${appName}</title></head>
<body style="font-family:sans-serif;margin:2rem;max-width:42rem">
  <h1>${appName}</h1>
  <p>Kitchen-sink service that exercises RHDH plugin tabs</p>
  <p>Kitchen-sink demo for RHDH plugins. Running on Red Hat UDI in Dev Spaces.</p>
  <ul>
    <li>node: ${tool("node", ["-v"])}</li>
    <li>npm: ${tool("npm", ["-v"])}</li>
  </ul>
</body></html>`;

const server = http.createServer((req, res) => {
  const url = (req.url || "/").split("?")[0];
  if (url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(health()));
    return;
  }
  if (url === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(api()));
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(page());
});

server.listen(port, "0.0.0.0", () => {
  console.log(`${appName} listening on http://0.0.0.0:${port}`);
});
