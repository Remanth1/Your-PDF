import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import type { ConversionJobPayload } from "@fileforge/shared";
import { getConfig } from "./config";
import { runConversionJob } from "./job-runner";
import { incMetric, getMetricsSnapshot } from "./metrics";
import { logError, logInfo } from "./logger";

export function createQueueClients() {
  const cfg = getConfig();
  const connection = new IORedis(cfg.redisUrl);

  const queue = new Queue<ConversionJobPayload>(cfg.queueName, { connection });
  const worker = new Worker<ConversionJobPayload>(
    cfg.queueName,
    async (job) => {
      incMetric("jobs_started");
      await runConversionJob(job.data, cfg.jobTimeoutMs);
      incMetric("jobs_succeeded");
      return { ok: true };
    },
    {
      connection,
      concurrency: Number(process.env.WORKER_CONCURRENCY ?? 2)
    }
  );

  worker.on("completed", (job) => {
    logInfo("job_completed", { jobId: job.id, metrics: getMetricsSnapshot() });
  });

  worker.on("failed", (job, error) => {
    incMetric("jobs_failed");
    logError("job_failed", { jobId: job?.id, error: String(error), metrics: getMetricsSnapshot() });
  });

  return { queue, worker, connection };
}
