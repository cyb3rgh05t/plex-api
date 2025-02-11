import { NextResponse } from "next/server";
import { getConfig, saveConfig } from "../../config/format";
import { FormatConfig } from "../../lib/types";
import { logger } from "../../lib/logger";

export async function GET(request: Request) {
  logger.logRequest(request);

  try {
    logger.debug("Reading format configuration");
    const config = await getConfig();
    logger.debug("Configuration read successfully", { config });

    logger.logResponse(200, { config });
    return NextResponse.json(config);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to read config", { error: errorMessage });

    logger.logResponse(500, { error: errorMessage });
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

    logger.logResponse(200, { success: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to save config", { error: errorMessage });

    logger.logResponse(500, { error: errorMessage });
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 }
    );
  }
}
