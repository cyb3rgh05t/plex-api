import React, { useState, useEffect } from "react";
import Logger from "../utils/logger.js";

export const Setup = () => {
  const [plexConfig, setPlexConfig] = useState({
    serverUrl: "",
    token: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/config");
        const data = await response.json();
        if (data.serverUrl && data.token) {
          setPlexConfig({
            serverUrl: data.serverUrl,
            token: data.token,
          });
        }
      } catch (error) {
        Logger.error("Failed to fetch config:", error);
        setStatus({
          type: "error",
          message: "Failed to load configuration",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Clear status after 5 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setStatus(null);

    try {
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plexConfig),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Connection test failed");
      }

      setStatus({
        type: "success",
        message: "Connection successful!",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message,
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    setStatus(null);

    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plexConfig),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }

      setStatus({
        type: "success",
        message: "Configuration saved successfully!",
      });

      // Optionally refresh the page after successful save
      // setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          Initial Plex Server Setup
        </h2>

        {/* Status Notification */}
        {status && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              status.type === "success"
                ? "bg-green-900/20 text-green-500 border border-green-500/20"
                : "bg-red-900/20 text-red-500 border border-red-500/20"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  status.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {status.message}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Server URL</label>
            <input
              type="text"
              value={plexConfig.serverUrl}
              onChange={(e) =>
                setPlexConfig({ ...plexConfig, serverUrl: e.target.value })
              }
              placeholder="http://your-plex-server:32400"
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Plex Token</label>
            <input
              type="password"
              value={plexConfig.token}
              onChange={(e) =>
                setPlexConfig({ ...plexConfig, token: e.target.value })
              }
              placeholder="Your Plex token"
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <a
              href="https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 mt-1 inline-block"
            >
              How to find your Plex token?
            </a>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleTestConnection}
              disabled={
                isTestingConnection ||
                !plexConfig.serverUrl ||
                !plexConfig.token
              }
              className={`px-4 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors
                ${
                  isTestingConnection ||
                  !plexConfig.serverUrl ||
                  !plexConfig.token
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
            >
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </button>

            <button
              onClick={handleSaveConfig}
              disabled={isSaving || !plexConfig.serverUrl || !plexConfig.token}
              className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors
                ${
                  isSaving || !plexConfig.serverUrl || !plexConfig.token
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
            >
              {isSaving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
