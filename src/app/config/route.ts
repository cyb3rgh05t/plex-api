import { NextResponse } from "next/server";
import { getConfig, saveConfig } from "@/app/lib/format";
import { FormatConfig } from "@/app/lib/types";
import { logger } from "@/app/lib/logger";

export async function GET(request: Request) {
  logger.logRequest(request);

  try {
    logger.debug("Reading format configuration");
    const config = await getConfig();
    logger.debug("Configuration read successfully", { config });
    return NextResponse.json(config);
  } catch (error) {
    logger.error("Failed to read config", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to read config" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  logger.logRequest(request);

  try {
    const config: FormatConfig = await request.json();
    logger.debug("Saving new configuration", { config });

    await saveConfig(config);
    logger.info("Configuration saved successfully", { config });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to save config", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 }
    );
  }
}
