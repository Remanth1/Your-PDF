export interface ValidateInput {
  maxBytes: number;
  sizeBytes: number;
  sourceMime: string;
  targetMime: string;
}

export function validateInput(payload: ValidateInput): void {
  if (payload.sizeBytes > payload.maxBytes) {
    throw new Error(`File exceeds limit: ${payload.sizeBytes} > ${payload.maxBytes}`);
  }
  if (!payload.sourceMime || !payload.targetMime) {
    throw new Error("Missing conversion MIME information");
  }
}

export async function runVirusScanHook(inputPath: string): Promise<void> {
  // Hook point for ClamAV or external scanning service.
  // Keep as pass-through for now to avoid blocking MVP.
  void inputPath;
}
