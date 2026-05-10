import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { JobPanel } from "@/components/JobPanel";
import { ToolShell } from "@/components/ToolShell";
import { useConversionJob } from "@/hooks/useConversionJob";

export const Route = createFileRoute("/pdf-to-word")({
  head: () => ({
    meta: [
      { title: "PDF to Word — Convert PDF to DOCX in your browser | Fileforge" },
      {
        name: "description",
        content:
          "Extract text from PDF into an editable Word .docx file. Runs in your browser — no uploads, no sign-up.",
      },
      { property: "og:title", content: "PDF to Word — Free & private" },
    ],
  }),
  component: PdfToWordPage,
});

function PdfToWordPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { state, run, reset } = useConversionJob();

  const start = () =>
    run(async (onProgress) => {
      const { pdfToDocx } = await import("@/lib/converters/pdf-to-word");
      const blob = await pdfToDocx(files[0], onProgress);
      return { blob, filename: files[0].name.replace(/\.pdf$/i, "") + ".docx" };
    });

  return (
    <ToolShell
      title="PDF to Word"
      tagline="Extract text from PDF into an editable .docx file."
      description="We pull the text layer from your PDF and rebuild paragraphs into a Word document. Best for digitally-created PDFs. For scanned PDFs, use the OCR tool first."
      howItWorks={[
        "Drop a PDF.",
        "Click Convert — text is extracted in your browser.",
        "Download the .docx file.",
      ]}
      faqs={[
        { q: "Will the layout match exactly?", a: "Tables, columns and complex layouts may reflow. Text content is preserved." },
        { q: "Why is my output empty?", a: "The PDF likely has no text layer (it's a scan). Try the OCR tool first." },
        { q: "Is my file uploaded?", a: "No. Extraction runs locally." },
      ]}
    >
      <Dropzone
        accept={{ "application/pdf": [".pdf"] }}
        files={files}
        onFiles={setFiles}
        hint="One PDF • up to 100 MB"
      />
      {state.status === "idle" ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={start} disabled={files.length !== 1}>
            Convert to Word
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
