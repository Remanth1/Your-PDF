import { useState } from "react";

export interface ConversionJob {
  jobId: string;
  progress: number;
  status: "local" | "backend" | "completed" | "error";
  downloadUrl?: string;
  error?: string;
}

const FILE_SIZE_THRESHOLD = 50 * 1024 * 1024; // 50 MB threshold

/**
 * Hook that intelligently routes conversions to backend for large files.
 * 
 * For files < 50MB: process locally using provided converter function
 * For files >= 50MB: upload to backend and poll for completion
 */
export function useThresholdedConversion() {
  const [job, setJob] = useState<ConversionJob | null>(null);

  const convert = async (
    files: File[],
    sourceMime: string,
    targetMime: string,
    converterFn: (files: File[], onProgress: (p: number) => void) => Promise<Blob>
  ): Promise<{ blob: Blob; filename: string }> => {
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const shouldUseBackend = totalSize >= FILE_SIZE_THRESHOLD;

    if (shouldUseBackend) {
      // Route to backend
      setJob({ jobId: "", progress: 0, status: "backend" });
      return await uploadToBackend(files[0], sourceMime, targetMime);
    } else {
      // Process locally
      setJob({ jobId: "", progress: 0, status: "local" });
      const blob = await converterFn(files, (progress) => {
        setJob((prev) => prev ? { ...prev, progress } : null);
      });
      setJob((prev) => prev ? { ...prev, progress: 100, status: "completed" } : null);
      return { blob, filename: files[0].name };
    }
  };

  const uploadToBackend = async (
    file: File,
    sourceMime: string,
    targetMime: string
  ): Promise<{ blob: Blob; filename: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sourceMime", sourceMime);
    formData.append("targetMime", targetMime);

    // Create job
    const createResponse = await fetch("/api/jobs", {
      method: "POST",
      body: formData,
    });

    if (!createResponse.ok) {
      throw new Error("Failed to queue job");
    }

    const { jobId } = await createResponse.json();
    setJob({ jobId, progress: 0, status: "backend" });

    // Poll for completion
    let completed = false;
    let result: { blob: Blob; filename: string } | null = null;

    while (!completed) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const statusResponse = await fetch(`/api/jobs/${jobId}`);
      if (!statusResponse.ok) {
        throw new Error("Failed to check job status");
      }

      const jobStatus = await statusResponse.json();
      setJob((prev) =>
        prev
          ? {
              ...prev,
              progress: jobStatus.progress || 0,
              status: jobStatus.status === "completed" ? "completed" : "backend",
            }
          : null
      );

      if (jobStatus.status === "completed") {
        // Download result
        if (jobStatus.downloadUrl) {
          const downloadResponse = await fetch(jobStatus.downloadUrl);
          const blob = await downloadResponse.blob();
          result = { blob, filename: `converted-${Date.now()}` };
        }
        completed = true;
      } else if (jobStatus.status === "failed") {
        throw new Error(jobStatus.error || "Job failed");
      }
    }

    if (!result) {
      throw new Error("Job completed but no download URL");
    }

    return result;
  };

  return { convert, job };
}
