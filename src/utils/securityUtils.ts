/**
 * Security utilities for file validation and sanitization
 */

// Configuration from environment
const MAX_FILE_SIZE = import.meta.env.VITE_MAX_FILE_SIZE 
  ? parseInt(import.meta.env.VITE_MAX_FILE_SIZE)
  : 100 * 1024 * 1024; // 100MB default

// Safe MIME types by category
const ALLOWED_MIME_TYPES = {
  pdf: ['application/pdf'],
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  document: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
  spreadsheet: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac'],
  video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
};

export type FileCategory = keyof typeof ALLOWED_MIME_TYPES;

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSize - Maximum allowed size in bytes (defaults to env config)
 * @returns true if valid
 * @throws Error if file is too large
 */
export const validateFileSize = (file: File, maxSize = MAX_FILE_SIZE): boolean => {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(
      `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`
    );
  }
  return true;
};

/**
 * Validate file MIME type
 * @param file - File to validate
 * @param category - File category (pdf, image, document, etc.)
 * @returns true if valid
 * @throws Error if MIME type is not allowed
 */
export const validateFileMimeType = (
  file: File,
  category: FileCategory
): boolean => {
  const allowedTypes = ALLOWED_MIME_TYPES[category];
  
  if (!allowedTypes || !allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed types: ${allowedTypes?.join(', ')}`
    );
  }
  
  return true;
};

/**
 * Validate file extension (basic check, not foolproof)
 * @param file - File to validate
 * @param allowedExtensions - Array of allowed extensions (e.g., ['pdf', 'txt'])
 * @returns true if valid
 * @throws Error if extension is not allowed
 */
export const validateFileExtension = (
  file: File,
  allowedExtensions: string[]
): boolean => {
  const fileName = file.name.toLowerCase();
  const extension = fileName.split('.').pop() || '';
  
  if (!allowedExtensions.includes(extension)) {
    throw new Error(
      `Invalid file extension: .${extension}. Allowed: ${allowedExtensions.map(e => `.${e}`).join(', ')}`
    );
  }
  
  return true;
};

/**
 * Comprehensive file validation
 * @param file - File to validate
 * @param options - Validation options
 * @returns true if all checks pass
 * @throws Error with details if validation fails
 */
export const validateFile = (
  file: File,
  options: {
    category: FileCategory;
    maxSize?: number;
    allowedExtensions?: string[];
  }
): boolean => {
  try {
    // Check file size
    validateFileSize(file, options.maxSize);
    
    // Check MIME type
    validateFileMimeType(file, options.category);
    
    // Check extension if provided
    if (options.allowedExtensions) {
      validateFileExtension(file, options.allowedExtensions);
    }
    
    return true;
  } catch (error) {
    // Re-throw with additional context
    if (error instanceof Error) {
      throw new Error(`File validation failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Sanitize file name to prevent path traversal attacks
 * @param fileName - Original file name
 * @returns Sanitized file name
 */
export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/\.\./g, '') // Remove ..
    .replace(/[/\\]/g, '') // Remove path separators
    .replace(/[<>:"|?*]/g, '') // Remove invalid Windows characters
    .substring(0, 255); // Limit length
};

/**
 * Generate safe file name with timestamp
 * @param originalName - Original file name
 * @returns Safe file name with timestamp
 */
export const generateSafeFileName = (originalName: string): string => {
  const sanitized = sanitizeFileName(originalName);
  const timestamp = Date.now();
  const ext = sanitized.split('.').pop() || '';
  const name = sanitized.replace(`.${ext}`, '').substring(0, 200);
  return `${name}-${timestamp}.${ext}`;
};

/**
 * Check if running in development mode
 * @returns true if NODE_ENV is 'development'
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Safe error logging (never logs to console in production)
 * @param context - Context/location of error
 * @param error - Error to log
 * @param data - Optional additional data (will not log sensitive fields)
 */
export const logError = (
  context: string,
  error: Error,
  data?: Record<string, any>
): void => {
  if (!isDevelopment()) {
    // In production, you'd send to error tracking service
    // Example: Sentry.captureException(error, { tags: { context } });
    return;
  }
  
  console.error(`[${context}]`, error.message, data);
};

/**
 * Create error response with safe message
 * @param error - Original error
 * @param isProduction - Whether to use safe/generic message
 * @returns Safe error object for UI
 */
export const createSafeErrorResponse = (
  error: Error,
  isProduction = !isDevelopment()
): { message: string; details?: string } => {
  return {
    message: isProduction 
      ? 'An error occurred. Please try again.'
      : error.message,
    details: !isProduction ? error.stack : undefined,
  };
};

/**
 * Validate and parse JSON safely
 * @param jsonString - JSON string to parse
 * @returns Parsed object or null if invalid
 */
export const safeJsonParse = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logError('safeJsonParse', error instanceof Error ? error : new Error(String(error)));
    return null;
  }
};

/**
 * Encode string for safe display in HTML (XSS prevention)
 * @param str - String to encode
 * @returns HTML-safe string
 */
export const encodeHtml = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Validate URL is safe (not javascript: or data: etc)
 * @param url - URL string to validate
 * @returns true if safe
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};
