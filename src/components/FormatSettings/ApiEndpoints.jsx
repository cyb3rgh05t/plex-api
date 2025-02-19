import React, { useState, useEffect } from "react";

const EndpointCard = ({ endpoint, method, description, example, baseUrl }) => {
  const handleTest = () => {
    window.open(`${baseUrl}${endpoint}`, "_blank");
  };

  return (
    <div className="bg-gray-700/30 p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <span
            className={`px-2 py-1 rounded text-xs font-medium
            ${
              method === "GET"
                ? "bg-green-500/20 text-green-400"
                : method === "POST"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-gray-500/20 text-gray-400"
            }`}
          >
            {method}
          </span>
          <code className="text-white font-mono">{endpoint}</code>
        </div>
        {method === "GET" && (
          <button
            onClick={handleTest}
            className="px-4 py-1.5 rounded text-sm font-medium 
              bg-blue-600 hover:bg-blue-700
              text-white transition-colors flex items-center gap-2"
          >
            Test Endpoint
          </button>
        )}
      </div>
      <p className="text-gray-400 mb-3">{description}</p>
      {example && (
        <div>
          <p className="text-gray-500 text-sm mb-2">Example Response:</p>
          <pre className="bg-gray-800/50 p-3 rounded overflow-x-auto">
            <code className="text-sm text-gray-300 font-mono">
              {JSON.stringify(example, null, 2)}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

const ApiEndpoints = () => {
  const [baseUrl, setBaseUrl] = useState("http://localhost:3006");

  // Load saved baseUrl from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("apiBaseUrl");
    if (saved) setBaseUrl(saved);
  }, []);

  // Save baseUrl to localStorage
  const handleBaseUrlChange = (newUrl) => {
    setBaseUrl(newUrl);
    localStorage.setItem("apiBaseUrl", newUrl);
  };

  const endpoints = [
    {
      method: "GET",
      endpoint: "/api/downloads",
      description: "Get all current downloads with custom formatting applied.",
      example: {
        total: 2,
        activities: [
          {
            uuid: "123",
            title: "Movie Title",
            progress: 45,
            formatted: {
              "Custom Format 1": "Movie Title - 45%",
            },
          },
        ],
      },
    },
    {
      method: "GET",
      endpoint: "/api/formats",
      description: "Get all configured format templates.",
      example: {
        downloads: [
          {
            name: "Custom Format 1",
            template: "{title} - {progress}%",
          },
        ],
      },
    },
    {
      method: "POST",
      endpoint: "/api/formats",
      description: "Save format templates.",
      example: {
        type: "downloads",
        formats: [
          {
            name: "Custom Format 1",
            template: "{title} - {progress}%",
          },
        ],
      },
    },
    {
      method: "GET",
      endpoint: "/api/sections",
      description: "Get all saved library sections.",
      example: {
        total: 2,
        sections: [
          {
            section_id: 1,
            type: "movie",
            name: "Movies",
          },
          {
            section_id: 2,
            type: "show",
            name: "TV Shows",
          },
        ],
      },
    },
    {
      method: "POST",
      endpoint: "/api/sections",
      description: "Save selected library sections.",
      example: [
        {
          section_id: 1,
          type: "movie",
          name: "Movies",
        },
        {
          section_id: 2,
          type: "show",
          name: "TV Shows",
        },
      ],
    },
    {
      method: "GET",
      endpoint: "/api/users",
      description: "Get users with activity and custom formatting.",
      example: {
        total: 1,
        users: [
          {
            user_id: 1,
            friendly_name: "John Doe",
            plays: 150,
            formatted: {
              "User Format 1": "John Doe - 150 plays",
            },
          },
        ],
      },
    },
    {
      method: "GET",
      endpoint: "/api/recent/:type",
      description:
        "Get recently added media for a specific type (movies, shows, music).",
      example: {
        total: 2,
        media: [
          {
            "Show Title": "Breaking Bad - S05E01 - Live Free or Die",
            raw_data: {
              title: "Live Free or Die",
              year: 2012,
              addedAt: "1625097600",
            },
          },
        ],
      },
    },
    {
      method: "GET",
      endpoint: "/api/libraries",
      description: "Get all Plex libraries.",
      example: [
        {
          section_id: 1,
          section_type: "movie",
          section_name: "Movies",
          count: 500,
        },
      ],
    },
    {
      method: "GET",
      endpoint: "/api/config",
      description: "Get current server configuration.",
      example: {
        plexUrl: "http://localhost:32400",
        tautulliUrl: "http://localhost:8181",
        hasPlexToken: true,
        hasTautulliKey: true,
      },
    },
    {
      method: "POST",
      endpoint: "/api/config",
      description: "Update server configuration.",
      example: {
        status: "ok",
        config: {
          plexUrl: "http://localhost:32400",
          tautulliUrl: "http://localhost:8181",
          hasPlexToken: true,
          hasTautulliKey: true,
        },
      },
    },
    {
      method: "POST",
      endpoint: "/api/reset-all",
      description: "Reset all configurations to default.",
      example: {
        status: "success",
        message: "All configurations reset successfully",
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Server URL Configuration */}
      <div className="bg-gray-700/30 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-medium text-white">
            Server Configuration
          </h3>
          <div className="flex items-center bg-gray-800/50 px-2 py-1 rounded">
            <span className="text-green-400 text-sm">●</span>
            <span className="text-gray-400 text-sm ml-2">Server Active</span>
          </div>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">
            API Server URL
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => handleBaseUrlChange(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500 font-mono text-sm"
            placeholder="http://localhost:3006"
          />
        </div>
      </div>

      {/* Endpoints Section */}
      <div>
        <h3 className="text-lg font-medium text-white mb-2">
          Available API Endpoints
        </h3>
        <p className="text-gray-400 mb-6">
          Use these endpoints to integrate with your applications.
        </p>

        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <EndpointCard key={index} {...endpoint} baseUrl={baseUrl} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiEndpoints;
