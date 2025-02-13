import React, { useState, useEffect, useCallback } from "react";
import { ActivityCard } from "./ActivityCard";
import { fetchPlexActivities } from "../services/plexService";
import { updateActivitiesAPI } from "../services/apiService";
import { useFormat } from "../context/FormatContext";
import config from "../config/config.js";
import Logger from "../utils/logger.js";

export const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { format } = useFormat();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      Logger.debug("Starting to fetch Plex activities...");
      const data = await fetchPlexActivities();
      setActivities(data);
      await updateActivitiesAPI(data, format);
      setError(null);
    } catch (err) {
      const errorMessage = `Failed to fetch activities: ${err.message}`;
      setError(errorMessage);
      Logger.error(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, [format]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, config.refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleManualRefresh = () => {
    fetchData();
  };

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Plex Download Activities
          </h2>
          <div className="mt-2 bg-gray-800 rounded-lg px-4 py-2 inline-block">
            <span className="text-gray-400">Total Downloads: </span>
            <span className="text-blue-400 font-semibold">
              {activities.length}
            </span>
          </div>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
            hover:bg-blue-700 transition-colors flex items-center gap-2
            ${isLoading ? "opacity-90 cursor-not-allowed" : ""}`}
        >
          {isLoading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isLoading ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {activities.length === 0 && !isLoading ? (
        <div className="text-gray-400 text-center py-8">
          No download activities found
        </div>
      ) : (
        <div className="grid gap-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.uuid} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};
