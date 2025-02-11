import { NextResponse } from "next/server";
import { PlexActivity } from "../../lib/types";
import { logger } from "../../lib/logger";

export async function GET() {
  const plexToken = process.env.PLEX_TOKEN;
  const plexServer = process.env.PLEX_SERVER;

  try {
    logger.info("Fetching activities from Plex server", { server: plexServer });

    const response = await fetch(
      `${plexServer}/activities?X-Plex-Token=${plexToken}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Add null checks and proper type handling
    const activities: PlexActivity[] = [];

    if (
      data?.MediaContainer?.Activity &&
      Array.isArray(data.MediaContainer.Activity)
    ) {
      activities.push(
        ...data.MediaContainer.Activity.map((activity: any) => ({
          title: activity.title || "Unknown Title",
          subtitle: activity.subtitle || "",
          progress:
            typeof activity.progress === "number" ? activity.progress : 0,
          type: activity.type || "unknown",
        }))
      );
    }

    logger.info("Successfully fetched activities", {
      count: activities.length,
    });
    return NextResponse.json(activities);
  } catch (error) {
    logger.error("Error fetching from Plex", {
      error: error instanceof Error ? error.message : "Unknown error",
      server: plexServer,
    });
    return NextResponse.json({ activities: [] }); // Return empty array instead of error
  }
}
