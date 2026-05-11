import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { JobPanel } from "@/components/JobPanel";
import { ToolShell } from "@/components/ToolShell";
import { useConversionJob } from "@/hooks/useConversionJob";

export const Route = createFileRoute("/png-to-jpg")({
  head: () => ({
    meta: [
      { title: "PNG to JPG — Convert images in your browser | Fileforge" },
      {
        name: "description",
        content: "Convert PNG images to JPG locally in your browser. Fast and private.",
      },
    ],
  }),
  component: PngToJpgPage,
});

function PngToJpgPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { state, run, reset } = useConversionJob();

  const start = () =>
    run(async (onProgress) => {
      onProgress(30);
      const { convertImageFormat } = await import("@/lib/converters/image-basic");
      const blob = await convertImageFormat(files[0], "image/jpeg", 0.9);
      onProgress(100);
      return { blob, filename: files[0].name.replace(/\.png$/i, "") + ".jpg" };
    });

  return (
    <ToolShell
      title="PNG to JPG"
      tagline="Convert PNG images to JPG without uploading files."
      description="Runs fully in-browser. Transparent PNG backgrounds are flattened onto white for JPG output."
      howItWorks={[
        "Drop a PNG image.",
        "Click Convert — processing stays local.",
        "Download your JPG file.",
      ]}
      faqs={[
        { q: "Will transparency be preserved?", a: "JPG does not support transparency, so transparent regions become white." },
        { q: "Is this private?", a: "Yes. Files never leave your browser for this tool." },
        { q: "Can I control quality?", a: "Quality is optimized for balanced size and fidelity in this release." },
      ]}
    >
      <Dropzone
        accept={{ "image/png": [".png"] }}
        files={files}
        onFiles={setFiles}
        hint="PNG only • up to 100 MB"
      />
      {state.status === "idle" ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={start} disabled={files.length !== 1}>
            Convert to JPG
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
