import React, { useState, useEffect } from "react";
import { FaGithub, FaCog, FaServer, FaDatabase } from "react-icons/fa";
import { useConfig } from "../../context/ConfigContext";
import { testPlexConnection } from "../../services/plexService";
import { testTautulliConnection } from "../../services/tautulliService";
import PlexActivity from "../PlexActivity/PlexActivity";
import RecentlyAdded from "../RecentlyAdded/RecentlyAdded";
import FormatSettings from "../FormatSettings/FormatSettings";
import Libraries from "../Libraries/Libraries";
import Users from "../Users/Users";
import Settings from "../Settings/Settings";
import ApiEndpoints from "../FormatSettings/ApiEndpoints";

const TabButton = ({ active, onClick, children }) => (
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

const DashboardLayout = () => {
  const { config, isConfigured } = useConfig();
  const [activeTab, setActiveTab] = useState("activities");
  const [showSettings, setShowSettings] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    plex: null,
    tautulli: null,
  });
  const appVersion = "v1.0.0";

  // Check connection status when component mounts or config changes
  useEffect(() => {
    const checkConnections = async () => {
      if (isConfigured()) {
        try {
          // Test Plex connection
          await testPlexConnection(config.plexUrl, config.plexToken);
          setConnectionStatus((prev) => ({ ...prev, plex: true }));
        } catch (error) {
          setConnectionStatus((prev) => ({ ...prev, plex: false }));
        }

        try {
          // Test Tautulli connection
          await testTautulliConnection(
            config.tautulliUrl,
            config.tautulliApiKey
          );
          setConnectionStatus((prev) => ({ ...prev, tautulli: true }));
        } catch (error) {
          setConnectionStatus((prev) => ({ ...prev, tautulli: false }));
        }
      }
    };

    checkConnections();
  }, [config, isConfigured]);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Plex Dashboard</h1>
            <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
              {appVersion}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Connection Status Badges */}
            {isConfigured() && (
              <div className="flex items-center space-x-2 mr-4">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    connectionStatus.plex === true
                      ? "bg-green-500/20 text-green-400"
                      : connectionStatus.plex === false
                      ? "bg-red-500/20 text-red-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  <FaServer />
                  Plex
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    connectionStatus.tautulli === true
                      ? "bg-green-500/20 text-green-400"
                      : connectionStatus.tautulli === false
                      ? "bg-red-500/20 text-red-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  <FaDatabase />
                  Tautulli
                </div>
              </div>
            )}

            <a
              href="https://github.com/cyb3rgh05t/plex-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors mr-4"
              title="View on GitHub"
            >
              <FaGithub size={24} />
            </a>
            {isConfigured() && (
              <button
                onClick={() => setShowSettings(true)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Settings"
              >
                <FaCog size={24} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <div className="flex gap-2">
            <TabButton
              active={activeTab === "activities"}
              onClick={() => setActiveTab("activities")}
            >
              Plex Activities
            </TabButton>
            <TabButton
              active={activeTab === "recent"}
              onClick={() => setActiveTab("recent")}
            >
              Recently Added
            </TabButton>
            <TabButton
              active={activeTab === "libraries"}
              onClick={() => setActiveTab("libraries")}
            >
              Libraries
            </TabButton>
            <TabButton
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
            >
              Users
            </TabButton>
          </div>
          <div className="ml-auto flex gap-2">
            <TabButton
              active={activeTab === "format"}
              onClick={() => setActiveTab("format")}
            >
              Format Settings
            </TabButton>
            <TabButton
              active={activeTab === "apiEndpoints"}
              onClick={() => setActiveTab("apiEndpoints")}
            >
              API Endpoints
            </TabButton>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          {activeTab === "activities" ? (
            <PlexActivity />
          ) : activeTab === "recent" ? (
            <RecentlyAdded />
          ) : activeTab === "libraries" ? (
            <Libraries />
          ) : activeTab === "users" ? (
            <Users />
          ) : activeTab === "apiEndpoints" ? (
            <ApiEndpoints />
          ) : (
            <FormatSettings />
          )}
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div
          className="fixed inset-0 z-50 bg-transparent"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <Settings onClose={() => setShowSettings(false)} />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
