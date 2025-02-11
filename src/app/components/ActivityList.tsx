import React from "react";
import { PlexActivity } from "../lib/types";

interface ActivityListProps {
  activities: PlexActivity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  if (!Array.isArray(activities)) {
    return <div className="text-red-500">Error loading activities</div>;
  }

  if (activities.length === 0) {
    return <div className="text-gray-400">No activities found</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">
            {activity.title || "Unknown Title"}
          </h3>
          <p className="text-gray-300">{activity.subtitle || ""}</p>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${
                  typeof activity.progress === "number" ? activity.progress : 0
                }%`,
              }}
            />
          </div>
          <p className="text-gray-400 mt-1">
            {typeof activity.progress === "number" ? activity.progress : 0}% -{" "}
            {activity.type || "unknown"}
          </p>
        </div>
      ))}
    </div>
  );
}
