import type { ConversionJobPayload } from "@fileforge/shared";
import { findConversionPair } from "@fileforge/shared";
import { createDefaultRegistry } from "@fileforge/converters";
import { ensureOutputPath, getFileSize } from "./storage";
import { validateInput, runVirusScanHook } from "./security";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Job timed out after ${timeoutMs} ms`)), timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export async function runConversionJob(job: ConversionJobPayload, timeoutMs: number): Promise<void> {
  const pair = findConversionPair(job.sourceMime, job.targetMime);
  if (!pair) {
    throw new Error(`Unsupported conversion pair: ${job.sourceMime} -> ${job.targetMime}`);
  }

  const inputSize = await getFileSize(job.inputKey);
  validateInput({
    maxBytes: 500 * 1024 * 1024,
    sizeBytes: inputSize,
    sourceMime: job.sourceMime,
    targetMime: job.targetMime
  });

  await runVirusScanHook(job.inputKey);
  await ensureOutputPath(job.outputKey);

  const registry = createDefaultRegistry();
  await withTimeout(
    registry.convert({
      sourceMime: job.sourceMime,
      targetMime: job.targetMime,
      inputPath: job.inputKey,
      outputPath: job.outputKey,
      options: job.options
    }),
    timeoutMs
  );
}
