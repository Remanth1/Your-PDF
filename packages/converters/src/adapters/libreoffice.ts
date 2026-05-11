import type { Converter } from "../types";
import { runCommand } from "../process";
import { basename, dirname, extname, join } from "node:path";

export class LibreOfficeConverter implements Converter {
  key = "libreoffice";

  canHandle(inputMime: string, outputMime: string): boolean {
    return (
      (inputMime === "application/pdf" && outputMime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
      (inputMime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && outputMime === "application/pdf")
    );
  }

  async convert({ inputPath, outputPath }: Parameters<Converter["convert"]>[0]): Promise<void> {
    const outDir = dirname(outputPath);
    const targetExt = extname(outputPath).replace(".", "");
    await runCommand("soffice", ["--headless", "--convert-to", targetExt, "--outdir", outDir, inputPath]);

    const converted = join(outDir, `${basename(inputPath, extname(inputPath))}.${targetExt}`);
    if (converted !== outputPath) {
      await runCommand("node", ["-e", `require('node:fs').copyFileSync(${JSON.stringify(converted)}, ${JSON.stringify(outputPath)})`]);
    }
  }
}
