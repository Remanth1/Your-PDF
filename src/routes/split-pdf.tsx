import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { SeoToolPage } from "@/components/SeoToolPage";
import { Progress } from "@/components/ui/progress";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/split-pdf")({
  head: () => ({
    meta: [
      { title: "Split PDF — Extract specific pages | Fileforge" },
      { name: "description", content: "Split PDFs into selected page ranges quickly and securely." },
    ],
  }),
  component: SplitPdfPage,
});

function SplitPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pagesPerFile, setPagesPerFile] = useState(5);
  const [progress, setProgress] = useState(0);
  const [downloads, setDownloads] = useState<Array<{ filename: string; url: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSplit = useMemo(() => files.length === 1 && pagesPerFile >= 1, [files, pagesPerFile]);

  const start = () =>
    void (async () => {
      if (!files[0]) return;
      setLoading(true);
      setError(null);
      setDownloads([]);
      setProgress(0);
      trackEvent("tool_start", { tool: "split-pdf", mode: "multi-split" });

      try {
        const { splitPdfIntoChunks } = await import("@/lib/converters/pdf-basic");
        const outputs = await splitPdfIntoChunks(files[0], pagesPerFile, setProgress);
        const mapped = outputs.map((chunk) => ({
          filename: chunk.filename,
          url: URL.createObjectURL(chunk.blob),
        }));
        setDownloads(mapped);
        trackEvent("tool_complete", { tool: "split-pdf", files: mapped.length, pagesPerFile });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to split PDF";
        setError(message);
        trackEvent("tool_error", { tool: "split-pdf", error: message });
      } finally {
        setLoading(false);
      }
    })();

  const setPreset = (preset: number) => {
    setPagesPerFile(preset);
    trackEvent("landing_variant_click", { tool: "split-pdf", preset });
  };

  return (
    <SeoToolPage
      title="Split PDF"
      tagline="Split large PDFs into multiple smaller files in seconds."
      description="Split reports, contracts, and books into batches of pages, entirely in your browser."
      faqs={[
        { q: "Can I split into multiple files?", a: "Yes, set a pages-per-file chunk size and download the generated files individually." },
        { q: "Does it keep quality?", a: "Yes. Splitting preserves page fidelity." },
        { q: "Do you store my files?", a: "No permanent storage; files are temporary only." },
      ]}
    >
      <Dropzone
        accept={{ "application/pdf": [".pdf"] }}
        files={files}
        onFiles={setFiles}
        hint="One PDF only • split into multiple files"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="space-y-1 text-sm">
          <span className="block font-medium">Pages per file</span>
          <input
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            type="number"
            min={1}
            value={pagesPerFile}
            onChange={(e) => setPagesPerFile(Number(e.target.value) || 1)}
          />
        </label>
        <div className="flex flex-wrap items-end gap-2">
          {[1, 5, 10].map((preset) => (
            <Button key={preset} variant="outline" onClick={() => setPreset(preset)}>
              {preset} per file
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {loading ? <Progress value={progress} /> : null}
        <div className="flex justify-end">
          <Button onClick={start} disabled={!canSplit}>
            Split PDF
          </Button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      {downloads.length > 0 ? (
        <section className="mt-6 space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Split Files</h2>
            <Button variant="outline" size="sm" onClick={() => { downloads.forEach((item) => URL.revokeObjectURL(item.url)); setDownloads([]); setFiles([]); }}>
              Reset
            </Button>
          </div>
          <ul className="space-y-2">
            {downloads.map((item) => (
              <li key={item.filename} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
                <span className="truncate text-sm">{item.filename}</span>
                <a className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground" href={item.url} download={item.filename}>
                  Download
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </SeoToolPage>
  );
}
