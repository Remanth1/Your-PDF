import type { Converter } from "../types";
import { runCommand } from "../process";

export class PdfToolsConverter implements Converter {
  key = "pdf-tools";

  canHandle(inputMime: string, outputMime: string): boolean {
    return inputMime === "application/pdf" && outputMime.startsWith("application/pdf+");
  }

  async convert({ inputPath, outputPath, targetMime, options }: Parameters<Converter["convert"]>[0] & { targetMime: string }): Promise<void> {
    if (targetMime === "application/pdf+compress") {
      await runCommand("gs", [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/ebook",
        "-dNOPAUSE",
        "-dBATCH",
        `-sOutputFile=${outputPath}`,
        inputPath
      ]);
      return;
    }

    if (targetMime === "application/pdf+split") {
      const from = String((options?.from as number | undefined) ?? 1);
      const to = String((options?.to as number | undefined) ?? 1);
      await runCommand("qpdf", [inputPath, "--pages", inputPath, `${from}-${to}`, "--", outputPath]);
      return;
    }

    if (targetMime === "application/pdf+merge") {
      const files = Array.isArray(options?.files) ? (options?.files as string[]) : [inputPath];
      await runCommand("qpdf", ["--empty", "--pages", ...files, "--", outputPath]);
      return;
    }

    throw new Error(`Unsupported PDF operation: ${targetMime}`);
  }
}
