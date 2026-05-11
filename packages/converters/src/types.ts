export type ConvertOptions = Record<string, unknown>;

export interface ConvertRequest {
  sourceMime: string;
  targetMime: string;
  inputPath: string;
  outputPath: string;
  options?: ConvertOptions;
}

export interface Converter {
  key: string;
  canHandle(inputMime: string, outputMime: string): boolean;
  convert(request: ConvertRequest): Promise<void>;
}
