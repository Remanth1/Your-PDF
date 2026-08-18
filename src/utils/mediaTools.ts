import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { saveAs } from 'file-saver';

let ffmpeg: FFmpeg | null = null;
let ffmpegLoaded = false;

// Helper to create blob from FFmpeg output
const createBlob = (data: Uint8Array | string, mimeType: string): Blob => {
  if (typeof data === 'string') {
    return new Blob([data], { type: mimeType });
  }
  const buffer = new ArrayBuffer(data.length);
  const view = new Uint8Array(buffer);
  view.set(data);
  return new Blob([buffer], { type: mimeType });
};

// Initialize FFmpeg
const initFFmpeg = async (onProgress?: (message: string) => void): Promise<FFmpeg> => {
  if (ffmpeg && ffmpegLoaded) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  
  // @ts-ignore - FFmpeg event listeners
  ffmpeg.on('log', ({ message }) => {
    // Only log in development mode - never log sensitive data
    if (process.env.NODE_ENV === 'development') {
      console.debug('FFmpeg:', message);
    }
  });
  
  // @ts-ignore - FFmpeg progress listener
  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) {
      onProgress(`Processing: ${Math.round(progress * 100)}%`);
    }
  });

  if (onProgress) onProgress('Loading FFmpeg (this may take a moment)...');
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  ffmpegLoaded = true;
  return ffmpeg;
};

// Helper to get file extension
const getExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Compress Video
export const compressVideo = async (
  file: File,
  quality: 'high' | 'medium' | 'low' = 'medium',
  onProgress?: (message: string) => void
): Promise<{ originalSize: number; compressedSize: number }> => {
  const ff = await initFFmpeg(onProgress);
  
  const inputName = `input.${getExtension(file.name)}`;
  const outputName = 'output.mp4';
  
  if (onProgress) onProgress('Reading file...');
  await ff.writeFile(inputName, await fetchFile(file));
  
  // Quality presets
  const crfValues = { high: '23', medium: '28', low: '35' };
  const crf = crfValues[quality];
  
  if (onProgress) onProgress('Compressing video...');
  await ff.exec([
    '-i', inputName,
    '-c:v', 'libx264',
    '-crf', crf,
    '-preset', 'fast',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    outputName
  ]);
  
  const data = await ff.readFile(outputName) as Uint8Array;
  const blob = createBlob(data, 'video/mp4');
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}-compressed.mp4`);
  
  return {
    originalSize: file.size,
    compressedSize: blob.size
  };
};

// Convert Video
export const convertVideo = async (
  file: File,
  outputFormat: 'mp4' | 'webm' | 'avi' | 'mov' | 'mkv' = 'mp4',
  onProgress?: (message: string) => void
): Promise<void> => {
  const ff = await initFFmpeg(onProgress);
  
  const inputName = `input.${getExtension(file.name)}`;
  const outputName = `output.${outputFormat}`;
  
  if (onProgress) onProgress('Reading file...');
  await ff.writeFile(inputName, await fetchFile(file));
  
  if (onProgress) onProgress('Converting video...');
  
  let args: string[];
  switch (outputFormat) {
    case 'webm':
      args = ['-i', inputName, '-c:v', 'libvpx-vp9', '-c:a', 'libopus', outputName];
      break;
    case 'avi':
      args = ['-i', inputName, '-c:v', 'mpeg4', '-c:a', 'mp3', outputName];
      break;
    case 'mov':
      args = ['-i', inputName, '-c:v', 'libx264', '-c:a', 'aac', outputName];
      break;
    case 'mkv':
      args = ['-i', inputName, '-c:v', 'libx264', '-c:a', 'aac', outputName];
      break;
    default:
      args = ['-i', inputName, '-c:v', 'libx264', '-c:a', 'aac', '-movflags', '+faststart', outputName];
  }
  
  await ff.exec(args);
  
  const data = await ff.readFile(outputName) as Uint8Array;
  const mimeTypes: Record<string, string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    mkv: 'video/x-matroska'
  };
  const blob = createBlob(data, mimeTypes[outputFormat]);
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.${outputFormat}`);
};

// Extract Audio from Video
export const extractAudio = async (
  file: File,
  outputFormat: 'mp3' | 'wav' | 'aac' | 'ogg' = 'mp3',
  onProgress?: (message: string) => void
): Promise<void> => {
  const ff = await initFFmpeg(onProgress);
  
  const inputName = `input.${getExtension(file.name)}`;
  const outputName = `output.${outputFormat}`;
  
  if (onProgress) onProgress('Reading file...');
  await ff.writeFile(inputName, await fetchFile(file));
  
  if (onProgress) onProgress('Extracting audio...');
  
  let args: string[];
  switch (outputFormat) {
    case 'mp3':
      args = ['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', outputName];
      break;
    case 'wav':
      args = ['-i', inputName, '-vn', '-acodec', 'pcm_s16le', outputName];
      break;
    case 'aac':
      args = ['-i', inputName, '-vn', '-acodec', 'aac', '-b:a', '192k', outputName];
      break;
    case 'ogg':
      args = ['-i', inputName, '-vn', '-acodec', 'libvorbis', '-q:a', '5', outputName];
      break;
    default:
      args = ['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', outputName];
  }
  
  await ff.exec(args);
  
  const data = await ff.readFile(outputName) as Uint8Array;
  const mimeTypes: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    aac: 'audio/aac',
    ogg: 'audio/ogg'
  };
  const blob = createBlob(data, mimeTypes[outputFormat]);
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.${outputFormat}`);
};

// Convert Audio
export const convertAudio = async (
  file: File,
  outputFormat: 'mp3' | 'wav' | 'aac' | 'ogg' | 'flac' = 'mp3',
  onProgress?: (message: string) => void
): Promise<void> => {
  const ff = await initFFmpeg(onProgress);
  
  const inputName = `input.${getExtension(file.name)}`;
  const outputName = `output.${outputFormat}`;
  
  if (onProgress) onProgress('Reading file...');
  await ff.writeFile(inputName, await fetchFile(file));
  
  if (onProgress) onProgress('Converting audio...');
  
  let args: string[];
  switch (outputFormat) {
    case 'mp3':
      args = ['-i', inputName, '-acodec', 'libmp3lame', '-q:a', '2', outputName];
      break;
    case 'wav':
      args = ['-i', inputName, '-acodec', 'pcm_s16le', outputName];
      break;
    case 'aac':
      args = ['-i', inputName, '-acodec', 'aac', '-b:a', '192k', outputName];
      break;
    case 'ogg':
      args = ['-i', inputName, '-acodec', 'libvorbis', '-q:a', '5', outputName];
      break;
    case 'flac':
      args = ['-i', inputName, '-acodec', 'flac', outputName];
      break;
    default:
      args = ['-i', inputName, '-acodec', 'libmp3lame', '-q:a', '2', outputName];
  }
  
  await ff.exec(args);
  
  const data = await ff.readFile(outputName) as Uint8Array;
  const mimeTypes: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    flac: 'audio/flac'
  };
  const blob = createBlob(data, mimeTypes[outputFormat]);
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.${outputFormat}`);
};
