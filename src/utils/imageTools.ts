import { saveAs } from 'file-saver';

// Helper to read file as Data URL
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper to load image from data URL
export const loadImage = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
};

// Compress image
export const compressImage = async (
  file: File,
  quality: number = 0.7,
  maxWidth?: number,
  maxHeight?: number
): Promise<{ originalSize: number; compressedSize: number }> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  let width = img.width;
  let height = img.height;

  // Resize if max dimensions specified
  if (maxWidth && width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }
  if (maxHeight && height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), outputType, quality);
  });

  const originalSize = file.size;
  const compressedSize = blob.size;
  const extension = outputType === 'image/png' ? 'png' : 'jpg';
  saveAs(blob, `compressed.${extension}`);

  return { originalSize, compressedSize };
};

// Resize image
export const resizeImage = async (
  file: File,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true
): Promise<void> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  let newWidth = width;
  let newHeight = height;

  if (maintainAspectRatio) {
    const aspectRatio = img.width / img.height;
    if (width / height > aspectRatio) {
      newWidth = height * aspectRatio;
    } else {
      newHeight = width / aspectRatio;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), outputType, 0.92);
  });

  const extension = outputType === 'image/png' ? 'png' : 'jpg';
  saveAs(blob, `resized-${Math.round(newWidth)}x${Math.round(newHeight)}.${extension}`);
};

// Crop image
export const cropImage = async (
  file: File,
  x: number,
  y: number,
  cropWidth: number,
  cropHeight: number
): Promise<void> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, x, y, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), outputType, 0.92);
  });

  const extension = outputType === 'image/png' ? 'png' : 'jpg';
  saveAs(blob, `cropped.${extension}`);
};

// Convert PNG to JPG
export const pngToJpg = async (file: File, quality: number = 0.92): Promise<void> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  
  // Fill with white background (for transparency)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality);
  });

  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.jpg`);
};

// Convert JPG to PNG
export const jpgToPng = async (file: File): Promise<void> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/png');
  });

  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}.png`);
};

// Rotate image
export const rotateImage = async (file: File, degrees: number): Promise<void> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const radians = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const newWidth = img.width * cos + img.height * sin;
  const newHeight = img.width * sin + img.height * cos;

  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d')!;

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), outputType, 0.92);
  });

  const extension = outputType === 'image/png' ? 'png' : 'jpg';
  saveAs(blob, `rotated.${extension}`);
};

// Flip image
export const flipImage = async (
  file: File,
  direction: 'horizontal' | 'vertical'
): Promise<void> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;

  if (direction === 'horizontal') {
    ctx.translate(img.width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, img.height);
    ctx.scale(1, -1);
  }
  ctx.drawImage(img, 0, 0);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), outputType, 0.92);
  });

  const extension = outputType === 'image/png' ? 'png' : 'jpg';
  saveAs(blob, `flipped-${direction}.${extension}`);
};

// Convert image to different format
export const convertImageFormat = async (
  file: File,
  targetFormat: 'jpeg' | 'png' | 'webp',
  quality: number = 0.92
): Promise<void> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  
  // Fill with white background for jpeg (transparency)
  if (targetFormat === 'jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.drawImage(img, 0, 0);

  const mimeType = `image/${targetFormat}`;
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), mimeType, quality);
  });

  const fileName = file.name.replace(/\.[^/.]+$/, '');
  const extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
  saveAs(blob, `${fileName}.${extension}`);
};

// Get image dimensions
export const getImageDimensions = async (
  file: File
): Promise<{ width: number; height: number }> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  return { width: img.width, height: img.height };
};

// Add filter to image
export const applyImageFilter = async (
  file: File,
  filter: 'grayscale' | 'sepia' | 'invert' | 'blur' | 'brightness' | 'contrast',
  intensity: number = 100
): Promise<void> => {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  
  // Apply CSS filter
  switch (filter) {
    case 'grayscale':
      ctx.filter = `grayscale(${intensity}%)`;
      break;
    case 'sepia':
      ctx.filter = `sepia(${intensity}%)`;
      break;
    case 'invert':
      ctx.filter = `invert(${intensity}%)`;
      break;
    case 'blur':
      ctx.filter = `blur(${intensity / 20}px)`;
      break;
    case 'brightness':
      ctx.filter = `brightness(${intensity}%)`;
      break;
    case 'contrast':
      ctx.filter = `contrast(${intensity}%)`;
      break;
  }
  
  ctx.drawImage(img, 0, 0);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), outputType, 0.92);
  });

  const extension = outputType === 'image/png' ? 'png' : 'jpg';
  saveAs(blob, `${filter}.${extension}`);
};
