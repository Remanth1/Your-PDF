import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { JobPanel } from "@/components/JobPanel";
import { ToolShell } from "@/components/ToolShell";
import { useConversionJob } from "@/hooks/useConversionJob";

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

function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { state, run, reset } = useConversionJob();

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
        { q: "Can I reorder pages?", a: "Files merge in the order you add them. Remove and re-add to change order." },
      ]}
    >
      <Dropzone
        accept={{ "application/pdf": [".pdf"] }}
        multiple
        files={files}
        onFiles={setFiles}
        hint="PDF files only • up to 100 MB each"
      />
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
