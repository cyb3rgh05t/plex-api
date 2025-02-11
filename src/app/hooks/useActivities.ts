import { useState, useEffect } from "react";
import { PlexActivity } from "../lib/types";

export function useActivities() {
  const [activities, setActivities] = useState<PlexActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/activities");
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          setActivities([]);
          console.warn("Received non-array data from API:", data);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  return { activities, loading, error };
}
