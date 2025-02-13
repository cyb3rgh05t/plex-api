import React from "react";

export const ApiEndpoints = () => {
  const frontendUrl = window.location.origin;

  const handleTryEndpoint = (path) => {
    window.open(`${frontendUrl}${path}`, "_blank");
  };

  const endpoints = [
    {
      method: "GET",
      path: "/api/plex/activities",
      description: "Fetch Plex download activities",
      details:
        "Retrieves current download activities from your Plex server using stored configuration.",
      responseFormat: {
        type: "application/xml",
        description:
          "Raw XML response from Plex server containing activity data",
      },
    },
    {
      method: "POST",
      path: "/api/config",
      description: "Save Plex configuration",
      details: "Saves or updates the Plex server configuration.",
      requestBody: {
        serverUrl: "Plex server URL (e.g., http://your-plex-server:32400)",
        token: "Your Plex authentication token",
      },
      successResponse: {
        success: true,
      },
    },
    {
      method: "GET",
      path: "/api/config",
      description: "Get current Plex configuration",
      details: "Retrieves the current Plex server configuration.",
      responseFormat: {
        serverUrl: "Current Plex server URL",
        token: "Current Plex token",
      },
    },
    {
      method: "POST",
      path: "/api/test-connection",
      description: "Test Plex connection",
      details: "Tests the connection to Plex server with provided credentials.",
      requestBody: {
        serverUrl: "Plex server URL to test",
        token: "Plex token to test",
      },
      successResponse: {
        success: true,
      },
    },
    {
      method: "POST",
      path: "/api/update",
      description: "Update activities and format",
      details:
        "Updates the server-side activities store and formatting template.",
      requestBody: {
        activities: "Array of activity objects",
        format: "String template for formatting activities",
      },
      successResponse: {
        success: true,
        message: "Updated activities count",
      },
    },
    {
      method: "GET",
      path: "/api/activities",
      description: "Retrieve formatted activities",
      details:
        "Returns a list of activities with both raw and formatted outputs based on the current format.",
      responseFormat: [
        {
          formatted: "String formatted according to current format template",
          raw: "Original activity object",
        },
      ],
    },
    {
      method: "GET",
      path: "/api/debug",
      description: "Debug endpoint (development only)",
      details:
        "Provides information about current server state, available endpoints, and configuration.",
      responseExample: {
        endpoints: "List of available API endpoints",
        currentState: {
          activitiesCount: "Number of current activities",
          hasFormat: "Whether a format is set",
          format: "Current formatting template",
        },
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">API Endpoints</h2>

      {/* Frontend URL Card */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Frontend URL</h3>
        <div className="flex items-center bg-gray-900 p-3 rounded">
          <code className="text-blue-400 flex-grow">{frontendUrl}</code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(frontendUrl);
            }}
            className="ml-4 px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            title="Copy to clipboard"
          >
            Copy
          </button>
        </div>
        <p className="text-gray-400 mt-2 text-sm">
          Base URL for all API endpoints
        </p>
      </div>

      {endpoints.map((endpoint, index) => (
        <div
          key={endpoint.path}
          className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg"
        >
          <div className="flex items-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium mr-3 
                ${
                  endpoint.method === "POST"
                    ? "bg-green-600 text-white"
                    : endpoint.method === "GET"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 text-white"
                }`}
            >
              {endpoint.method}
            </span>
            <code className="text-blue-400 bg-gray-900 px-2 py-1 rounded">
              {endpoint.path}
            </code>
            {endpoint.method === "GET" && (
              <button
                onClick={() => handleTryEndpoint(endpoint.path)}
                className="ml-4 px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors flex items-center"
                title="Try this endpoint"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Check Response
              </button>
            )}
          </div>

          <p className="text-gray-300 mb-4">{endpoint.description}</p>

          {endpoint.details && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Details</h4>
              <p className="text-gray-400">{endpoint.details}</p>
            </div>
          )}

          {endpoint.requestBody && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Request Body</h4>
              <pre className="bg-gray-900 p-3 rounded text-blue-300">
                {JSON.stringify(endpoint.requestBody, null, 2)}
              </pre>
            </div>
          )}

          {endpoint.responseFormat && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Response Format</h4>
              <pre className="bg-gray-900 p-3 rounded text-blue-300">
                {JSON.stringify(endpoint.responseFormat, null, 2)}
              </pre>
            </div>
          )}

          {endpoint.responseExample && (
            <div>
              <h4 className="text-white font-semibold mb-2">
                Response Example
              </h4>
              <pre className="bg-gray-900 p-3 rounded text-blue-300">
                {JSON.stringify(endpoint.responseExample, null, 2)}
              </pre>
            </div>
          )}

          {endpoint.successResponse && (
            <div>
              <h4 className="text-white font-semibold mb-2">
                Success Response
              </h4>
              <pre className="bg-gray-900 p-3 rounded text-blue-300">
                {JSON.stringify(endpoint.successResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
