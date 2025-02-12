import React, { useState } from "react";
import Logger from "../utils/logger";
import { useFormat } from "../context/FormatContext";

export const Settings = () => {
  const { format, setFormat } = useFormat(); // Get format and setFormat from context
  const [newFormat, setNewFormat] = useState("");

  const [availableVariables] = useState([
    { key: "uuid", description: "Unique identifier" },
    { key: "type", description: "Activity type" },
    { key: "title", description: "Activity title" },
    { key: "subtitle", description: "Media name" },
    { key: "progress", description: "Download progress" },
    { key: "cancellable", description: "Can be cancelled" },
    { key: "userID", description: "User ID" },
  ]);

  // Example data for preview
  const sampleActivity = {
    uuid: "1234-5678",
    type: "media.download",
    title: "Media download by Plex",
    subtitle: "Sample Movie",
    progress: 45,
    cancellable: 0,
    userID: 1,
  };

  const formatOutput = (format, activity) => {
    let output = format;
    Object.keys(activity).forEach((key) => {
      const regex = new RegExp(`{${key}}`, "g");
      output = output.replace(regex, activity[key]);
    });
    return output;
  };

  const handleSaveFormat = () => {
    if (newFormat.trim()) {
      setFormat(newFormat.trim()); // Use context's setFormat
      Logger.info("Format updated", { newFormat });
      setNewFormat("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Current Format
          </h3>
          <div className="space-y-2">
            <div className="bg-gray-700 p-3 rounded-lg text-white">
              Format: {format}
            </div>
            <div className="bg-gray-700 p-3 rounded-lg text-blue-400">
              Preview: {formatOutput(format, sampleActivity)}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Available Variables
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableVariables.map((variable) => (
              <div
                key={variable.key}
                className="bg-gray-700 p-3 rounded-lg text-white cursor-pointer hover:bg-gray-600"
                onClick={() => setNewFormat(newFormat + `{${variable.key}}`)}
                role="button"
                tabIndex={0}
              >
                <span className="font-mono text-blue-400">{`{${variable.key}}`}</span>
                <span className="ml-2 text-gray-300">
                  - {variable.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">New Format</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newFormat}
              onChange={(e) => setNewFormat(e.target.value)}
              placeholder="Example: {subtitle} - {progress}% ({title})"
              className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            {newFormat && (
              <div className="bg-gray-700 p-3 rounded-lg text-blue-400">
                Preview: {formatOutput(newFormat, sampleActivity)}
              </div>
            )}
            <div className="text-sm text-gray-400">
              Click on variables above to add them to your format
            </div>
            <button
              onClick={handleSaveFormat}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Format
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
