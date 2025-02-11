// src/app/components/FormatEditor.tsx
import { useState } from "react";
import { FormatConfig } from "../lib/types";

export default function FormatEditor({
  config,
  onSave,
}: {
  config: FormatConfig;
  onSave: (config: FormatConfig) => void;
}) {
  const [format, setFormat] = useState(config.outputFormat);
  const availableVariables = ["title", "subtitle", "progress", "type"];

  const handleSave = () => {
    onSave({
      variables: availableVariables,
      outputFormat: format,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Available Variables
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableVariables.map((variable) => (
            <span
              key={variable}
              className="px-2 py-1 bg-gray-700 rounded text-gray-200"
            >
              {variable}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Output Format</h3>
        <textarea
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full h-32 bg-gray-800 text-white p-2 rounded-lg"
          placeholder="Enter your format (e.g., {title} - {progress}%)"
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Format
      </button>
    </div>
  );
}
