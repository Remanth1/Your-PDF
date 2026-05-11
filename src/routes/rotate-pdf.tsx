import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { JobPanel } from "@/components/JobPanel";
import { SeoToolPage } from "@/components/SeoToolPage";
import { useConversionJob } from "@/hooks/useConversionJob";

export const Route = createFileRoute("/rotate-pdf")({
  head: () => ({
    meta: [
      { title: "Rotate PDF — Fix page orientation | Fileforge" },
      { name: "description", content: "Rotate one page or entire PDF documents with reliable output." },
    ],
  }),
  component: RotatePdfPage,
});

function RotatePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const { state, run, reset } = useConversionJob();

  const canRotate = useMemo(() => files.length === 1, [files]);

  const start = () =>
    run(async (onProgress) => {
      const { rotatePdf } = await import("@/lib/converters/pdf-basic");
      const blob = await rotatePdf(files[0], rotation, onProgress);
      return { blob, filename: `${files[0].name.replace(/\.pdf$/i, "")}-rotated-${rotation}.pdf` };
    });

  return (
    <SeoToolPage
      title="Rotate PDF"
      tagline="Correct sideways and upside-down pages quickly."
      description="Rotate selected pages or entire documents while preserving layout and text quality."
      faqs={[
        { q: "Can I rotate only some pages?", a: "This first release rotates the full document; per-page controls are next." },
        { q: "Will bookmarks stay intact?", a: "Document structure is preserved whenever possible." },
        { q: "Is it free?", a: "Core rotation workflows are part of the free tools." },
      ]}
    >
      <Dropzone
        accept={{ "application/pdf": [".pdf"] }}
        files={files}
        onFiles={setFiles}
        hint="One PDF only • rotate the full document"
      />

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="space-y-1 text-sm">
          <span className="block font-medium">Rotation</span>
          <select
            className="rounded-lg border border-border bg-background px-3 py-2"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value) as 90 | 180 | 270)}
          >
            <option value={90}>90° clockwise</option>
            <option value={180}>180°</option>
            <option value={270}>270° clockwise</option>
          </select>
        </label>
      </div>

      {state.status === "idle" ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={start} disabled={!canRotate}>
            Rotate PDF
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <JobPanel state={state} onReset={() => { reset(); setFiles([]); }} />
        </div>
      )}
    </SeoToolPage>
  );
}
