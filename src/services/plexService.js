import config from "../config/config";
import Logger from "../utils/logger";

export const fetchPlexActivities = async () => {
  try {
    Logger.plex("Starting Plex fetch", {
      plexUrl: config.plexServerUrl?.replace(/:[^:]*@/, ":****@"),
      hasToken: !!config.plexToken,
    });

    // Ensure we're using HTTP
    const url =
      config.plexServerUrl.replace("https://", "http://") +
      "/activities?X-Plex-Token=" +
      config.plexToken;

    Logger.debug("Request URL:", {
      url: url.replace(config.plexToken, "[HIDDEN]"),
    });

    const response = await fetch(url, {
      headers: {
        Accept: "application/xml",
        "X-Plex-Token": config.plexToken,
      },
      // Add mode to handle CORS
      mode: "cors",
      credentials: "same-origin",
    });

    Logger.debug("Response status:", {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.text();

    Logger.debug("Response data preview:", {
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
    });

    return activities;
  } catch (error) {
    Logger.error("Plex fetch error:", {
      message: error.message,
      stack: error.stack,
      config: {
        hasUrl: !!config.plexServerUrl,
        hasToken: !!config.plexToken,
        url: config.plexServerUrl ? "Set" : "Missing",
      },
    });
    throw error;
  }
};
