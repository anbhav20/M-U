import express from "express";
import { registerRoutes } from "./routes.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Determine the client dist path
const clientDistPath = path.join(__dirname, "../client/dist");

// Serve static files from the client build
app.use(express.static(clientDistPath));

// Register API routes
registerRoutes(app).then((server) => {
  const PORT = process.env.PORT || 5000;
  server.listen({
    port: PORT,
    host: "0.0.0.0",
  }, () => {
    console.log(`Production server running on port ${PORT}`);
  });
});

// For any request that doesn't match an API route, serve the app
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});