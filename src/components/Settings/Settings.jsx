import React, { useState } from "react";
import {
  FaServer,
  FaDatabase,
  FaCheckCircle,
  FaTimesCircle,
  FaGithub,
  FaExternalLinkAlt,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import { useConfig } from "../../context/ConfigContext";
import toast from "react-hot-toast";
import { testPlexConnection } from "../../services/plexService";
import { testTautulliConnection } from "../../services/tautulliService";

const SubTabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      active
        ? "bg-gray-700 text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
    }`}
  >
    {children}
  </button>
);

const Settings = ({ onClose }) => {
  const { config, updateConfig, clearConfig } = useConfig();
  const [activeSubTab, setActiveSubTab] = useState("plex");
  const [formData, setFormData] = useState({
    plexUrl: config?.plexUrl || "",
    plexToken: config?.plexToken || "",
    tautulliUrl: config?.tautulliUrl || "",
    tautulliApiKey: config?.tautulliApiKey || "",
  });
  const [connectionStatus, setConnectionStatus] = useState({
    plex: null,
    tautulli: null,
  });
  const appVersion = "v1.0.0";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const testConnections = async () => {
    try {
      // Validate URLs first
      try {
        new URL(formData.plexUrl);
        new URL(formData.tautulliUrl);
      } catch (urlError) {
        toast.error("Invalid URL format");
        return;
      }

      // Verify all fields are filled
      if (
        !formData.plexUrl ||
        !formData.plexToken ||
        !formData.tautulliUrl ||
        !formData.tautulliApiKey
      ) {
        toast.error("Please fill in all configuration fields");
        return;
      }

      // Test Plex connection
      await testPlexConnection(formData.plexUrl, formData.plexToken);
      setConnectionStatus((prev) => ({ ...prev, plex: true }));

      // Test Tautulli connection
      await testTautulliConnection(
        formData.tautulliUrl,
        formData.tautulliApiKey
      );
      setConnectionStatus((prev) => ({ ...prev, tautulli: true }));

      toast.success("Both connections tested successfully!");
    } catch (error) {
      toast.error("Connection test failed");
      // Determine which service failed
      if (error.message.includes("Plex")) {
        setConnectionStatus((prev) => ({ ...prev, plex: false }));
      } else if (error.message.includes("Tautulli")) {
        setConnectionStatus((prev) => ({ ...prev, tautulli: false }));
      }
    }
  };

  const handleSave = async () => {
    try {
      // Validate inputs
      if (
        !formData.plexUrl ||
        !formData.plexToken ||
        !formData.tautulliUrl ||
        !formData.tautulliApiKey
      ) {
        toast.error("Please fill in all configuration fields");
        return;
      }

      // Validate URLs
      try {
        new URL(formData.plexUrl);
        new URL(formData.tautulliUrl);
      } catch (urlError) {
        toast.error("Invalid URL format");
        return;
      }

      // Try to save configuration via API
      try {
        const response = await fetch("http://localhost:3006/api/config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plexUrl: formData.plexUrl,
            plexToken: formData.plexToken,
            tautulliUrl: formData.tautulliUrl,
            tautulliApiKey: formData.tautulliApiKey,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update configuration");
        }

        const data = await response.json();
        console.log("Settings - Server response:", data);

        // Update local configuration
        updateConfig(formData);

        // Reset connection status after successful save
        setConnectionStatus({
          plex: null,
          tautulli: null,
        });

        // Show success toast
        toast.success("Configuration updated successfully");
      } catch (apiError) {
        console.error("Settings - API Configuration update error:", apiError);
        toast.error("Failed to update configuration via API");
      }
    } catch (error) {
      console.error("Settings - Configuration update error:", error);
      toast.error("Failed to update configuration");
    }
  };

  const renderTabContent = () => {
    switch (activeSubTab) {
      case "plex":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">
                Plex Server URL
              </label>
              <input
                type="text"
                name="plexUrl"
                value={formData.plexUrl}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                placeholder="e.g., http://localhost:32400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Plex Token</label>
              <input
                type="text"
                name="plexToken"
                value={formData.plexToken}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                placeholder="Enter your Plex token"
                required
              />
              <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                <a
                  href="https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 flex items-center gap-1"
                >
                  How to get Plex Token <FaExternalLinkAlt />
                </a>
              </div>
            </div>
          </div>
        );
      case "tautulli":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Tautulli URL</label>
              <input
                type="text"
                name="tautulliUrl"
                value={formData.tautulliUrl}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                placeholder="e.g., http://localhost:8181"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">
                Tautulli API Key
              </label>
              <input
                type="text"
                name="tautulliApiKey"
                value={formData.tautulliApiKey}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                placeholder="Enter your Tautulli API key"
                required
              />
              <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                <a
                  href="https://github.com/Tautulli/Tautulli/wiki/Accessing-the-API-v2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 flex items-center gap-1"
                >
                  How to get Tautulli API Key <FaExternalLinkAlt />
                </a>
              </div>
            </div>
          </div>
        );
      case "dangerZone":
        return (
          <div className="space-y-4">
            <div className="bg-red-900/20 border border-red-500 rounded p-4">
              <div className="flex items-center gap-3 mb-4">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
                <h3 className="text-lg font-semibold text-red-400">
                  Danger Zone
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                These actions will permanently delete your configuration and
                cannot be undone.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to reset ALL configurations? This cannot be undone."
                      )
                    ) {
                      // Make an API call to reset everything
                      axios
                        .post("http://localhost:3006/api/reset-all")
                        .then(() => {
                          clearConfig();
                          toast.success("All configurations have been reset");
                          onClose();
                        })
                        .catch((error) => {
                          console.error(
                            "Reset all configurations failed:",
                            error
                          );
                          toast.error("Failed to reset configurations");
                        });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <FaTrash /> Reset All Configurations
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">
              Plex Dashboard Settings
            </h1>
            <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
              {appVersion}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/cyb3rgh05t/plex-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors mr-4"
              title="View on GitHub"
            >
              <FaGithub size={24} />
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              title="Close Settings"
            >
              Close
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <SubTabButton
            active={activeSubTab === "plex"}
            onClick={() => setActiveSubTab("plex")}
          >
            <div className="flex items-center gap-2">
              <FaServer /> Plex
            </div>
          </SubTabButton>
          <SubTabButton
            active={activeSubTab === "tautulli"}
            onClick={() => setActiveSubTab("tautulli")}
          >
            <div className="flex items-center gap-2">
              <FaDatabase /> Tautulli
            </div>
          </SubTabButton>
          <SubTabButton
            active={activeSubTab === "dangerZone"}
            onClick={() => setActiveSubTab("dangerZone")}
          >
            <div className="flex items-center gap-2">
              <FaExclamationTriangle /> Danger Zone
            </div>
          </SubTabButton>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-6">
          {renderTabContent()}

          {/* Connection Test and Save Section - Only show for Plex and Tautulli tabs */}
          {(activeSubTab === "plex" || activeSubTab === "tautulli") && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={testConnections}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Test Connections
                </button>

                <div className="flex items-center space-x-4">
                  {connectionStatus.plex !== null && (
                    <div className="flex items-center gap-2">
                      <span>Plex:</span>
                      {connectionStatus.plex ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                    </div>
                  )}
                  {connectionStatus.tautulli !== null && (
                    <div className="flex items-center gap-2">
                      <span>Tautulli:</span>
                      {connectionStatus.tautulli ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save Configuration
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;
