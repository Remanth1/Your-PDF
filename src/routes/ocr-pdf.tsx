import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { JobPanel } from "@/components/JobPanel";
import { ToolShell } from "@/components/ToolShell";
import { useConversionJob } from "@/hooks/useConversionJob";

export const Route = createFileRoute("/ocr-pdf")({
  head: () => ({
    meta: [
      { title: "OCR PDF — Make scanned PDFs searchable in your browser | Fileforge" },
      {
        name: "description",
        content:
          "Add a searchable text layer to scanned PDFs using OCR — runs entirely in your browser. Free and private.",
      },
      { property: "og:title", content: "OCR PDF — Free & private" },
    ],
  }),
  component: OcrPdfPage,
});

function OcrPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { state, run, reset } = useConversionJob();

  const start = () =>
    run(async (onProgress) => {
      const { ocrPdf } = await import("@/lib/converters/ocr-pdf");
      const blob = await ocrPdf(files[0], onProgress);
      return { blob, filename: files[0].name.replace(/\.pdf$/i, "") + "-ocr.pdf" };
    });

  return (
    <ToolShell
      title="OCR PDF"
      tagline="Make scanned PDFs searchable — without uploading."
      description="We render each page, run Tesseract OCR in your browser, and add an invisible text layer. The visual layout is preserved; you can search and copy text afterward. Limited to the first 20 pages and English in this build."
      howItWorks={[
        "Drop a scanned PDF.",
        "Click Run OCR — the OCR engine downloads on first use, then processes pages locally.",
        "Download the searchable PDF.",
      ]}
      faqs={[
        { q: "What languages are supported?", a: "English in this MVP. More languages can be added later." },
        { q: "Why is OCR slow?", a: "OCR is CPU-heavy and runs in your browser. Expect a few seconds per page." },
        { q: "Is my file uploaded?", a: "No. The OCR engine downloads to your browser; your PDF stays local." },
      ]}
    >
      <Dropzone
        accept={{ "application/pdf": [".pdf"] }}
        files={files}
        onFiles={setFiles}
        hint="Scanned PDF • first 20 pages • English"
      />
      {state.status === "idle" ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={start} disabled={files.length !== 1}>
            Run OCR
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
