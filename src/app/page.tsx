"use client";

import { useState } from "react";
import ActivityList from "./components/ActivityList";
import ConfigPanel from "./components/ConfigPanel";
import { useActivities } from "./hooks/useActivities";
import { Tabs } from "./components/Tabs";

export default function Home() {
  const { activities, loading, error } = useActivities();
  const [activeTab, setActiveTab] = useState("activities");

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Plex Activity Monitor</h1>

      <Tabs
        tabs={[
          { id: "activities", label: "Activities" },
          { id: "format", label: "Format Editor" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {activeTab === "activities" ? (
          loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <ActivityList activities={activities} />
          )
        ) : (
          <ConfigPanel />
        )}
      </div>
    </main>
  );
}
