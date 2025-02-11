// src/app/api/activities/route.ts
import { NextResponse } from "next/server";
import { PlexActivity } from "../../lib/types";

export async function GET() {
  const plexToken = process.env.PLEX_TOKEN;
  const plexServer = process.env.PLEX_SERVER;

  try {
    const response = await fetch(
      `${plexServer}/activities?X-Plex-Token=${plexToken}`
    );
    const data = await response.json();

    const activities: PlexActivity[] = data.MediaContainer.Activity.map(
      (activity: any) => ({
        title: activity.title,
        subtitle: activity.subtitle,
        progress: activity.progress,
        type: activity.type,
      })
    );

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching from Plex:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
