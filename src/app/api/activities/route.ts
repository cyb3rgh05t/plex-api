import { NextResponse } from "next/server";
import { PlexActivity } from "../../lib/types";
import { logger } from "../../lib/logger";

export async function GET(request: Request) {
  const plexToken = process.env.PLEX_TOKEN;
  const plexServer = process.env.PLEX_SERVER;

  logger.logRequest(request);

  try {
    logger.debug("Plex API request details", {
      server: plexServer,
      endpoint: "/activities",
    });

    const response = await fetch(
      `${plexServer}/activities?X-Plex-Token=${plexToken}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    logger.debug("Raw Plex API response", { data });

    const activities: PlexActivity[] = [];

    if (
      data?.MediaContainer?.Activity &&
      Array.isArray(data.MediaContainer.Activity)
    ) {
      activities.push(
        ...data.MediaContainer.Activity.map((activity: any) => {
          const mappedActivity = {
            title: activity.title || "Unknown Title",
            subtitle: activity.subtitle || "",
            progress:
              typeof activity.progress === "number" ? activity.progress : 0,
            type: activity.type || "unknown",
          };
          logger.debug("Mapped activity", {
            original: activity,
            mapped: mappedActivity,
          });
          return mappedActivity;
        })
      );
    } else {
      logger.warn("Unexpected Plex API response structure", { data });
    }

    logger.info("Activities fetched successfully", {
      count: activities.length,
      types: activities.map((a) => a.type),
    });

    logger.logResponse(200, { count: activities.length });
    return NextResponse.json(activities);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to fetch activities", {
      error: errorMessage,
      server: plexServer,
    });
    logger.logResponse(500, { error: errorMessage });
    return NextResponse.json({ activities: [] }, { status: 500 });
  }
}
