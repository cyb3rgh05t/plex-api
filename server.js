import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3005;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Log environment variables on startup (without exposing sensitive data)
console.log("Starting server with configuration:");
console.log("PLEX_SERVER_URL configured:", !!process.env.VITE_PLEX_SERVER_URL);
console.log("PLEX_TOKEN configured:", !!process.env.VITE_PLEX_TOKEN);

// Handle all routes for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
