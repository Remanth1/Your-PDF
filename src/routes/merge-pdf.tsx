import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { JobPanel } from "@/components/JobPanel";
import { ToolShell } from "@/components/ToolShell";
import { useConversionJob } from "@/hooks/useConversionJob";
import { ChevronUp, ChevronDown, X } from "lucide-react";

export const Route = createFileRoute("/merge-pdf")({
  head: () => ({
    meta: [
      { title: "Merge PDF — Combine PDF files in your browser | Fileforge" },
      {
        name: "description",
        content:
          "Merge multiple PDF files into one — for free, with no uploads. Files stay in your browser. No sign-up required.",
      },
      { property: "og:title", content: "Merge PDF — Free & private" },
      { property: "og:description", content: "Combine PDFs in your browser. No uploads, no sign-up." },
    ],
  }),
  component: MergePdfPage,
});

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { state, run, reset } = useConversionJob();

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  const moveFile = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === files.length - 1)) {
      return;
    }
    const newFiles = [...files];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newFiles[index], newFiles[swapIndex]] = [newFiles[swapIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const start = () =>
    run(async (onProgress) => {
      const { mergePdfs } = await import("@/lib/converters/pdf-basic");
      const blob = await mergePdfs(files, onProgress);
      return { blob, filename: "merged.pdf" };
    });

  return (
    <ToolShell
      title="Merge PDF"
      tagline="Combine multiple PDFs into one — entirely in your browser."
      description="Upload two or more PDF files and we'll stitch them together in the order you select. Drag to reorder by removing and re-adding files."
      howItWorks={[
        "Drop or select the PDFs you want to merge.",
        "Click Merge — we'll combine them in your browser.",
        "Download the result. Nothing was uploaded anywhere.",
      ]}
      faqs={[
        { q: "Are my files uploaded?", a: "No. Merging happens entirely in your browser using JavaScript. Files never leave your device." },
        { q: "How many PDFs can I merge?", a: "As many as your browser memory allows — typically dozens of small PDFs without issue." },
        { q: "Can I reorder pages?", a: "Use the up/down arrows below to reorder files before merging." },
      ]}
    >
      <Dropzone
        accept={{ "application/pdf": [".pdf"] }}
        multiple
        files={files}
        onFiles={setFiles}
        hint="PDF files only • up to 100 MB each"
      />

      {/* File List with Reordering */}
      {files.length > 0 && state.status === "idle" && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Files ({files.length})</h3>
            <span className="text-xs text-muted-foreground">Total: {formatFileSize(totalSize)}</span>
          </div>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveFile(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed rounded"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFile(idx, "down")}
                    disabled={idx === files.length - 1}
                    className="p-1 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed rounded"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 hover:bg-background rounded text-destructive hover:text-destructive"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.status === "idle" ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={start} disabled={files.length < 2}>
            Merge {files.length || ""} PDFs
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
