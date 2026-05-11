import type { Converter } from "../types";
import { runCommand } from "../process";

export class FfmpegConverter implements Converter {
  key = "ffmpeg";

  canHandle(inputMime: string, outputMime: string): boolean {
    return inputMime === "video/mp4" && outputMime === "audio/mpeg";
  }

  async convert({ inputPath, outputPath }: Parameters<Converter["convert"]>[0]): Promise<void> {
    await runCommand("ffmpeg", ["-y", "-i", inputPath, "-vn", "-acodec", "libmp3lame", outputPath]);
  }
}
