// src/app/page.tsx
"use client";

import { useState } from "react";
import ActivityList from "./components/ActivityList";
import FormatEditor from "./components/FormatEditor";
import { useActivities } from "./hooks/useActivities";
import { Tabs } from "./components/Tabs";

export default function Home() {
  const { activities, loading } = useActivities();
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
        {activeTab === "activities" ? (
          loading ? (
            <div>Loading...</div>
          ) : (
            <ActivityList activities={activities} />
          )
        ) : (
          <FormatEditor
            config={{
              variables: ["title", "subtitle", "progress", "type"],
              outputFormat: "{title} - {subtitle} ({progress}%)",
            }}
            onSave={async (config) => {
              try {
                await fetch("/api/config", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(config),
                });
              } catch (error) {
                console.error("Error saving config:", error);
              }
            }}
          />
        )}
      </div>
    </main>
  );
}
