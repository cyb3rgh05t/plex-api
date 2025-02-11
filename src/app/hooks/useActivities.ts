// src/app/hooks/useActivities.ts
import { useState, useEffect } from "react";
import { PlexActivity } from "../lib/types";

export function useActivities() {
  const [activities, setActivities] = useState<PlexActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/activities");
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  return { activities, loading };
}
