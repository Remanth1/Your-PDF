import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { findConversionPair } from "@fileforge/shared";

interface Body {
  sourceMime?: string;
  targetMime?: string;
  inputKey?: string;
  options?: Record<string, unknown>;
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  if (!body.sourceMime || !body.targetMime || !body.inputKey) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const pair = findConversionPair(body.sourceMime, body.targetMime);
  if (!pair) {
    return NextResponse.json({ error: "Unsupported conversion pair" }, { status: 422 });
  }

  const jobId = randomUUID();

  // Queue enqueue hook goes here (BullMQ or HTTP to worker-service).
  return NextResponse.json(
    {
      jobId,
      status: "queued",
      tier: pair.tier,
      engine: pair.engine,
      downloadUrl: null
    },
    { status: 201 }
  );
}
