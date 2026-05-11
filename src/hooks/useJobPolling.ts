import { useState, useEffect } from "react";

export interface JobStatus {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress?: number;
  downloadUrl?: string;
  error?: string;
}

/**
 * Hook to poll job status from the backend.
 * Polls /api/jobs/:jobId every 500ms until completion.
 */
export function useJobPolling(jobId: string | null) {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    setIsPolling(true);
    let isMounted = true;

    const poll = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error(`Job status fetch failed: ${response.status}`);
        }

        const data = await response.json() as JobStatus;
        if (isMounted) {
          setStatus(data);

          // Stop polling if job is done or failed
          if (data.status === "completed" || data.status === "failed") {
            setIsPolling(false);
          }
        }
      } catch (error) {
        console.error("Error polling job status:", error);
        if (isMounted) {
          setStatus({
            jobId,
            status: "failed",
            error: "Failed to fetch job status",
          });
          setIsPolling(false);
        }
      }
    };

    // Initial poll
    poll();

    // Set up interval
    const interval = isPolling ? setInterval(poll, 500) : undefined;

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [jobId, isPolling]);

  return { status, isPolling };
}
