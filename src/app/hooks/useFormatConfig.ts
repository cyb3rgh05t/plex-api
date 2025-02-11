// src/app/hooks/useFormatConfig.ts
import { useState, useEffect } from "react";
import { FormatConfig } from "../lib/types";

export function useFormatConfig() {
  const [config, setConfig] = useState<FormatConfig>({
    variables: ["title", "subtitle", "progress", "type"],
    outputFormat: "{title} - {subtitle} ({progress}%)",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/config");
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };

  const saveConfig = async (newConfig: FormatConfig) => {
    try {
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });
      setConfig(newConfig);
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };

  return { config, saveConfig };
}
