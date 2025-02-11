import { useState, useEffect } from "react";
import { PlexActivity } from "../lib/types";

function logClientSide(
  level: "log" | "error" | "warn",
  message: string,
  data?: any
) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console[level](logMessage, data || "");
}

export function useActivities() {
  const [activities, setActivities] = useState<PlexActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        logClientSide("log", "Fetching activities...");
        const response = await fetch("/api/activities");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        logClientSide("log", "Activities response received", data);

        if (Array.isArray(data)) {
          setActivities(data);
          logClientSide(
            "log",
            `Updated activities state with ${data.length} items`
          );
        } else {
          setActivities([]);
          logClientSide("warn", "Received non-array data from API:", data);
        }
        setError(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logClientSide("error", "Error fetching activities:", errorMessage);
        setError(errorMessage);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    logClientSide("log", "Setting up activities polling interval");

    const interval = setInterval(fetchActivities, 30000);

    return () => {
      logClientSide("log", "Cleaning up activities polling interval");
      clearInterval(interval);
    };
  }, []);

  return { activities, loading, error };
}
