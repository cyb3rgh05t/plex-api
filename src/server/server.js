const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3005;

console.log("Server starting with environment:", {
  nodeEnv: process.env.NODE_ENV,
  hasPlexUrl: !!process.env.REACT_APP_PLEX_SERVER_URL,
  hasPlexToken: !!process.env.REACT_APP_PLEX_TOKEN,
});

// ASCII art banner for server start
const serverBanner = `
╔════════════════════════════════════════╗
║         PLEX ACTIVITY MONITOR          ║
║            by cyb3rgh05t               ║
╚════════════════════════════════════════╝
`;

app.use(cors());
app.use(express.json());

// Store the latest activities and format
let currentActivities = [];
let currentFormat = "";

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(
    `🟣 🌐 [API REQUEST] ${new Date().toISOString()} - ${req.method} ${
      req.path
    }`
  );
  next();
});

// Create API router
const apiRouter = express.Router();

// API endpoints
apiRouter.post("/update", (req, res) => {
  console.log(`🟣 🌐 [API UPDATE] Received request to /api/update`);
  try {
    const { activities, format } = req.body;
    console.log(`🔵 ℹ️ [UPDATE] Received data:`, {
      activitiesCount: activities?.length,
      format,
      firstActivity: activities?.[0],
    });

    if (!activities || !format) {
      const error = "Missing required data";
      console.error(`🔴 ❌ [ERROR] ${error}`);
      return res.status(400).json({ error });
    }

    currentActivities = activities;
    currentFormat = format;

    console.log(
      `🔵 ℹ️ [SUCCESS] Updated activities store with ${activities.length} items`
    );
    res.json({
      success: true,
      message: `Updated ${activities.length} activities`,
    });
  } catch (error) {
    console.error(`🔴 ❌ [ERROR] Update error:`, error);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/activities", (req, res) => {
  try {
    console.log(
      `🟢 📺 [API] Serving activities, count:`,
      currentActivities.length
    );
    res.json(
      currentActivities.map((activity) => ({
        formatted: formatOutput(currentFormat, activity),
        raw: activity,
      }))
    );
  } catch (error) {
    console.error(`🔴 ❌ [ERROR] Activities error:`, error);
    res.status(500).json({ error: "Server error" });
  }
});

// Development endpoint
if (process.env.NODE_ENV !== "production") {
  apiRouter.get("/debug", (req, res) => {
    res.json({
      endpoints: [
        {
          method: "POST",
          path: "/api/update",
          description: "Update activities and format",
        },
        {
          method: "GET",
          path: "/api/activities",
          description: "Get formatted activities",
        },
      ],
      currentState: {
        activitiesCount: currentActivities.length,
        hasFormat: !!currentFormat,
        format: currentFormat,
      },
    });
  });
}

function formatOutput(format, activity) {
  let output = format;
  Object.keys(activity).forEach((key) => {
    const regex = new RegExp(`{${key}}`, "g");
    output = output.replace(regex, activity[key]);
  });
  return output;
}

// Mount API router BEFORE static files
app.use("/api", apiRouter);

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, "../../build")));

// Handle React routing LAST
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`🔴 ❌ [ERROR] Unhandled error:`, err);
  res.status(500).json({ error: "Internal server error" });
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
