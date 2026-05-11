import { mkdir } from "node:fs/promises";
import { getConfig } from "./config";
import { createQueueClients } from "./queue";
import { cleanupExpiredFiles } from "./cleanup";
import { logInfo, logError } from "./logger";

async function main() {
  const cfg = getConfig();
  const tempDir = process.env.WORKER_TEMP_DIR ?? "./tmp";

  await mkdir(tempDir, { recursive: true });
  const { worker } = createQueueClients();

  setInterval(async () => {
    try {
      await cleanupExpiredFiles(tempDir, cfg.fileTtlMs);
    } catch (error) {
      logError("cleanup_tick_failed", { error: String(error) });
    }
  }, cfg.cleanupIntervalMs).unref();

  logInfo("worker_started", { queue: cfg.queueName, timeoutMs: cfg.jobTimeoutMs });

  const stop = async () => {
    logInfo("worker_stopping");
    await worker.close();
    process.exit(0);
  };

  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

main().catch((error) => {
  logError("worker_boot_failed", { error: String(error) });
  process.exit(1);
});
