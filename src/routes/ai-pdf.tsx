import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { ToolShell } from "@/components/ToolShell";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/ai-pdf")({
  head: () => ({
    meta: [
      { title: "AI PDF Summarizer — Extract insights from PDFs | Fileforge" },
      {
        name: "description",
        content: "Summarize PDFs and extract table-like rows in your browser. Privacy-first and fast.",
      },
    ],
  }),
  component: AiPdfPage,
});

function AiPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    if (!files[0]) return;
    trackEvent("tool_start", { tool: "ai-pdf" });
    setLoading(true);
    setError(null);
    setSummary([]);
    setRows([]);

    try {
      const { extractPdfText, summarizeText, extractTableLikeRows } = await import("@/lib/ai/pdf-insights");
      const text = await extractPdfText(files[0], 12);
      const summaryResult = summarizeText(text, 5);
      setSummary(summaryResult);
      setRows(extractTableLikeRows(text));
      trackEvent("tool_complete", { tool: "ai-pdf", summaryCount: summaryResult.length });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze PDF");
      trackEvent("tool_error", { tool: "ai-pdf", error: e instanceof Error ? e.message : "Failed to analyze PDF" });
    } finally {
      setLoading(false);
    }
  };

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary.join("\n"));
    trackEvent("tool_complete", { tool: "ai-pdf", action: "copy-summary" });
  };

  const downloadRows = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-pdf-rows.json";
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("tool_complete", { tool: "ai-pdf", action: "download-rows" });
  };

  return (
    <ToolShell
      title="AI PDF Insights"
      tagline="Summarize and extract structured rows from PDFs in your browser."
      description="This first release focuses on local extraction and concise summaries for quick review workflows."
      howItWorks={[
        "Upload a text-based PDF.",
        "Run analysis to extract core points.",
        "Review summaries and table-like rows.",
      ]}
      faqs={[
        { q: "Is this private?", a: "Yes. Analysis is performed in-browser for this feature." },
        { q: "Does this work on scans?", a: "Scans need OCR first for best results." },
        { q: "Is this an LLM?", a: "This version uses deterministic local heuristics and extraction." },
      ]}
    >
      <Dropzone
        accept={{ "application/pdf": [".pdf"] }}
        files={files}
        onFiles={setFiles}
        hint="PDF only • best with digital text PDFs"
      />

      <div className="mt-4 flex justify-end">
        <Button onClick={start} disabled={files.length !== 1 || loading}>
          {loading ? "Analyzing..." : "Analyze PDF"}
        </Button>
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      {summary.length > 0 ? (
        <section className="mt-6 space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Summary</h2>
            <Button variant="outline" size="sm" onClick={copySummary}>
              Copy Summary
            </Button>
          </div>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {summary.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {rows.length > 0 ? (
        <section className="mt-4 space-y-3 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Extracted Rows (Preview)</h2>
            <Button variant="outline" size="sm" onClick={downloadRows}>
              Download Rows
            </Button>
          </div>
          <pre className="max-h-72 overflow-auto rounded-md bg-accent p-3 text-xs text-foreground">
            {JSON.stringify(rows.slice(0, 25), null, 2)}
          </pre>
        </section>
      ) : null}
    </ToolShell>
  );
}
