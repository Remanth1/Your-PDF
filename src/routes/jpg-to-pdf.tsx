import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { JobPanel } from "@/components/JobPanel";
import { ToolShell } from "@/components/ToolShell";
import { useConversionJob } from "@/hooks/useConversionJob";

export const Route = createFileRoute("/jpg-to-pdf")({
  head: () => ({
    meta: [
      { title: "JPG to PDF — Convert images to PDF in your browser | Fileforge" },
      {
        name: "description",
        content:
          "Turn JPG and PNG images into a single PDF — free, private, no uploads. Each image becomes a page.",
      },
      { property: "og:title", content: "JPG to PDF — Free & private" },
    ],
  }),
  component: JpgToPdfPage,
});

function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { state, run, reset } = useConversionJob();

  const start = () =>
    run(async (onProgress) => {
      const { imagesToPdf } = await import("@/lib/converters/pdf-basic");
      const blob = await imagesToPdf(files, onProgress);
      return { blob, filename: "images.pdf" };
    });

  return (
    <ToolShell
      title="JPG to PDF"
      tagline="Combine JPG and PNG images into a single PDF, in order."
      description="Each image becomes a page sized to fit it. Useful for scanning receipts, photos of documents, or building photo albums."
      howItWorks={[
        "Drop the images you want in your PDF.",
        "Click Convert — we'll bundle them into one PDF locally.",
        "Download the result.",
      ]}
      faqs={[
        { q: "Which formats are supported?", a: "JPG and PNG. Each becomes one page." },
        { q: "Is my data sent anywhere?", a: "No. The conversion runs in your browser." },
        { q: "Can I change page order?", a: "Files are added in order. Remove and re-add to reorder." },
      ]}
    >
      <Dropzone
        accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
        multiple
        files={files}
        onFiles={setFiles}
        hint="JPG or PNG • up to 100 MB each"
      />
      {state.status === "idle" ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={start} disabled={files.length === 0}>
            Convert to PDF
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
