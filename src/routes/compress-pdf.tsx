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

function CompressPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { state, run, reset } = useConversionJob();

  const start = () =>
    run(async (onProgress) => {
      const { compressPdf } = await import("@/lib/converters/pdf-basic");
      const blob = await compressPdf(files[0], onProgress);
      return { blob, filename: files[0].name.replace(/\.pdf$/i, "") + "-compressed.pdf" };
    });

  return (
    <ToolShell
      title="Compress PDF"
      tagline="Reduce PDF file size without uploading."
      description="We re-save your PDF with optimized object streams. This shrinks PDFs that contain redundant data; image-heavy PDFs see modest savings since deeper image recompression isn't run client-side."
      howItWorks={[
        "Drop a PDF.",
        "Click Compress — processing happens in your browser.",
        "Download the smaller file.",
      ]}
      faqs={[
        { q: "How much smaller will my file be?", a: "Varies. Text-heavy PDFs often shrink notably; image-heavy PDFs less so." },
        { q: "Is the file uploaded?", a: "No. Compression runs locally." },
        { q: "Will quality drop?", a: "No. This compression is lossless — only redundancy is removed." },
      ]}
    >
      <Dropzone
        accept={{ "application/pdf": [".pdf"] }}
        files={files}
        onFiles={setFiles}
        hint="One PDF at a time • up to 100 MB"
      />
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
