import axios from "axios";
import logger from "../utils/logger";

const plexApi = axios.create({
  baseURL: process.env.REACT_APP_PLEX_SERVER_URL,
  headers: {
    Accept: "application/json",
  },
});

export const fetchActivities = async () => {
  try {
    const response = await plexApi.get("/activities", {
      params: {
        "X-Plex-Token": process.env.REACT_APP_PLEX_TOKEN,
      },
    });

    logger.info("Activities fetched successfully");
    return response.data.MediaContainer.Activity || [];
  } catch (error) {
    logger.error("Error fetching activities:", error);
    throw error;
  }
};
