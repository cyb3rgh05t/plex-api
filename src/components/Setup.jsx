import React, { useState } from "react";
import Logger from "../utils/logger.js";

export const Setup = () => {
  const [serverUrl, setServerUrl] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverUrl,
          token,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }

      window.location.reload(); // Refresh to apply new settings
    } catch (err) {
      setError(err.message);
      Logger.error("Setup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Plex Server Setup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Server URL</label>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="http://your-plex-server:32400"
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Plex Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Your Plex token"
              className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-900/20 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
              hover:bg-blue-700 transition-colors
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Saving..." : "Save Configuration"}
          </button>
        </form>
      </div>
    </div>
  );
};
