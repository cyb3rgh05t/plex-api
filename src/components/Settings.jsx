import React, { useState, useEffect } from "react";
import Logger from "../utils/logger";
import { useFormat } from "../context/FormatContext";

export const Settings = () => {
  const { format, setFormat } = useFormat();
  const [newFormat, setNewFormat] = useState("");
  const [status, setStatus] = useState(null); // Add status state for notifications
  const [isSaving, setIsSaving] = useState(false);

  const [availableVariables] = useState([
    { key: "uuid", description: "Unique identifier" },
    { key: "type", description: "Activity type" },
    { key: "title", description: "Activity title" },
    { key: "subtitle", description: "Media name" },
    { key: "progress", description: "Download progress" },
    { key: "cancellable", description: "Can be cancelled" },
    { key: "userID", description: "User ID" },
  ]);

  // Clear status after 5 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
      setIsSaving(true);
      try {
        setFormat(newFormat.trim());
        Logger.info("Format updated", { newFormat });
        setNewFormat("");
        setStatus({
          type: "success",
          message: "Format saved successfully!",
        });
      } catch (error) {
        setStatus({
          type: "error",
          message: "Failed to save format",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg p-6 space-y-6">
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

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Current Format
          </h3>
          <div className="space-y-2">
            <div className="bg-gray-700 p-3 rounded-lg text-white">
              {format}
            </div>
            <h4 className="text-md text-white mb-2">Preview</h4>
            <div className="bg-gray-700 p-3 rounded-lg text-blue-400">
              {formatOutput(format, sampleActivity)}
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
              <>
                <h4 className="text-md text-white mb-2">Preview</h4>
                <div className="bg-gray-700 p-3 rounded-lg text-blue-400">
                  {formatOutput(newFormat, sampleActivity)}
                </div>
              </>
            )}
            <div className="text-sm text-gray-400">
              Click on variables above to add them to your format
            </div>
            <button
              onClick={handleSaveFormat}
              disabled={isSaving || !newFormat.trim()}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
                ${
                  isSaving || !newFormat.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
            >
              {isSaving ? "Saving..." : "Save Format"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
