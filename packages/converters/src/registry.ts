import type { Converter, ConvertRequest } from "./types";
import { FfmpegConverter } from "./adapters/ffmpeg";
import { ImageMagickConverter } from "./adapters/imagemagick";
import { LibreOfficeConverter } from "./adapters/libreoffice";
import { PdfToolsConverter } from "./adapters/pdf-tools";

export class ConverterRegistry {
  constructor(private readonly converters: Converter[]) {}

  find(sourceMime: string, targetMime: string): Converter {
    const found = this.converters.find((c) => c.canHandle(sourceMime, targetMime));
    if (!found) {
      throw new Error(`No converter found for ${sourceMime} -> ${targetMime}`);
    }
    return found;
  }

  async convert(request: ConvertRequest): Promise<void> {
    const converter = this.find(request.sourceMime, request.targetMime);
    await converter.convert(request);
  }
}

export function createDefaultRegistry(): ConverterRegistry {
  return new ConverterRegistry([
    new FfmpegConverter(),
    new ImageMagickConverter(),
    new LibreOfficeConverter(),
    new PdfToolsConverter()
  ]);
}
