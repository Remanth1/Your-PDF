import { NextResponse } from "next/server";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  // Replace with DB lookup in implementation phase.
  return NextResponse.json({
    jobId: id,
    status: "processing",
    progress: 35,
    downloadUrl: null
  });
}
