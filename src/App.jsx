import { useState, useEffect } from "react";
import axios from "axios";
import PlexActivity from "./PlexActivity";

function App() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      console.log("Fetching from:", import.meta.env.VITE_PLEX_SERVER_URL);

      const response = await axios.get(
        `${import.meta.env.VITE_PLEX_SERVER_URL}/activities`,
        {
          headers: {
            "X-Plex-Token": import.meta.env.VITE_PLEX_TOKEN,
            Accept: "application/xml",
          },
        }
      );

      console.log("Raw response:", response.data);

      // Parse XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      console.log("Parsed XML:", xmlDoc);

      const activityNodes = xmlDoc.querySelectorAll("Activity");
      console.log("Activity nodes found:", activityNodes.length);

      const parsedActivities = Array.from(activityNodes).map((node) => {
        const activity = {
          uuid: node.getAttribute("uuid"),
          type: node.getAttribute("type"),
          title: node.getAttribute("title"),
          subtitle: node.getAttribute("subtitle"),
          progress: parseInt(node.getAttribute("progress")),
        };
        console.log("Parsed activity:", activity);
        return activity;
      });

      console.log("Final parsed activities:", parsedActivities);
      setActivities(parsedActivities);
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        config: err.config,
      });
      setError(err.message);
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

      {activities.length === 0 && !error && (
        <div className="text-white">Loading activities...</div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <PlexActivity key={activity.uuid} activity={activity} />
        ))}
      </div>

      <div className="mt-4 text-gray-400 text-sm">
        Environment check:
        <br />
        Server URL: {import.meta.env.VITE_PLEX_SERVER_URL || "Not set"}
        <br />
        Token Length:{" "}
        {import.meta.env.VITE_PLEX_TOKEN
          ? import.meta.env.VITE_PLEX_TOKEN.length
          : "Not set"}
      </div>
    </div>
  );
}

export default App;
