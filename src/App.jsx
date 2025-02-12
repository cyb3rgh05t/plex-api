import { useState, useEffect } from "react";
import axios from "axios";
import PlexActivity from "./PlexActivity";

function App() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PLEX_SERVER_URL}/activities`,
        {
          params: {
            "X-Plex-Token": import.meta.env.VITE_PLEX_TOKEN,
          },
        }
      );

      // Parse XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const activityNodes = xmlDoc.querySelectorAll("Activity");

      const parsedActivities = Array.from(activityNodes).map((node) => ({
        uuid: node.getAttribute("uuid"),
        type: node.getAttribute("type"),
        title: node.getAttribute("title"),
        subtitle: node.getAttribute("subtitle"),
        progress: parseInt(node.getAttribute("progress")),
      }));

      setActivities(parsedActivities);
      console.log("Activities fetched:", parsedActivities);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">
        Plex API Dashboard
      </h1>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <PlexActivity key={activity.uuid} activity={activity} />
        ))}
      </div>
    </div>
  );
}

export default App;
