import React from "react";

export const ApiEndpoints = () => {
  const endpoints = [
    {
      method: "POST",
      path: "/api/update",
      description: "Update activities and format",
      details:
        "Expects a JSON payload with 'activities' array and 'format' string. Used to update the server-side activities store.",
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
      description: "Retrieve current activities",
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
        </div>
      ))}
    </div>
  );
};
