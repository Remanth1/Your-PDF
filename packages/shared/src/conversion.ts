export type ConversionTier = "local" | "queued";

export interface ConversionPair {
  source: string;
  target: string;
  tier: ConversionTier;
  engine: "libreoffice" | "ffmpeg" | "imagemagick" | "pdf-tools" | "tesseract" | "browser";
}

export const MVP_CONVERSION_PAIRS: ConversionPair[] = [
  { source: "application/pdf", target: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", tier: "queued", engine: "libreoffice" },
  { source: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", target: "application/pdf", tier: "queued", engine: "libreoffice" },
  { source: "image/jpeg", target: "image/png", tier: "local", engine: "browser" },
  { source: "image/png", target: "image/jpeg", tier: "local", engine: "browser" },
  { source: "video/mp4", target: "audio/mpeg", tier: "queued", engine: "ffmpeg" },
  { source: "application/pdf", target: "application/pdf+merge", tier: "queued", engine: "pdf-tools" },
  { source: "application/pdf", target: "application/pdf+split", tier: "queued", engine: "pdf-tools" },
  { source: "application/pdf", target: "application/pdf+compress", tier: "queued", engine: "pdf-tools" }
];

export function findConversionPair(source: string, target: string): ConversionPair | undefined {
  return MVP_CONVERSION_PAIRS.find((p) => p.source === source && p.target === target);
}
