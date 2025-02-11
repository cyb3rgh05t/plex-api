// src/app/components/ActivityList.tsx
import { PlexActivity } from "../lib/types";

export default function ActivityList({
  activities,
}: {
  activities: PlexActivity[];
}) {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
          <p className="text-gray-300">{activity.subtitle}</p>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${activity.progress}%` }}
            />
          </div>
          <p className="text-gray-400 mt-1">
            {activity.progress}% - {activity.type}
          </p>
        </div>
      ))}
    </div>
  );
}
