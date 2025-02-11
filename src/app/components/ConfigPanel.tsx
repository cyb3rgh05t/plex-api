import React from "react";
import FormatEditor from "./FormatEditor";
import { useFormatConfig } from "../hooks/useFormatConfig";

export default function ConfigPanel() {
  const { config, saveConfig } = useFormatConfig();

  return (
    <div className="space-y-6 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold">Configuration</h2>
      <FormatEditor config={config} onSave={saveConfig} />
    </div>
  );
}
