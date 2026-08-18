export type ToolBadge = 'free' | 'popular' | 'new' | 'beta';
export type ToolCategory = 'pdf' | 'document' | 'image' | 'data' | 'ai';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  badge?: ToolBadge;
  color: string;
  limitations?: string;
}

export const categories: { id: ToolCategory; label: string; icon: string }[] = [
  { id: 'pdf', label: 'PDF Tools', icon: 'FileText' },
  { id: 'document', label: 'Document Conversion', icon: 'FileOutput' },
  { id: 'image', label: 'Image Tools', icon: 'Image' },
  { id: 'data', label: 'Data Tools', icon: 'Database' },
  { id: 'ai', label: 'AI PDF Tools', icon: 'Sparkles' },
];

export const tools: Tool[] = [
  // PDF Tools - FULLY WORKING
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into a single document effortlessly.', icon: 'Merge', category: 'pdf', badge: 'popular', color: '#E5322D' },
  { id: 'split-pdf', name: 'Split PDF', description: 'Extract pages or split your PDF into multiple files.', icon: 'Scissors', category: 'pdf', badge: 'free', color: '#E5322D' },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce file size by optimizing the PDF structure.', icon: 'Minimize2', category: 'pdf', badge: 'popular', color: '#E5322D' },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate pages in any direction with precision.', icon: 'RotateCw', category: 'pdf', badge: 'free', color: '#E5322D' },
  { id: 'watermark-pdf', name: 'Watermark PDF', description: 'Add text watermarks to your PDFs.', icon: 'Stamp', category: 'pdf', badge: 'free', color: '#E5322D' },
  { id: 'page-numbers', name: 'Add Page Numbers', description: 'Insert page numbers in your PDF documents.', icon: 'Hash', category: 'pdf', badge: 'free', color: '#E5322D' },

  // Image Tools - FULLY WORKING
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert each PDF page to high-quality JPG images.', icon: 'Image', category: 'image', badge: 'popular', color: '#8B5CF6' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Combine JPG images into a single PDF file.', icon: 'FileImage', category: 'image', badge: 'free', color: '#8B5CF6' },
  { id: 'compress-image', name: 'Compress Image', description: 'Reduce image file size without losing quality.', icon: 'Minimize2', category: 'image', badge: 'free', color: '#8B5CF6' },
  { id: 'resize-image', name: 'Resize Image', description: 'Change image dimensions to any size.', icon: 'Maximize2', category: 'image', badge: 'free', color: '#8B5CF6' },
  { id: 'crop-image', name: 'Crop Image', description: 'Crop and trim your images with precision.', icon: 'Crop', category: 'image', badge: 'free', color: '#8B5CF6' },
  { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG images to JPG format.', icon: 'ArrowRightLeft', category: 'image', badge: 'free', color: '#8B5CF6' },

  // Data Tools - FULLY WORKING
  { id: 'csv-to-excel', name: 'CSV to Excel', description: 'Convert CSV files into Excel spreadsheets.', icon: 'FileSpreadsheet', category: 'data', badge: 'free', color: '#16A34A' },
  { id: 'excel-to-csv', name: 'Excel to CSV', description: 'Export Excel spreadsheets as CSV files.', icon: 'FileDown', category: 'data', badge: 'free', color: '#16A34A' },
  { id: 'json-to-csv', name: 'JSON to CSV', description: 'Transform JSON data into CSV format.', icon: 'Braces', category: 'data', badge: 'free', color: '#16A34A' },
  { id: 'xml-to-json', name: 'XML to JSON', description: 'Convert XML documents to JSON format.', icon: 'Code', category: 'data', badge: 'free', color: '#16A34A' },

  // Document Conversion - BETA (with limitations)
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Extract text from PDF to Word format. Best for text-heavy documents.', icon: 'FileText', category: 'document', badge: 'beta', color: '#3B82F6', limitations: 'Extracts text only. Complex formatting, images, and tables may not be preserved.' },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word documents to PDF format.', icon: 'FileDown', category: 'document', badge: 'beta', color: '#3B82F6', limitations: 'Basic conversion. Complex formatting may vary.' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Extract tabular data from PDFs to Excel.', icon: 'Sheet', category: 'document', badge: 'beta', color: '#3B82F6', limitations: 'Works best with simple, well-structured tables. Complex tables may not extract correctly.' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel spreadsheets to PDF format.', icon: 'FileSpreadsheet', category: 'document', badge: 'free', color: '#3B82F6' },
  { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert HTML files to PDF documents.', icon: 'Globe', category: 'document', badge: 'free', color: '#3B82F6' },
  { id: 'pdf-to-pptx', name: 'PDF to PowerPoint', description: 'Convert PDF pages to PowerPoint slides (as images).', icon: 'Presentation', category: 'document', badge: 'beta', color: '#3B82F6', limitations: 'Creates image-based slides. Text is not editable.' },
  { id: 'pptx-to-pdf', name: 'PowerPoint to PDF', description: 'Extract PowerPoint content to PDF.', icon: 'FileDown', category: 'document', badge: 'beta', color: '#3B82F6', limitations: 'Extracts text content. Images and complex layouts not preserved.' },

  // AI Tools - WORKING with honest descriptions
  { id: 'ai-summarize', name: 'Smart Summarize', description: 'Generate extractive summaries by identifying key sentences.', icon: 'Sparkles', category: 'ai', badge: 'free', color: '#EC4899' },
  { id: 'ai-chat-pdf', name: 'Search PDF', description: 'Search and find relevant passages in your document.', icon: 'MessageSquare', category: 'ai', badge: 'free', color: '#EC4899' },
  { id: 'ocr-pdf', name: 'OCR PDF', description: 'Extract text from scanned PDFs using optical character recognition.', icon: 'ScanText', category: 'ai', badge: 'free', color: '#EC4899' },
];

export const popularToolIds = ['merge-pdf', 'compress-pdf', 'pdf-to-jpg', 'pdf-to-word', 'compress-image', 'ocr-pdf'];

export const faqs = [
  {
    question: 'Is YourPDF free to use?',
    answer: 'Yes! All of our tools are completely free with no sign-up required.',
  },
  {
    question: 'Are my files secure?',
    answer: 'Absolutely. All processing happens directly in your browser using JavaScript. Your files never leave your device and are never uploaded to any server.',
  },
  {
    question: 'Why are some tools marked as "Beta"?',
    answer: 'Beta tools work but have limitations. For example, PDF to Word extracts text but may not preserve complex formatting. We\'re honest about what each tool can and cannot do.',
  },
  {
    question: 'How accurate is the OCR?',
    answer: 'Our OCR uses Tesseract.js, a highly accurate open-source OCR engine. It works best with clear, high-resolution scanned documents. Processing may take 1-2 minutes per page.',
  },
  {
    question: 'What are the file size limits?',
    answer: 'Since processing happens in your browser, limits depend on your device. Most tools handle files up to 50MB well. For best performance, we recommend files under 20MB.',
  },
  {
    question: 'Can I process multiple files?',
    answer: 'Yes! Tools like Merge PDF and JPG to PDF support multiple files. Drag and drop all your files or use the file picker to select multiple.',
  },
  {
    question: 'Do you have an API?',
    answer: 'Not yet, but it\'s on our roadmap to offer more options in the future.',
  },
];

export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    content: 'I appreciate the honesty about what works and what doesn\'t. The PDF tools are excellent and I love that everything stays on my device.',
    avatar: 'SC',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Freelance Designer',
    content: 'The image tools are fantastic - compression, resizing, and PDF conversion all work perfectly. Fast and free!',
    avatar: 'MJ',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Data Analyst',
    content: 'CSV to Excel and JSON conversions are super useful for my daily work. Simple, fast, and works offline too!',
    avatar: 'ER',
    rating: 5,
  },
];
