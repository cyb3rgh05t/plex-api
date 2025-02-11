// src/app/lib/logger.ts
import fs from "fs";
import path from "path";

type LogLevel = "info" | "error" | "warn" | "debug";

class Logger {
  private logDir: string;
  private debugEnabled: boolean;

  constructor() {
    this.logDir = path.join(process.cwd(), "logs");
    this.debugEnabled = true; // Always enable debug logging
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta
      ? ` | ${JSON.stringify(meta, this.getCircularReplacer())}`
      : "";
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}\n`;
  }

  private getCircularReplacer() {
    const seen = new WeakSet();
    return (key: string, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    };
  }

  private writeLog(level: LogLevel, message: string, meta?: any) {
    try {
      const formattedMessage = this.formatMessage(level, message, meta);
      const logFile = path.join(this.logDir, `${level}.log`);
      const combinedLogFile = path.join(this.logDir, "combined.log");

      // Write to level-specific log file
      fs.appendFileSync(logFile, formattedMessage);
      // Write to combined log file
      fs.appendFileSync(combinedLogFile, formattedMessage);

      // Always output to console
      const consoleMethod =
        level === "error"
          ? "error"
          : level === "warn"
          ? "warn"
          : level === "debug"
          ? "debug"
          : "log";
      console[consoleMethod](formattedMessage.trim());
    } catch (error) {
      console.error("Error writing to log file:", error);
    }
  }

  info(message: string, meta?: any) {
    this.writeLog("info", message, meta);
  }

  error(message: string, meta?: any) {
    this.writeLog("error", message, meta);
  }

  warn(message: string, meta?: any) {
    this.writeLog("warn", message, meta);
  }

  debug(message: string, meta?: any) {
    if (this.debugEnabled) {
      this.writeLog("debug", message, meta);
    }
  }

  // Utility method to log request details
  logRequest(req: Request, extra?: any) {
    this.debug("API Request", {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers),
      ...extra,
    });
  }

  // Utility method to log response details
  logResponse(status: number, body: any, extra?: any) {
    this.debug("API Response", {
      status,
      body,
      ...extra,
    });
  }
}

export const logger = new Logger();
