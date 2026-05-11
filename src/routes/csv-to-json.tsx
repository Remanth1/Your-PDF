import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Dropzone } from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { SeoToolPage } from "@/components/SeoToolPage";
import { csvToJson } from "@/lib/converters/tabular";
import { JobPanel } from "@/components/JobPanel";
import { useConversionJob } from "@/hooks/useConversionJob";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/csv-to-json")({
  head: () => ({
    meta: [
      { title: "CSV to JSON — Convert tabular files to objects | Fileforge" },
      { name: "description", content: "Convert CSV rows into JSON structures for APIs and apps." },
    ],
  }),
  component: CsvToJsonPage,
});

function CsvToJsonPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState(`name,role,team\nAda,Engineer,Platform\nLin,Designer,Product`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { state, run, reset } = useConversionJob();

  const canConvert = useMemo(() => input.trim().length > 0, [input]);

  const loadFile = async () => {
    if (!files[0]) return;
    setInput(await files[0].text());
  };

  const convert = () =>
    run(async (onProgress) => {
      setError(null);
      trackEvent("tool_start", { tool: "csv-to-json" });
      onProgress(20);
      try {
        const json = csvToJson(input);
        setOutput(json);
        onProgress(100);
        trackEvent("tool_complete", { tool: "csv-to-json", format: "json" });
        return { blob: new Blob([json], { type: "application/json" }), filename: "data.json" };
      } catch (e) {
        setError(e instanceof Error ? e.message : "CSV conversion failed");
        trackEvent("tool_error", { tool: "csv-to-json", error: e instanceof Error ? e.message : "CSV conversion failed" });
        throw e;
      }
    });

  return (
    <SeoToolPage
      title="CSV to JSON"
      tagline="Convert spreadsheet-like data into JSON quickly."
      description="Perfect for development pipelines and data API preparation."
      faqs={[
        { q: "Does it support headers?", a: "Yes, header-driven mapping is included in the conversion flow." },
        { q: "How are empty cells handled?", a: "Optional null conversion and empty-string handling are planned." },
        { q: "Can I convert large files?", a: "Larger sizes are supported with queued processing." },
      ]}
    >
      <Dropzone
        accept={{ "text/csv": [".csv"], "text/plain": [".csv", ".txt"] }}
        files={files}
        onFiles={setFiles}
        hint="CSV file or paste data below"
      />

      <div className="mt-4 space-y-3">
        <textarea
          className="min-h-56 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
          placeholder="Paste CSV content here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" onClick={loadFile} disabled={files.length !== 1}>
            Load File Into Editor
          </Button>
          <Button onClick={convert} disabled={!canConvert || state.status === "processing"}>
            Convert to JSON
          </Button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      {state.status === "done" ? <JobPanel state={state} onReset={() => { reset(); setOutput(""); setFiles([]); }} /> : null}

      {output ? (
        <section className="mt-6 space-y-3 rounded-xl border border-border bg-card p-4">
          <h2 className="text-lg font-semibold">JSON Output</h2>
          <pre className="max-h-72 overflow-auto rounded-md bg-accent p-3 text-xs text-foreground">{output}</pre>
        </section>
      ) : null}
    </SeoToolPage>
  );
}
