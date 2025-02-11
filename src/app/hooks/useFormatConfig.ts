import { useState, useEffect } from "react";
import { FormatConfig } from "../lib/types";

export function useFormatConfig() {
  const [config, setConfig] = useState<FormatConfig>({
    variables: ["title", "subtitle", "progress", "type"],
    outputFormat: "{title} - {subtitle} ({progress}%)",
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        logClientSide("log", "Fetching format configuration...");
        const response = await fetch("/api/config");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        logClientSide("log", "Format config received", data);
        setConfig(data);
      } catch (error) {
        logClientSide("error", "Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  const saveConfig = async (newConfig: FormatConfig) => {
    try {
      logClientSide("log", "Saving new format configuration...", newConfig);
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      logClientSide("log", "Format config saved successfully");
      setConfig(newConfig);
    } catch (error) {
      logClientSide("error", "Error saving config:", error);
      throw error;
    }
  };

  return { config, saveConfig };
}
