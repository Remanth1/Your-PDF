import { useEffect, useRef, useState } from "react";

export type JobStatus = "idle" | "processing" | "done" | "error";

export interface JobState {
  status: JobStatus;
  progress: number;
  error?: string;
  result?: { url: string; filename: string };
}

export function useConversionJob() {
  const [state, setState] = useState<JobState>({ status: "idle", progress: 0 });
  const urlRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const reset = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setState({ status: "idle", progress: 0 });
  };

  async function run(
    fn: (onProgress: (p: number) => void) => Promise<{ blob: Blob; filename: string }>,
  ) {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setState({ status: "processing", progress: 0 });
    try {
      const { blob, filename } = await fn((p) =>
        setState((s) => ({ ...s, progress: Math.max(s.progress, Math.min(99, p)) })),
      );
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setState({ status: "done", progress: 100, result: { url, filename } });
    } catch (e) {
      console.error(e);
      setState({
        status: "error",
        progress: 0,
        error: e instanceof Error ? e.message : "Conversion failed",
      });
    }
  }

  return { state, run, reset };
}
