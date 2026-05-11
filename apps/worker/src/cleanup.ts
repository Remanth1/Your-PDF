import { readdir, stat, rm } from "node:fs/promises";
import { join } from "node:path";
import { logInfo, logError } from "./logger";

export async function cleanupExpiredFiles(directory: string, ttlMs: number): Promise<number> {
  const now = Date.now();
  let removed = 0;

  const entries = await readdir(directory, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isFile()) continue;
    const full = join(directory, e.name);
    try {
      const s = await stat(full);
      if (now - s.mtimeMs > ttlMs) {
        await rm(full, { force: true });
        removed += 1;
      }
    } catch (error) {
      logError("cleanup_failed", { file: full, error: String(error) });
    }
  }

  logInfo("cleanup_finished", { removed });
  return removed;
}
