type LogLevel = "log" | "error" | "warn" | "debug";

export function logClientSide(level: LogLevel, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;

  if (typeof window !== "undefined") {
    if (data) {
      console[level](logMessage, data);
    } else {
      console[level](logMessage);
    }
  }
}
