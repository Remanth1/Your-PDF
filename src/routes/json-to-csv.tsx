import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Dropzone } from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import { SeoToolPage } from "@/components/SeoToolPage";
import { jsonToCsv } from "@/lib/converters/tabular";
import { JobPanel } from "@/components/JobPanel";
import { useConversionJob } from "@/hooks/useConversionJob";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/json-to-csv")({
  head: () => ({
    meta: [
      { title: "JSON to CSV — Export structured data | Fileforge" },
      { name: "description", content: "Flatten JSON objects and export clean CSV files for analytics." },
    ],
  }),
  component: JsonToCsvPage,
});

function JsonToCsvPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState(`[
  {"name": "Ada", "role": "Engineer", "team": "Platform"},
  {"name": "Lin", "role": "Designer", "team": "Product"}
]`);
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
      trackEvent("tool_start", { tool: "json-to-csv" });
      onProgress(20);
      try {
        const csv = jsonToCsv(input);
        setOutput(csv);
        onProgress(100);
        trackEvent("tool_complete", { tool: "json-to-csv", format: "csv" });
        return { blob: new Blob([csv], { type: "text/csv" }), filename: "data.csv" };
      } catch (e) {
        setError(e instanceof Error ? e.message : "JSON conversion failed");
        trackEvent("tool_error", { tool: "json-to-csv", error: e instanceof Error ? e.message : "JSON conversion failed" });
        throw e;
      }
    });

  return (
    <SeoToolPage
      title="JSON to CSV"
      tagline="Transform JSON arrays into spreadsheet-ready CSV."
      description="Useful for analytics workflows, BI imports, and spreadsheet collaboration."
      faqs={[
        { q: "Do nested fields work?", a: "Nested flattening options are being added progressively." },
        { q: "Can I map columns?", a: "Column mapping controls are planned next." },
        { q: "Is data private?", a: "Sensitive data handling follows strict temporary processing." },
      ]}
    >
      <Dropzone
        accept={{ "application/json": [".json"] }}
        files={files}
        onFiles={setFiles}
        hint="JSON file or paste data below"
      />

      <div className="mt-4 space-y-3">
        <textarea
          className="min-h-56 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
          placeholder="Paste JSON array or object here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" onClick={loadFile} disabled={files.length !== 1}>
            Load File Into Editor
          </Button>
          <Button onClick={convert} disabled={!canConvert || state.status === "processing"}>
            Convert to CSV
          </Button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      {state.status === "done" ? <JobPanel state={state} onReset={() => { reset(); setOutput(""); setFiles([]); }} /> : null}

      {output ? (
        <section className="mt-6 space-y-3 rounded-xl border border-border bg-card p-4">
          <h2 className="text-lg font-semibold">CSV Output</h2>
          <pre className="max-h-72 overflow-auto rounded-md bg-accent p-3 text-xs text-foreground">{output}</pre>
        </section>
      ) : null}
    </SeoToolPage>
  );
}
