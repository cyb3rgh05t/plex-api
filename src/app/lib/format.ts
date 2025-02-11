import fs from "fs";
import path from "path";
import { FormatConfig } from "./types";

const CONFIG_PATH = path.join(process.cwd(), "src/data/format-config.json");

export async function getConfig(): Promise<FormatConfig> {
  try {
    const data = await fs.promises.readFile(CONFIG_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Return default config if file doesn't exist
    return {
      variables: ["title", "subtitle", "progress", "type"],
      outputFormat: "{title} - {subtitle} ({progress}%)",
    };
  }
}

export async function saveConfig(config: FormatConfig): Promise<void> {
  await fs.promises.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
}
