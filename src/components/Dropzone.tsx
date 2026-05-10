import { useCallback, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { Upload, X, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropzoneProps {
  accept: Accept;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
  maxSizeMB?: number;
  hint?: string;
}

export function Dropzone({
  accept,
  multiple = false,
  files,
  onFiles,
  maxSizeMB = 100,
  hint,
}: DropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      setError(null);
      const tooBig = accepted.find((f) => f.size > maxSizeMB * 1024 * 1024);
      if (tooBig) {
        setError(`"${tooBig.name}" is larger than ${maxSizeMB} MB.`);
        return;
      }
      onFiles(multiple ? [...files, ...accepted] : accepted);
    },
    [files, maxSizeMB, multiple, onFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  const remove = (idx: number) => onFiles(files.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="font-medium text-foreground">
          {isDragActive ? "Drop files here" : "Drag & drop or click to select"}
        </p>
        {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm">{f.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {(f.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove">
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
