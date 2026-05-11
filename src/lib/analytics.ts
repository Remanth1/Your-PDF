export type AnalyticsEventName =
  | "landing_variant_view"
  | "landing_variant_click"
  | "tool_card_click"
  | "tool_start"
  | "tool_complete"
  | "tool_error";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  properties?: Record<string, unknown>;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    _fileforgeSessionId?: string;
  }
}

/**
 * Get or create a session ID for analytics tracking.
 */
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  if (!window._fileforgeSessionId) {
    // Try to restore from localStorage
    const stored = localStorage.getItem("_fileforge_session_id");
    if (stored) {
      window._fileforgeSessionId = stored;
    } else {
      // Generate new session ID (simple UUID v4 lookalike)
      window._fileforgeSessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("_fileforge_session_id", window._fileforgeSessionId);
    }
  }
  
  return window._fileforgeSessionId;
}

/**
 * Track an analytics event by:
 * 1. Posting to backend /api/analytics endpoint
 * 2. Pushing to Google Tag Manager dataLayer
 * 3. Dispatching custom event
 * 4. Falling back to localStorage if backend is unreachable
 */
export function trackEvent(
  name: AnalyticsEventName,
  properties: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined") return;

  const event: AnalyticsEvent = { name, properties };
  const sessionId = getSessionId();
  
  // Always push to dataLayer for GTM
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: event.name, ...event.properties });

  // Always dispatch custom event
  window.dispatchEvent(new CustomEvent("fileforge:analytics", { detail: event }));

  // Try to post to backend (non-blocking)
  postToBackend(name, properties, sessionId).catch(() => {
    // If backend fails, fall back to localStorage
    storeEventLocally(name, properties, sessionId);
  });
}

/**
 * Post event to /api/analytics endpoint.
 */
async function postToBackend(
  eventName: string,
  properties: Record<string, unknown>,
  sessionId: string
): Promise<void> {
  const response = await fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      properties,
      sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Analytics POST failed: ${response.status}`);
  }
}

/**
 * Store event in localStorage as fallback when backend is unavailable.
 */
function storeEventLocally(
  eventName: string,
  properties: Record<string, unknown>,
  sessionId: string
): void {
  try {
    const events = JSON.parse(localStorage.getItem("_fileforge_events_queue") || "[]");
    events.push({
      eventName,
      properties,
      sessionId,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("_fileforge_events_queue", JSON.stringify(events));
  } catch (e) {
    console.warn("Failed to store event in localStorage", e);
  }
}
