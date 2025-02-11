// src/app/lib/utils.ts
import { PlexActivity, FormatConfig } from "./types";

export function formatActivity(activity: PlexActivity, format: string): string {
  return format.replace(/{(\w+)}/g, (match, key) => {
    return String(activity[key as keyof PlexActivity] ?? match);
  });
}

export function validateFormat(format: string, variables: string[]): boolean {
  const usedVariables =
    format.match(/{(\w+)}/g)?.map((v) => v.slice(1, -1)) ?? [];
  return usedVariables.every((v) => variables.includes(v));
}
