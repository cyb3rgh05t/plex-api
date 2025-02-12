import axios from "axios";
import logger from "../utils/logger";

// Create axios instance without baseURL
const plexApi = axios.create({
  headers: {
    Accept: "application/json",
  },
});

export const fetchActivities = async () => {
  try {
    // Get environment variables
    const plexUrl = process.env.REACT_APP_PLEX_SERVER_URL;
    const plexToken = process.env.REACT_APP_PLEX_TOKEN;

    // Log the URL being called (for debugging)
    logger.debug(
      `Fetching from: ${plexUrl}/activities?X-Plex-Token=${plexToken}`
    );

    const response = await plexApi.get(`${plexUrl}/activities`, {
      params: {
        "X-Plex-Token": plexToken,
      },
    });

    logger.info("Activities fetched successfully");

    // Check if the response has the expected structure
    if (response.data?.MediaContainer?.Activity) {
      return response.data.MediaContainer.Activity;
    } else {
      logger.warn("Unexpected response structure:", response.data);
      return [];
    }
  } catch (error) {
    logger.error("Error fetching activities:", error);
    throw error;
  }
};
