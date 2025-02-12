import Logger from "../utils/logger";

const API_URL = "/api";

export const updateActivitiesAPI = async (activities, format) => {
  try {
    Logger.debug("Updating API with activities:", {
      activityCount: activities.length,
      format,
    });

    const response = await fetch(`${API_URL}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activities, format }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = await response.json();
    Logger.debug("API update successful:", result);
    return result;
  } catch (error) {
    Logger.error("Error updating API", error);
    throw error;
  }
};
