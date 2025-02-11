// src/app/lib/logger.ts
import fs from "fs";
import path from "path";

type LogLevel = "info" | "error" | "warn" | "debug";

class Logger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), "logs");
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` | ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}\n`;
  }

  private writeLog(level: LogLevel, message: string, meta?: any) {
    const formattedMessage = this.formatMessage(level, message, meta);
    const logFile = path.join(this.logDir, `${level}.log`);
    const combinedLogFile = path.join(this.logDir, "combined.log");

    // Write to level-specific log file
    fs.appendFileSync(logFile, formattedMessage);
    // Write to combined log file
    fs.appendFileSync(combinedLogFile, formattedMessage);

    // Also output to console in development
    if (process.env.NODE_ENV !== "production") {
      console.log(formattedMessage);
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
    if (process.env.NODE_ENV !== "production") {
      this.writeLog("debug", message, meta);
    }
  }
}

export const logger = new Logger();
