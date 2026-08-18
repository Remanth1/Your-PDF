import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Upload, CheckCircle, Shield, Zap, X, Clock,
  FileText, Download, Loader2, AlertCircle, RotateCw, Image as ImageIcon,
  Sparkles, Send, AlertTriangle
} from 'lucide-react';
import { tools } from '@/data/tools';
import {
  mergePDFs, splitPDFByRange, rotatePDF, compressPDF,
  addPageNumbers, addWatermark, imagesToPDF, getPDFInfo
} from '@/utils/pdfTools';
import {
  compressImage, resizeImage, pngToJpg, cropImage, getImageDimensions
} from '@/utils/imageTools';
import { pdfToJpg } from '@/utils/pdfToImage';
import { csvToExcel, excelToCsv, jsonToCsv, xmlToJson } from '@/utils/dataTools';
import {
  pdfToWord, wordToPdf, pdfToExcel, excelToPdf, 
  pdfToPowerPoint, powerPointToPdf, htmlToPdf
} from '@/utils/documentTools';
import { summarizePDF, chatWithPDF, ocrPDF } from '@/utils/aiTools';

interface ToolPageProps {
  darkMode: boolean;
}

type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

export default function ToolPage({ darkMode }: ToolPageProps) {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = tools.find((t) => t.id === toolId);

  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} — Free Online Tool | YourPDF`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `${tool.description} Fast, secure, and 100% free client-side processing.`);
      }
    } else {
      document.title = 'YourPDF — Every File Tool You Need, In One Place';
    }
  }, [tool]);

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [progress, setProgress] = useState<string>('');
  
  // Tool-specific options
  const [rotation, setRotation] = useState(90);
  const [pageRange, setPageRange] = useState({ start: 1, end: 1 });
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom-center' | 'bottom-right' | 'bottom-left'>('bottom-center');
  const [imageQuality, setImageQuality] = useState(0.7);
  const [resizeDimensions, setResizeDimensions] = useState({ width: 800, height: 600 });
  const [pdfInfo, setPdfInfo] = useState<{ pageCount: number } | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [cropSettings, setCropSettings] = useState({ x: 0, y: 0, width: 100, height: 100 });
  
  // AI options
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);
  const [ocrLanguage, setOcrLanguage] = useState<'eng' | 'spa' | 'fra' | 'deu'>('eng');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = async (newFiles: File[]) => {
    setFiles(newFiles);
    setStatus('idle');
    setError('');
    setResult('');
    setProgress('');
    setChatHistory([]);
    
    if (newFiles.length === 1 && newFiles[0].type === 'application/pdf') {
      try {
        const info = await getPDFInfo(newFiles[0]);
        setPdfInfo(info);
        setPageRange({ start: 1, end: info.pageCount });
      } catch {
        setPdfInfo(null);
      }
    }
    
    if (newFiles.length === 1 && newFiles[0].type.startsWith('image/')) {
      try {
        const dims = await getImageDimensions(newFiles[0]);
        setImageDimensions(dims);
        setResizeDimensions({ width: dims.width, height: dims.height });
        setCropSettings({ x: 0, y: 0, width: dims.width, height: dims.height });
      } catch {
        setImageDimensions(null);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    if (files.length === 1) {
      setPdfInfo(null);
      setImageDimensions(null);
    }
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    
    setStatus('processing');
    setError('');
    setResult('');
    setProgress('');

    try {
      switch (toolId) {
        // PDF Tools - FULLY WORKING
        case 'merge-pdf':
          if (files.length < 2) throw new Error('Please select at least 2 PDF files to merge');
          await mergePDFs(files);
          setResult('PDFs merged successfully! Download started.');
          break;

        case 'split-pdf':
          await splitPDFByRange(files[0], pageRange.start, pageRange.end);
          setResult(`Extracted pages ${pageRange.start} to ${pageRange.end}. Download started.`);
          break;

        case 'compress-pdf':
          const compressResult = await compressPDF(files[0]);
          const reduction = ((compressResult.originalSize - compressResult.compressedSize) / compressResult.originalSize * 100).toFixed(1);
          setResult(`Compressed! ${formatFileSize(compressResult.originalSize)} → ${formatFileSize(compressResult.compressedSize)} (${reduction}% smaller)`);
          break;

        case 'rotate-pdf':
          await rotatePDF(files[0], rotation);
          setResult(`PDF rotated ${rotation}° clockwise. Download started.`);
          break;

        case 'page-numbers':
          await addPageNumbers(files[0], pageNumberPosition);
          setResult('Page numbers added successfully! Download started.');
          break;

        case 'watermark-pdf':
          if (!watermarkText.trim()) throw new Error('Please enter watermark text');
          await addWatermark(files[0], watermarkText);
          setResult('Watermark added successfully! Download started.');
          break;

        // Document Conversion - BETA tools
        case 'pdf-to-word':
          setProgress('Extracting text from PDF...');
          await pdfToWord(files[0], (current, total) => setProgress(`Processing page ${current} of ${total}...`));
          setResult('PDF converted to Word! Note: Only text content is extracted. Complex formatting may not be preserved.');
          break;

        case 'word-to-pdf':
          setProgress('Converting Word to PDF...');
          await wordToPdf(files[0]);
          setResult('Word document converted to PDF!');
          break;

        case 'pdf-to-excel':
          setProgress('Extracting data from PDF...');
          await pdfToExcel(files[0], (current, total) => setProgress(`Processing page ${current} of ${total}...`));
          setResult('PDF data extracted to Excel! Note: Works best with simple tabular data.');
          break;

        case 'excel-to-pdf':
          setProgress('Converting Excel to PDF...');
          await excelToPdf(files[0]);
          setResult('Excel converted to PDF!');
          break;

        case 'pdf-to-pptx':
          setProgress('Converting PDF to PowerPoint...');
          await pdfToPowerPoint(files[0], (current, total) => setProgress(`Processing page ${current} of ${total}...`));
          setResult('PDF converted to PowerPoint! Each page is a slide image.');
          break;

        case 'pptx-to-pdf':
          setProgress('Converting PowerPoint to PDF...');
          await powerPointToPdf(files[0], (current, total) => setProgress(`Processing slide ${current} of ${total}...`));
          setResult('PowerPoint converted to PDF! Note: Text content extracted, images not included.');
          break;

        case 'html-to-pdf':
          setProgress('Converting HTML to PDF...');
          await htmlToPdf(files[0]);
          setResult('HTML converted to PDF!');
          break;

        // Image Tools - FULLY WORKING
        case 'pdf-to-jpg':
          setProgress('Converting pages...');
          await pdfToJpg(files[0], 0.92, 2, (current, total) => {
            setProgress(`Converting page ${current} of ${total}...`);
          });
          setResult('All pages converted to JPG! Downloads started.');
          break;

        case 'jpg-to-pdf':
          await imagesToPDF(files);
          setResult(`${files.length} image(s) converted to PDF! Download started.`);
          break;

        case 'compress-image':
          const imgCompressResult = await compressImage(files[0], imageQuality);
          const imgReduction = ((imgCompressResult.originalSize - imgCompressResult.compressedSize) / imgCompressResult.originalSize * 100).toFixed(1);
          setResult(`Compressed! ${formatFileSize(imgCompressResult.originalSize)} → ${formatFileSize(imgCompressResult.compressedSize)} (${imgReduction}% smaller)`);
          break;

        case 'resize-image':
          await resizeImage(files[0], resizeDimensions.width, resizeDimensions.height, true);
          setResult('Image resized successfully! Download started.');
          break;

        case 'crop-image':
          await cropImage(files[0], cropSettings.x, cropSettings.y, cropSettings.width, cropSettings.height);
          setResult('Image cropped successfully! Download started.');
          break;

        case 'png-to-jpg':
          await pngToJpg(files[0], 0.92);
          setResult('PNG converted to JPG! Download started.');
          break;

        // Data Tools - FULLY WORKING
        case 'csv-to-excel':
          await csvToExcel(files[0]);
          setResult('CSV converted to Excel! Download started.');
          break;

        case 'excel-to-csv':
          await excelToCsv(files[0]);
          setResult('Excel converted to CSV! Download started.');
          break;

        case 'json-to-csv':
          await jsonToCsv(files[0]);
          setResult('JSON converted to CSV! Download started.');
          break;

        case 'xml-to-json':
          await xmlToJson(files[0]);
          setResult('XML converted to JSON! Download started.');
          break;

        // AI Tools
        case 'ai-summarize':
          setProgress('Analyzing document...');
          const summary = await summarizePDF(files[0], summaryLength, setProgress);
          setResult(`Summary generated and downloaded!\n\nPreview:\n${summary.substring(0, 500)}...`);
          break;

        case 'ai-chat-pdf':
          if (!chatQuestion.trim()) throw new Error('Please enter a question');
          setProgress('Searching document...');
          const chatResult = await chatWithPDF(files[0], chatQuestion, setProgress);
          setChatHistory([...chatHistory, { question: chatQuestion, answer: chatResult.answer }]);
          setChatQuestion('');
          setResult('');
          setStatus('success');
          setProgress('');
          return;

        case 'ocr-pdf':
          setProgress('Initializing OCR...');
          await ocrPDF(files[0], ocrLanguage, setProgress);
          setResult('Text extracted using OCR! Download started.');
          break;

        default:
          throw new Error('This tool is not available yet.');
      }
      setStatus('success');
      setProgress('');
    } catch (err) {
      setStatus('error');
      setProgress('');
      setError(err instanceof Error ? err.message : 'An error occurred while processing your file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getAcceptedFileTypes = (): string => {
    switch (toolId) {
      case 'jpg-to-pdf':
        return 'image/jpeg,image/png,image/gif,image/webp';
      case 'compress-image':
      case 'resize-image':
      case 'crop-image':
        return 'image/jpeg,image/png,image/gif,image/webp';
      case 'png-to-jpg':
        return 'image/png';
      case 'csv-to-excel':
        return '.csv,text/csv';
      case 'excel-to-csv':
      case 'excel-to-pdf':
        return '.xlsx,.xls';
      case 'json-to-csv':
        return '.json,application/json';
      case 'xml-to-json':
        return '.xml,application/xml,text/xml';
      case 'word-to-pdf':
        return '.docx,.doc';
      case 'pptx-to-pdf':
        return '.pptx,.ppt';
      case 'html-to-pdf':
        return '.html,.htm';
      default:
        return 'application/pdf';
    }
  };

  const isMultipleFilesAllowed = (): boolean => {
    return toolId === 'merge-pdf' || toolId === 'jpg-to-pdf';
  };

  if (!tool) {
    return (
      <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
            Tool Not Found
          </h1>
          <Link to="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isComingSoon = tool.badge === 'coming-soon';

  const getToolIcon = () => {
    if (tool.category === 'image') return <ImageIcon className="w-8 h-8" />;
    if (tool.category === 'ai') return <Sparkles className="w-8 h-8" />;
    return <FileText className="w-8 h-8" />;
  };

  return (
    <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Tools
          </Link>

          {/* Tool Header */}
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
            >
              {getToolIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                  darkMode ? 'text-white' : 'text-secondary'
                }`}>
                  {tool.name}
                </h1>
                {tool.badge === 'beta' && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    Beta
                  </span>
                )}
              </div>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {tool.description}
              </p>
            </div>
          </div>

          {/* Limitations Warning for Beta tools */}
          {tool.limitations && !isComingSoon && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
              darkMode ? 'bg-amber-900/20 border border-amber-800/30' : 'bg-amber-50 border border-amber-200'
            }`}>
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`font-medium ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                  Limitations
                </p>
                <p className={`text-sm ${darkMode ? 'text-amber-400/80' : 'text-amber-600'}`}>
                  {tool.limitations}
                </p>
              </div>
            </div>
          )}

          {isComingSoon ? (
            /* Coming Soon State */
            <div className={`rounded-3xl border p-12 text-center ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-muted border-border'
            }`}>
              <div className="w-20 h-20 rounded-3xl bg-warning/10 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-warning" />
              </div>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Coming Soon
              </h2>
              <p className={`text-base mb-4 max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {tool.limitations || 'This tool requires additional infrastructure to work properly.'}
              </p>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Check out our other fully functional tools while we work on this feature.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all"
              >
                Explore Working Tools
              </Link>
            </div>
          ) : (
            <>
              {/* Upload Interface */}
              <div className={`rounded-3xl border p-8 mb-6 ${
                darkMode ? 'bg-gray-900 border-gray-800' : 'bg-muted border-border'
              }`}>
                {files.length === 0 ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer hover:border-primary ${
                      darkMode ? 'border-gray-700 hover:bg-gray-800/50' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                      Drop your files here
                    </h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                      or click to browse from your computer
                    </p>
                    <span className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all inline-block">
                      Select Files
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept={getAcceptedFileTypes()}
                      multiple={isMultipleFilesAllowed()}
                      onChange={handleFileInput}
                    />
                    <p className={`text-xs mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {isMultipleFilesAllowed() && 'Multiple files allowed • '}
                      All processing happens in your browser
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* File List */}
                    <div className="space-y-3 mb-6">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 rounded-xl ${
                            darkMode ? 'bg-gray-800' : 'bg-white border border-border'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-primary" />
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-secondary'}`}>
                                {file.name}
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                                {formatFileSize(file.size)}
                                {pdfInfo && index === 0 && ` • ${pdfInfo.pageCount} pages`}
                                {imageDimensions && index === 0 && ` • ${imageDimensions.width}×${imageDimensions.height}px`}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className={`p-2 rounded-lg transition-colors ${
                              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                            }`}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add More Files */}
                    {isMultipleFilesAllowed() && (
                      <label className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer mb-6 ${
                        darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <Upload className="w-5 h-5 text-primary" />
                        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Add more files
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept={getAcceptedFileTypes()}
                          multiple
                          onChange={(e) => {
                            if (e.target.files) {
                              setFiles([...files, ...Array.from(e.target.files)]);
                            }
                          }}
                        />
                      </label>
                    )}

                    {/* Tool-specific Options */}
                    {toolId === 'split-pdf' && pdfInfo && (
                      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-border'}`}>
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                          Extract Pages
                        </h4>
                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>From</label>
                            <input
                              type="number"
                              min={1}
                              max={pdfInfo.pageCount}
                              value={pageRange.start}
                              onChange={(e) => setPageRange({ ...pageRange, start: parseInt(e.target.value) || 1 })}
                              className={`w-20 ml-2 px-3 py-2 rounded-lg border ${
                                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-border'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>To</label>
                            <input
                              type="number"
                              min={1}
                              max={pdfInfo.pageCount}
                              value={pageRange.end}
                              onChange={(e) => setPageRange({ ...pageRange, end: parseInt(e.target.value) || 1 })}
                              className={`w-20 ml-2 px-3 py-2 rounded-lg border ${
                                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-border'
                              }`}
                            />
                          </div>
                          <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            of {pdfInfo.pageCount} pages
                          </span>
                        </div>
                      </div>
                    )}

                    {toolId === 'rotate-pdf' && (
                      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-border'}`}>
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                          Rotation Angle
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[90, 180, 270].map((deg) => (
                            <button
                              key={deg}
                              onClick={() => setRotation(deg)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                rotation === deg
                                  ? 'bg-primary text-white'
                                  : darkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <RotateCw className="w-4 h-4" />
                              {deg}°
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {toolId === 'watermark-pdf' && (
                      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-border'}`}>
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                          Watermark Text
                        </h4>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Enter watermark text"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-border'
                          }`}
                        />
                      </div>
                    )}

                    {toolId === 'page-numbers' && (
                      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-border'}`}>
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                          Position
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: 'bottom-left', label: 'Bottom Left' },
                            { value: 'bottom-center', label: 'Bottom Center' },
                            { value: 'bottom-right', label: 'Bottom Right' },
                          ].map((pos) => (
                            <button
                              key={pos.value}
                              onClick={() => setPageNumberPosition(pos.value as typeof pageNumberPosition)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                pageNumberPosition === pos.value
                                  ? 'bg-primary text-white'
                                  : darkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {toolId === 'compress-image' && (
                      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-border'}`}>
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                          Quality: {Math.round(imageQuality * 100)}%
                        </h4>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={imageQuality}
                          onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                          className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-sm mt-1">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Smaller file</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Better quality</span>
                        </div>
                      </div>
                    )}

                    {toolId === 'resize-image' && imageDimensions && (
                      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-border'}`}>
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                          New Dimensions (Original: {imageDimensions.width}×{imageDimensions.height}px)
                        </h4>
                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Width</label>
                            <input
                              type="number"
                              value={resizeDimensions.width}
                              onChange={(e) => setResizeDimensions({ ...resizeDimensions, width: parseInt(e.target.value) || 100 })}
                              className={`w-24 ml-2 px-3 py-2 rounded-lg border ${
                                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-border'
                              }`}
                            />
                          </div>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>×</span>
                          <div>
                            <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Height</label>
                            <input
                              type="number"
                              value={resizeDimensions.height}
                              onChange={(e) => setResizeDimensions({ ...resizeDimensions, height: parseInt(e.target.value) || 100 })}
                              className={`w-24 ml-2 px-3 py-2 rounded-lg border ${
                                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-border'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {toolId === 'crop-image' && imageDimensions && (
                      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-border'}`}>
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                          Crop Area (Image: {imageDimensions.width}×{imageDimensions.height}px)
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <label className={`text-sm block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>X</label>
                            <input
                              type="number"
                              min={0}
                              value={cropSettings.x}
                              onChange={(e) => setCropSettings({ ...cropSettings, x: parseInt(e.target.value) || 0 })}
                              className={`w-full px-3 py-2 rounded-lg border ${
                                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-border'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`text-sm block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Y</label>
                            <input
                              type="number"
                              min={0}
                              value={cropSettings.y}
                              onChange={(e) => setCropSettings({ ...cropSettings, y: parseInt(e.target.value) || 0 })}
                              className={`w-full px-3 py-2 rounded-lg border ${
                                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-border'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`text-sm block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Width</label>
                            <input
                              type="number"
                              min={1}
                              value={cropSettings.width}
                              onChange={(e) => setCropSettings({ ...cropSettings, width: parseInt(e.target.value) || 100 })}
                              className={`w-full px-3 py-2 rounded-lg border ${
                                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-border'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`text-sm block mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Height</label>
                            <input
                              type="number"
                              min={1}
                              value={cropSettings.height}
                              onChange={(e) => setCropSettings({ ...cropSettings, height: parseInt(e.target.value) || 100 })}
                              className={`w-full px-3 py-2 rounded-lg border ${
                                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-border'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Options */}
                    {toolId === 'ai-summarize' && (
                      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-border'}`}>
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                          Summary Length
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(['short', 'medium', 'long'] as const).map((len) => (
                            <button
                              key={len}
                              onClick={() => setSummaryLength(len)}
                              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                                summaryLength === len
                                  ? 'bg-primary text-white'
                                  : darkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {len} ({len === 'short' ? '3' : len === 'medium' ? '5' : '8'} key points)
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {toolId === 'ai-chat-pdf' && (
                      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-border'}`}>
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                          Search Your Document
                        </h4>
                        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Enter keywords or questions to find relevant passages in your document.
                        </p>
                        {chatHistory.length > 0 && (
                          <div className={`mb-4 max-h-64 overflow-y-auto space-y-3 p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                            {chatHistory.map((item, i) => (
                              <div key={i}>
                                <p className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Q: {item.question}</p>
                                <p className={`mt-1 text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={chatQuestion}
                            onChange={(e) => setChatQuestion(e.target.value)}
                            placeholder="What is this document about?"
                            onKeyDown={(e) => e.key === 'Enter' && processFiles()}
                            className={`flex-1 px-4 py-3 rounded-lg border ${
                              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-border'
                            }`}
                          />
                          <button
                            onClick={processFiles}
                            disabled={status === 'processing' || !chatQuestion.trim()}
                            className="px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {toolId === 'ocr-pdf' && (
                      <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white border border-border'}`}>
                        <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                          Document Language
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: 'eng', label: 'English' },
                            { value: 'spa', label: 'Spanish' },
                            { value: 'fra', label: 'French' },
                            { value: 'deu', label: 'German' },
                          ].map((lang) => (
                            <button
                              key={lang.value}
                              onClick={() => setOcrLanguage(lang.value as typeof ocrLanguage)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                ocrLanguage === lang.value
                                  ? 'bg-primary text-white'
                                  : darkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {lang.label}
                            </button>
                          ))}
                        </div>
                        <p className={`text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          ⏱️ OCR takes 1-2 minutes per page. Best for scanned documents.
                        </p>
                      </div>
                    )}

                    {/* Process Button */}
                    {toolId !== 'ai-chat-pdf' && (
                      <button
                        onClick={processFiles}
                        disabled={status === 'processing'}
                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                          status === 'processing'
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25'
                        }`}
                      >
                        {status === 'processing' ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {progress || 'Processing...'}
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Process & Download
                          </>
                        )}
                      </button>
                    )}

                    {/* Status Messages */}
                    {status === 'success' && result && (
                      <div className="mt-4 p-4 rounded-xl bg-success/10 border border-success/20">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <p className="text-success font-medium whitespace-pre-wrap">{result}</p>
                        </div>
                      </div>
                    )}

                    {status === 'error' && (
                      <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-red-500 font-medium">{error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Shield, label: 'Secure & Private', desc: 'Files never leave your browser' },
                  { icon: Zap, label: 'Fast Processing', desc: 'No upload/download wait times' },
                  { icon: CheckCircle, label: '100% Free', desc: 'No registration required' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${
                      darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-border'
                    }`}
                  >
                    <feature.icon className="w-5 h-5 text-primary mb-2" />
                    <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                      {feature.label}
                    </h4>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
