import { mkdir, rm, stat } from "node:fs/promises";
import { dirname } from "node:path";

export async function ensureOutputPath(path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
}

export async function getFileSize(path: string): Promise<number> {
  const s = await stat(path);
  return s.size;
}

export async function deleteFileIfExists(path: string): Promise<void> {
  await rm(path, { force: true });
}
