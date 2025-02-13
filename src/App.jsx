import React, { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { ActivityList } from "./components/ActivityList";
import { Settings } from "./components/Settings";
import { ApiEndpoints } from "./components/ApiEndpoints";
import { Setup } from "./components/Setup";
import Logger from "./utils/logger.js";

const App = () => {
  const [activeTab, setActiveTab] = useState("activities");
  const [isConfigured, setIsConfigured] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const response = await fetch("/api/config");
        const data = await response.json();
        setIsConfigured(!!data.serverUrl && !!data.token);
      } catch (error) {
        Logger.error("Failed to check configuration:", error);
        setIsConfigured(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConfiguration();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!isConfigured) {
    return (
      <Layout>
        <Setup />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("activities")}
            className={`py-3 px-6 text-white font-medium ${
              activeTab === "activities"
                ? "border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Downloads
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-6 text-white font-medium ${
              activeTab === "settings"
                ? "border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`py-3 px-6 text-white font-medium ${
              activeTab === "api"
                ? "border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            API Endpoints
          </button>
        </div>
        {activeTab === "activities" ? (
          <ActivityList />
        ) : activeTab === "settings" ? (
          <Settings />
        ) : (
          <ApiEndpoints />
        )}
      </div>
    </Layout>
  );
};

export default App;
