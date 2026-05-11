import type { Converter } from "../types";
import { runCommand } from "../process";

export class ImageMagickConverter implements Converter {
  key = "imagemagick";

  canHandle(inputMime: string, outputMime: string): boolean {
    return (
      (inputMime === "image/jpeg" && outputMime === "image/png") ||
      (inputMime === "image/png" && outputMime === "image/jpeg")
    );
  }

  async convert({ inputPath, outputPath }: Parameters<Converter["convert"]>[0]): Promise<void> {
    await runCommand("magick", [inputPath, outputPath]);
  }
}
