import config from "../config/config";
import Logger from "../utils/logger";

export const fetchPlexActivities = async () => {
  try {
    Logger.plex("Checking Plex configuration", {
      hasUrl: !!config.plexServerUrl,
      hasToken: !!config.plexToken,
      serverUrl: config.plexServerUrl?.replace(/:[^:]*@/, ":****@"),
    });

    if (!config.plexServerUrl || !config.plexToken) {
      throw new Error(
        `Plex configuration missing - URL: ${!!config.plexServerUrl}, Token: ${!!config.plexToken}`
      );
    }

    const url = `${config.plexServerUrl}/activities?X-Plex-Token=${config.plexToken}`;
    Logger.debug("Making request to Plex", {
      url: url.replace(config.plexToken, "[HIDDEN]"),
    });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.text();
    Logger.debug("Received data from Plex", {
      dataLength: data.length,
      preview: data.substring(0, 100),
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

    Logger.plex("Successfully processed activities", {
      count: activities.length,
    });
    return activities;
  } catch (error) {
    Logger.error("Error in fetchPlexActivities:", error);
    throw error;
  }
};
