import React, { useState, useEffect } from "react";
import ActivityCard from "./components/ActivityCard";
import { fetchActivities } from "./services/plexApi";
import logger from "./utils/logger";

const App = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  const updateActivities = async () => {
    try {
      const data = await fetchActivities();
      setActivities(data);
      setError(null);
    } catch (err) {
      logger.error("Failed to fetch activities:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    updateActivities();
    const interval = setInterval(updateActivities, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            Plex Download Monitor
          </h1>
          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-green-400">●</span>
            <span className="text-gray-300 ml-2">Live</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-4">
            Error: {error}
          </div>
        )}

        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.uuid} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
