import config from "../config/config";
import Logger from "../utils/logger";

export const fetchPlexActivities = async () => {
  try {
    Logger.plex("Initiating Plex activities fetch", {
      serverUrl: config.plexServerUrl?.replace(/:[^:]*@/, ":****@"),
      hasToken: !!config.plexToken,
    });

    if (!config.plexServerUrl || !config.plexToken) {
      throw new Error("Plex configuration missing");
    }

    const url = `${config.plexServerUrl}/activities?X-Plex-Token=${config.plexToken}`;
    Logger.debug("Request URL", {
      url: url.replace(config.plexToken, "[HIDDEN]"),
    });

    const response = await fetch(url);
    Logger.plex("Received response", {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.text();
    Logger.debug("Raw XML response preview", {
      preview: data.substring(0, 200) + "...",
      length: data.length,
    });

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");

    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      throw new Error(`XML parsing failed: ${parserError.textContent}`);
    }

    const activities = Array.from(xmlDoc.getElementsByTagName("Activity"))
      .filter((activity) => {
        const type = activity.getAttribute("type");
        Logger.debug("Processing activity", { type });
        return type === "media.download";
      })
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

        Logger.debug("Processed activity data", activityData);
        return activityData;
      });

    Logger.plex("Successfully processed activities", {
      count: activities.length,
      types: activities
        .map((a) => a.type)
        .filter((v, i, a) => a.indexOf(v) === i),
    });

    return activities;
  } catch (error) {
    Logger.error("Plex activities fetch failed", {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};
