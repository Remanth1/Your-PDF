import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { randomUUID } from "node:crypto";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

// Simple in-memory job store (in production: use Redis/PostgreSQL)
interface JobRecord {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  sourceMime?: string;
  targetMime?: string;
  progress?: number;
  downloadUrl?: string;
  error?: string;
  createdAt: number;
}

const jobs = new Map<string, JobRecord>();

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Handle analytics API endpoint
      if (request.method === "POST" && pathname === "/api/analytics") {
        try {
          const body = await request.json();
          const { eventName, properties = {}, sessionId } = body;

          if (!eventName) {
            return new Response(
              JSON.stringify({ error: "eventName is required" }),
              { status: 400, headers: { "content-type": "application/json" } }
            );
          }

          // Log analytics event (in production, persist to database)
          console.log("[Analytics Event]", {
            eventName,
            properties,
            sessionId,
            timestamp: new Date().toISOString(),
          });

          return new Response(
            JSON.stringify({ success: true, eventName }),
            { status: 201, headers: { "content-type": "application/json" } }
          );
        } catch (error) {
          console.error("[Analytics Error]", error);
          return new Response(
            JSON.stringify({ error: "Failed to store analytics event" }),
            { status: 500, headers: { "content-type": "application/json" } }
          );
        }
      }

      // Handle job API endpoints
      if (pathname === "/api/jobs" && request.method === "POST") {
        try {
          const formData = await request.formData();
          const file = formData.get("file") as File;
          const sourceMime = formData.get("sourceMime") as string;
          const targetMime = formData.get("targetMime") as string;

          if (!file || !sourceMime || !targetMime) {
            return new Response(
              JSON.stringify({ error: "Missing file, sourceMime, or targetMime" }),
              { status: 400, headers: { "content-type": "application/json" } }
            );
          }

          const jobId = randomUUID();
          const job: JobRecord = {
            jobId,
            status: "queued",
            sourceMime,
            targetMime,
            progress: 0,
            createdAt: Date.now(),
          };

          jobs.set(jobId, job);

          // TODO: Queue to BullMQ / send to worker service
          console.log("[Job Queued]", { jobId, sourceMime, targetMime, fileSize: file.size });

          // Simulate job processing (in production: queue to worker)
          setTimeout(() => {
            const j = jobs.get(jobId);
            if (j) {
              j.status = "completed";
              j.progress = 100;
              j.downloadUrl = `/api/jobs/${jobId}/download`;
            }
          }, 2000);

          return new Response(
            JSON.stringify({
              jobId,
              status: "queued",
              message: "File queued for processing",
            }),
            { status: 202, headers: { "content-type": "application/json" } }
          );
        } catch (error) {
          console.error("[Job Creation Error]", error);
          return new Response(
            JSON.stringify({ error: "Failed to queue job" }),
            { status: 500, headers: { "content-type": "application/json" } }
          );
        }
      }

      // Handle job status check
      if (pathname.match(/^\/api\/jobs\/[^/]+$/) && request.method === "GET") {
        const jobId = pathname.split("/").pop();
        if (!jobId) {
          return new Response(
            JSON.stringify({ error: "Invalid job ID" }),
            { status: 400, headers: { "content-type": "application/json" } }
          );
        }

        const job = jobs.get(jobId);
        if (!job) {
          return new Response(
            JSON.stringify({ error: "Job not found" }),
            { status: 404, headers: { "content-type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify(job),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
