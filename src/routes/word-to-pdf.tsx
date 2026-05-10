import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { JobPanel } from "@/components/JobPanel";
import { ToolShell } from "@/components/ToolShell";
import { useConversionJob } from "@/hooks/useConversionJob";

export const Route = createFileRoute("/word-to-pdf")({
  head: () => ({
    meta: [
      { title: "Word to PDF — Convert DOCX to PDF in your browser | Fileforge" },
      {
        name: "description",
        content:
          "Convert .docx Word documents to PDF locally in your browser. Free, private, no sign-up.",
      },
      { property: "og:title", content: "Word to PDF — Free & private" },
    ],
  }),
  component: WordToPdfPage,
});

function WordToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { state, run, reset } = useConversionJob();

  const start = () =>
    run(async (onProgress) => {
      const { wordToPdf } = await import("@/lib/converters/word-to-pdf");
      const blob = await wordToPdf(files[0], onProgress);
      return { blob, filename: files[0].name.replace(/\.docx?$/i, "") + ".pdf" };
    });

  return (
    <ToolShell
      title="Word to PDF"
      tagline="Convert .docx documents to PDF — without uploading."
      description="Best for text-focused documents (resumes, letters, reports). Highly complex layouts and embedded objects may reflow; for pixel-perfect output, export directly from Word."
      howItWorks={[
        "Drop a .docx file.",
        "Click Convert — rendering happens in your browser.",
        "Download the PDF.",
      ]}
      faqs={[
        { q: "Does .doc work?", a: "Only .docx is supported. Convert old .doc files in Word first." },
        { q: "Will my fonts match?", a: "We render with web-safe fonts. Custom fonts may differ slightly." },
        { q: "Is my document uploaded?", a: "No. Everything happens in the browser." },
      ]}
    >
      <Dropzone
        accept={{
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        }}
        files={files}
        onFiles={setFiles}
        hint=".docx only • up to 100 MB"
      />
      {state.status === "idle" ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={start} disabled={files.length !== 1}>
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
