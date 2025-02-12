import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3005;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Inject environment variables into HTML
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "dist", "index.html");
  let html = fs.readFileSync(indexPath, "utf8");

  // Create environment variables object
  const env = {
    VITE_PLEX_SERVER_URL: process.env.VITE_PLEX_SERVER_URL,
    VITE_PLEX_TOKEN: process.env.VITE_PLEX_TOKEN,
  };

  // Inject environment variables before closing body tag
  const envScript = `<script>window._env_ = ${JSON.stringify(env)};</script>`;
  html = html.replace("</body>", `${envScript}</body>`);

  res.send(html);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment variables configured:", {
    PLEX_SERVER_URL: !!process.env.VITE_PLEX_SERVER_URL,
    PLEX_TOKEN: !!process.env.VITE_PLEX_TOKEN,
  });
});
