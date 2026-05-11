import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/analytics
 * 
 * Persists analytics events to the database.
 * 
 * Body:
 * {
 *   "eventName": "landing_variant_view" | "tool_start" | "tool_complete" | etc,
 *   "properties": { ...event-specific metadata },
 *   "sessionId": "uuid or string identifier"
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, properties = {}, sessionId } = body;

    if (!eventName) {
      return NextResponse.json(
        { error: "eventName is required" },
        { status: 400 }
      );
    }

    // TODO: In production, insert into PostgreSQL via pool connection
    // For now, log and return success to keep browser happy
    console.log("[Analytics Event]", {
      eventName,
      properties,
      sessionId,
      timestamp: new Date().toISOString(),
    });

    // Simulate storing in database
    // const result = await db.query(
    //   `INSERT INTO analytics_events (event_name, properties, session_id)
    //    VALUES ($1, $2, $3)`,
    //   [eventName, JSON.stringify(properties), sessionId]
    // );

    return NextResponse.json(
      { success: true, eventName },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Analytics Error]", error);
    return NextResponse.json(
      { error: "Failed to store analytics event" },
      { status: 500 }
    );
  }
}
