export type JobStatus = "queued" | "processing" | "done" | "failed";

export interface CreateJobRequest {
  sourceMime: string;
  targetMime: string;
  inputKey: string;
  outputKey: string;
  options?: Record<string, unknown>;
  userId?: string;
}

export interface ConversionJobPayload extends CreateJobRequest {
  jobId: string;
  createdAt: string;
  attempt: number;
}
