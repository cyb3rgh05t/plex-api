import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fetch from "node-fetch";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = "/app/config/plex-config.json";

const app = express();
const port = 3005;

// Helper function for logging
const logInfo = (type, message, data = {}) => {
  console.log(`[${type}] ${new Date().toISOString()} - ${message}`, data);
};

// Helper functions for config management
const configManager = {
  async read() {
    try {
      const data = await fs.readFile(CONFIG_PATH, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  },
  async write(config) {
    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
      await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
    } catch (error) {
      logInfo("ERROR", "Failed to write config:", error);
      throw error;
    }
  },
};

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logInfo("REQUEST", `${req.method} ${req.url}`);
  next();
});

// Test connection endpoint
app.post("/api/test-connection", async (req, res) => {
  try {
    const { serverUrl, token } = req.body;

    if (!serverUrl || !token) {
      throw new Error("Server URL and token are required");
    }

    logInfo("TEST", "Testing Plex connection", { serverUrl });

    const response = await fetch(
      `${serverUrl}/activities?X-Plex-Token=${token}`,
      {
        headers: {
          Accept: "application/xml",
          "X-Plex-Token": token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to connect to Plex server: ${response.status}`);
    }

    res.json({ success: true });
  } catch (error) {
    logInfo("ERROR", "Connection test failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Config management endpoints
app.post("/api/config", async (req, res) => {
  try {
    const { serverUrl, token } = req.body;
    if (!serverUrl || !token) {
      throw new Error("Server URL and token are required");
    }
    await configManager.write({ serverUrl, token });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/config", async (req, res) => {
  try {
    const config = await configManager.read();
    res.json(config || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Plex activities endpoint
app.get("/api/plex/activities", async (req, res) => {
  try {
    const config = await configManager.read();
    if (!config) {
      throw new Error("Plex configuration not found");
    }

    logInfo("PLEX", "Fetching activities", {
      serverUrl: config.serverUrl,
    });

    const response = await fetch(
      `${config.serverUrl}/activities?X-Plex-Token=${config.token}`,
      {
        headers: {
          Accept: "application/xml",
          "X-Plex-Token": config.token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Plex server responded with ${response.status}`);
    }

    const data = await response.text();
    logInfo("PLEX", "Activities fetched", {
      dataLength: data.length,
    });

    res.type("application/xml").send(data);
  } catch (error) {
    logInfo("ERROR", "Proxy request failed:", error);
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
    logInfo("ERROR", "Update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, "../../build")));

// Handle React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

app.get("/api/activities", (req, res) => {
  try {
    if (!currentActivities || currentActivities.length === 0) {
      return res.status(404).json({ error: "No activities found" });
    }

    // Format activities based on the current format
    const formattedActivities = currentActivities.map((activity) => {
      let formattedOutput = currentFormat;
      Object.keys(activity).forEach((key) => {
        const regex = new RegExp(`{${key}}`, "g");
        formattedOutput = formattedOutput.replace(regex, activity[key]);
      });

      return {
        raw: activity,
        formatted: formattedOutput,
      };
    });

    res.json({
      count: formattedActivities.length,
      format: currentFormat,
      activities: formattedActivities,
    });
  } catch (error) {
    logInfo("ERROR", "Failed to retrieve activities:", error);
    res.status(500).json({ error: "Failed to retrieve activities" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logInfo("ERROR", "Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

const serverBanner = `
╔════════════════════════════════════════════════════╗
║                                                    ║
║             PLEX ACTIVITY MONITOR                  ║
║                                                    ║
╚════════════════════════════════════════════════════╝`;

const endpointsBanner = `
📍 Available Endpoints:
├── POST /api/update
│   └── Updates activities and format
│
├── GET  /api/activities
│   └── Retrieves formatted activities
│
├── POST /api/config
│   └── Save Plex server configuration
│
└── GET  /api/config
    └── Get current Plex configuration`;

app.listen(port, () => {
  console.clear(); // Clear console before printing banner
  console.log(serverBanner);
  console.log("\n🚀 Server Information:");
  console.log("├── Status: Running");
  console.log(`├── URL: http://localhost:${port}`);
  console.log(`├── Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("└── Time:", new Date().toLocaleString());

  console.log(endpointsBanner);

  if (process.env.NODE_ENV !== "production") {
    console.log("\n🔧 Debug Endpoints:");
    console.log("└── GET  /api/debug");
  }
});
