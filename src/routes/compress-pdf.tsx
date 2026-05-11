import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { JobPanel } from "@/components/JobPanel";
import { ToolShell } from "@/components/ToolShell";
import { useConversionJob } from "@/hooks/useConversionJob";

export const Route = createFileRoute("/compress-pdf")({
  head: () => ({
    meta: [
      { title: "Compress PDF — Shrink PDF size in your browser | Fileforge" },
      {
        name: "description",
        content:
          "Reduce the size of PDF files locally in your browser. Free, private, no uploads.",
      },
      { property: "og:title", content: "Compress PDF — Free & private" },
    ],
  }),
  component: CompressPdfPage,
});

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

type QualityPreset = "low" | "medium" | "high";

function CompressPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState<QualityPreset>("medium");
  const { state, run, reset } = useConversionJob();

  const qualityDescriptions: Record<QualityPreset, string> = {
    low: "Maximum compression — may reduce image quality",
    medium: "Balanced — slight quality loss for good compression",
    high: "Minimal compression — preserves quality",
  };

  const start = () =>
    run(async (onProgress) => {
      const { compressPdf } = await import("@/lib/converters/pdf-basic");
      const blob = await compressPdf(files[0], onProgress, quality);
      return { blob, filename: files[0].name.replace(/\.pdf$/i, "") + "-compressed.pdf" };
    });

  const estimatedReduction: Record<QualityPreset, number> = {
    low: 0.40,
    medium: 0.25,
    high: 0.10,
  };

  const estimatedSize = files.length > 0 ? Math.round(files[0].size * (1 - estimatedReduction[quality])) : 0;

  return (
    <ToolShell
      title="Compress PDF"
      tagline="Reduce PDF file size without uploading."
      description="We re-save your PDF with optimized object streams. This shrinks PDFs that contain redundant data; image-heavy PDFs see modest savings since deeper image recompression isn't run client-side."
      howItWorks={[
        "Drop a PDF.",
        "Select a quality preset.",
        "Click Compress — processing happens in your browser.",
        "Download the smaller file.",
      ]}
      faqs={[
        { q: "How much smaller will my file be?", a: "Varies. Text-heavy PDFs often shrink notably; image-heavy PDFs less so. The quality preset affects expected savings." },
        { q: "Is the file uploaded?", a: "No. Compression runs locally." },
        { q: "Will quality drop?", a: "Not with 'High' quality. 'Medium' may have slight image reduction; 'Low' prioritizes size." },
      ]}
    >
      <Dropzone
        accept={{ "application/pdf": [".pdf"] }}
        files={files}
        onFiles={setFiles}
        hint="One PDF at a time • up to 100 MB"
      />

      {/* Quality Presets */}
      {files.length === 1 && state.status === "idle" && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">File Size</h3>
            <div className="text-xs text-muted-foreground text-right">
              <p>Original: <span className="font-medium">{formatFileSize(files[0].size)}</span></p>
              <p>Estimated: <span className="font-medium text-foreground">{formatFileSize(estimatedSize)}</span></p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Compression Level</h3>
            <div className="space-y-2">
              {(["low", "medium", "high"] as QualityPreset[]).map((preset) => (
                <label
                  key={preset}
                  className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                    quality === preset
                      ? "border-primary bg-primary/5"
                      : "border-input hover:border-foreground/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="quality"
                      value={preset}
                      checked={quality === preset}
                      onChange={() => setQuality(preset)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-medium capitalize">{preset} — {qualityDescriptions[preset]}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {state.status === "idle" ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={start} disabled={files.length !== 1}>
            Compress
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <JobPanel state={state} onReset={() => { reset(); setFiles([]); }} />
        </div>
      )}
    </ToolShell>
  );
}
