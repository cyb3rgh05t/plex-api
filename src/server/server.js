import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3005;

// ASCII art banner for server start
const serverBanner = `
╔════════════════════════════════════════╗
║         PLEX ACTIVITY MONITOR          ║
║            by cyb3rgh05t               ║
╚════════════════════════════════════════╝
`;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(
    `🟣 [API] ${new Date().toISOString()} - ${req.method} ${req.url}`
  );
  next();
});

// Proxy endpoint for Plex
app.get("/api/plex/activities", async (req, res) => {
  try {
    console.log("🟣 [PROXY] Forwarding request to Plex server");

    const plexUrl = process.env.REACT_APP_PLEX_SERVER_URL;
    const plexToken = process.env.REACT_APP_PLEX_TOKEN;

    const response = await fetch(
      `${plexUrl}/activities?X-Plex-Token=${plexToken}`,
      {
        headers: {
          Accept: "application/xml",
          "X-Plex-Token": plexToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Plex server responded with ${response.status}`);
    }

    const data = await response.text();
    res.type("application/xml").send(data);
  } catch (error) {
    console.error("🔴 [ERROR] Proxy request failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Store for activities and format
let currentActivities = [];
let currentFormat = "";

app.post("/api/update", (req, res) => {
  try {
    const { activities, format } = req.body;
    if (!activities || !format) {
      return res.status(400).json({ error: "Missing required data" });
    }
    currentActivities = activities;
    currentFormat = format;
    res.json({ success: true });
  } catch (error) {
    console.error("🔴 [ERROR] Update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/activities", (req, res) => {
  try {
    res.json(
      currentActivities.map((activity) => ({
        formatted: formatOutput(currentFormat, activity),
        raw: activity,
      }))
    );
  } catch (error) {
    console.error("🔴 [ERROR] Activities error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

function formatOutput(format, activity) {
  let output = format;
  Object.keys(activity).forEach((key) => {
    const regex = new RegExp(`{${key}}`, "g");
    output = output.replace(regex, activity[key]);
  });
  return output;
}

// Serve static files
app.use(express.static(path.join(__dirname, "../../build")));

// Handle React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

app.listen(port, () => {
  console.log(serverBanner);
  console.log(`🚀 Server running on: http://localhost:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`\n📍 Available endpoints:`);
  console.log(`   POST /api/update`);
  console.log(`   GET  /api/activities`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`   GET  /api/debug`);
  }
});
