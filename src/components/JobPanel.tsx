import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { JobState } from "@/hooks/useConversionJob";

interface JobPanelProps {
  state: JobState;
  onReset: () => void;
}

export function JobPanel({ state, onReset }: JobPanelProps) {
  if (state.status === "idle") return null;

  if (state.status === "processing") {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Processing in your browser…
        </div>
        <Progress value={state.progress} />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4" />
          Conversion failed
        </div>
        <p className="text-sm text-muted-foreground">{state.error}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={onReset}>
          <RotateCcw className="mr-2 h-3.5 w-3.5" /> Try again
        </Button>
      </div>
    );
  }

  // done
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[color:var(--success)]">
        <CheckCircle2 className="h-4 w-4" />
        Done — your file is ready.
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <a href={state.result!.url} download={state.result!.filename}>
            <Download className="mr-2 h-4 w-4" /> Download {state.result!.filename}
          </a>
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Convert another
        </Button>
      </div>
    </div>
  );
}
