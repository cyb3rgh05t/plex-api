import React from "react";
import { useQuery } from "react-query";
import { useConfig } from "../../context/ConfigContext";
import { logError } from "../../utils/logger";

const ActivityItem = ({ activity }) => {
  // Define color and text mapping for different activity types
  const typeStyles = {
    download: {
      color: "bg-blue-500/20 text-blue-400",
      label: "Download",
    },
    transcode: {
      color: "bg-green-500/20 text-green-400",
      label: "Transcode",
    },
    stream: {
      color: "bg-purple-500/20 text-purple-400",
      label: "Stream",
    },
    default: {
      color: "bg-gray-500/20 text-green-400",
      label: "Downlaod",
    },
  };

  // Determine the type style, defaulting to 'default' if not found
  const typeStyle =
    typeStyles[activity.type.toLowerCase()] || typeStyles.default;

  return (
    <div className="w-full bg-gray-800/50 p-4 rounded mb-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-lg font-medium">
            {activity.subtitle}
          </h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${typeStyle.color}`}
          >
            {typeStyle.label}
          </span>
        </div>
        <p className="text-gray-400 mb-2">{activity.title}</p>

        <div className="w-full">
          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(activity.progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-gray-300 text-sm">
              {Math.min(activity.progress, 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlexActivity = () => {
  const { config } = useConfig();

  const {
    data: activities,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery(
    ["plexActivities", config.plexToken],
    async () => {
      const response = await fetch("http://localhost:3006/api/downloads");
      const data = await response.json();
      if (data.error) throw new Error(data.message || data.error);
      return data.activities;
    },
    {
      refetchInterval: 15000,
      enabled: !!config.plexToken,
    }
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Plex Download Activities
          </h2>
          <div className="mt-2 bg-gray-800 rounded-lg px-4 py-2 inline-block">
            <span className="text-gray-400">Total Downloads: </span>
            <span className="text-blue-400 font-semibold">
              {activities?.length || 0}
            </span>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
            hover:bg-blue-700 transition-colors flex items-center gap-2
            ${isFetching ? "opacity-90 cursor-not-allowed" : ""}`}
        >
          {isFetching && (
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
          {isFetching ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="w-full bg-gray-800/50 p-4 rounded animate-pulse"
            >
              <div className="h-6 bg-gray-700 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-64 mb-4" />
              <div className="w-full h-1 bg-gray-700 rounded-full mb-4" />
              <div className="h-4 bg-gray-700 rounded w-96" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="w-full p-4 bg-red-900/20 rounded">
          <p className="text-red-400">Error loading Plex activities</p>
        </div>
      ) : !activities?.length ? (
        <div className="w-full p-4 bg-gray-800/50 rounded text-center">
          <p className="text-gray-400">No active downloads</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.uuid} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlexActivity;
