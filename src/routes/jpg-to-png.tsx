import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/Dropzone";
import { JobPanel } from "@/components/JobPanel";
import { ToolShell } from "@/components/ToolShell";
import { useConversionJob } from "@/hooks/useConversionJob";

export const Route = createFileRoute("/jpg-to-png")({
  head: () => ({
    meta: [
      { title: "JPG to PNG — Convert images in your browser | Fileforge" },
      {
        name: "description",
        content: "Convert JPG images to PNG locally in your browser. Private, fast, and free.",
      },
    ],
  }),
  component: JpgToPngPage,
});

function JpgToPngPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { state, run, reset } = useConversionJob();

  const start = () =>
    run(async (onProgress) => {
      onProgress(30);
      const { convertImageFormat } = await import("@/lib/converters/image-basic");
      const blob = await convertImageFormat(files[0], "image/png");
      onProgress(100);
      return { blob, filename: files[0].name.replace(/\.jpe?g$/i, "") + ".png" };
    });

  return (
    <ToolShell
      title="JPG to PNG"
      tagline="Convert JPEG images to PNG without uploading files."
      description="This conversion runs locally in your browser using Canvas APIs. Great for preserving transparency-ready workflows and lossless PNG output."
      howItWorks={[
        "Drop a JPG/JPEG image.",
        "Click Convert — processing happens in your browser.",
        "Download the PNG output.",
      ]}
      faqs={[
        { q: "Is this private?", a: "Yes. No upload is required for this converter." },
        { q: "Will resolution change?", a: "No. Output keeps the original pixel dimensions." },
        { q: "Can I batch convert?", a: "Single file in this first release." },
      ]}
    >
      <Dropzone
        accept={{ "image/jpeg": [".jpg", ".jpeg"] }}
        files={files}
        onFiles={setFiles}
        hint="JPG/JPEG only • up to 100 MB"
      />
      {state.status === "idle" ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={start} disabled={files.length !== 1}>
            Convert to PNG
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
