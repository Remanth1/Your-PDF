export interface WorkerConfig {
  redisUrl: string;
  queueName: string;
  jobTimeoutMs: number;
  cleanupIntervalMs: number;
  fileTtlMs: number;
}

export function getConfig(): WorkerConfig {
  return {
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
    queueName: process.env.QUEUE_NAME ?? "conversions",
    jobTimeoutMs: Number(process.env.JOB_TIMEOUT_MS ?? 5 * 60 * 1000),
    cleanupIntervalMs: Number(process.env.CLEANUP_INTERVAL_MS ?? 5 * 60 * 1000),
    fileTtlMs: Number(process.env.FILE_TTL_MS ?? 60 * 60 * 1000)
  };
}
