import Logger from "../utils/logger.js";

export const fetchPlexActivities = async () => {
  try {
    Logger.plex("Starting Plex fetch via proxy");

    const response = await fetch("/api/plex/activities");

    Logger.debug("Response status:", {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch activities");
    }

    const data = await response.text();

    Logger.debug("Response data:", {
      length: data.length,
      preview: data.substring(0, 200),
    });

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");

    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      throw new Error(`XML parsing failed: ${parserError.textContent}`);
    }

    const activities = Array.from(xmlDoc.getElementsByTagName("Activity"))
      .filter((activity) => activity.getAttribute("type") === "media.download")
      .map((activity) => {
        const attributes = Array.from(activity.attributes);
        const activityData = {};

        attributes.forEach((attr) => {
          let value = attr.value;
          if (attr.name === "progress" || attr.name === "userID") {
            value = parseInt(value, 10) || 0;
          }
          activityData[attr.name] = value;
        });

        return activityData;
      });

    Logger.plex("Successfully fetched activities", {
      count: activities.length,
      firstActivity: activities[0]
        ? {
            type: activities[0].type,
            progress: activities[0].progress,
          }
        : null,
    });

    return activities;
  } catch (error) {
    Logger.error("Plex fetch error:", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

export const testPlexConnection = async (serverUrl, token) => {
  try {
    Logger.plex("Testing Plex connection");

    const response = await fetch("/api/test-connection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serverUrl, token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Connection test failed");
    }

    return true;
  } catch (error) {
    Logger.error("Connection test failed:", error);
    throw error;
  }
};
