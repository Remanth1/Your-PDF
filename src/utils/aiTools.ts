import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import { saveAs } from 'file-saver';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Helper to read file as ArrayBuffer
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Extract text from PDF
const extractTextFromPDF = async (
  file: File,
  onProgress?: (message: string) => void
): Promise<{ pages: string[]; fullText: string }> => {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const pages: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) onProgress(`Reading page ${i} of ${numPages}...`);
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    // Type assertion: pdfjs returns items with str property
    const pageText = (textContent.items as Array<{ str: string }>)
      .map((item) => item.str)
      .join(' ');
    pages.push(pageText);
  }

  return {
    pages,
    fullText: pages.join('\n\n')
  };
};

// Helper to call Groq API
const callGroqAPI = async (prompt: string, systemPrompt?: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
  if (!apiKey) {
    throw new Error('Groq API key is missing. Please configure VITE_GROQ_API_KEY in your .env file.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b', // Uses the active open-source base models available on Groq
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
};

// AI Summarize - Extractive summarization using Groq
export const summarizePDF = async (
  file: File,
  summaryLength: 'short' | 'medium' | 'long' = 'medium',
  onProgress?: (message: string) => void
): Promise<string> => {
  if (onProgress) onProgress('Extracting text from PDF...');
  const { fullText } = await extractTextFromPDF(file, onProgress);
  
  if (!fullText.trim()) {
    throw new Error('No text found in PDF. The document might be scanned - try using OCR instead.');
  }
  
  if (onProgress) onProgress('Generating summary via Groq...');
  
  const lengthInstruction = {
    short: 'Write a very brief summary (around 2-3 paragraphs or bullet points).',
    medium: 'Write a medium-length detailed summary (around 4-6 paragraphs or detailed bullet points).',
    long: 'Write a comprehensive, deep-dive summary outlining all key arguments, sections, and findings.'
  }[summaryLength];

  const prompt = `Here is the full text of the document named "${file.name}":\n\n${fullText.substring(0, 40000)}\n\n${lengthInstruction}`;
  const systemPrompt = 'You are a helpful document summarizer. Summarize the text provided clearly and objectively.';

  const summary = await callGroqAPI(prompt, systemPrompt);
  
  // Save summary as text file
  const blob = new Blob([
    `DOCUMENT SUMMARY\n`,
    `${'='.repeat(50)}\n\n`,
    `Source: ${file.name}\n`,
    `Summary Length: ${summaryLength}\n`,
    `Generated: ${new Date().toLocaleString()}\n\n`,
    `${'='.repeat(50)}\n\n`,
    summary
  ], { type: 'text/plain;charset=utf-8' });
  
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}-summary.txt`);
  
  return summary;
};

// Chat with PDF - Search and find relevant content using Groq
export const chatWithPDF = async (
  file: File,
  question: string,
  onProgress?: (message: string) => void
): Promise<{ answer: string; relevantPassages: string[] }> => {
  if (onProgress) onProgress('Extracting text from PDF...');
  const { fullText } = await extractTextFromPDF(file, onProgress);
  
  if (!fullText.trim()) {
    throw new Error('No text found in PDF.');
  }
  
  if (onProgress) onProgress('Searching context & generating answer via Groq...');
  
  // Extract keywords from question
  const questionWords = question.toLowerCase()
    .match(/\b[a-z]{3,}\b/g) || [];
  
  const stopWords = new Set([
    'what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how',
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'this', 'that'
  ]);
  
  const keywords = questionWords.filter(w => !stopWords.has(w));
  
  // Split text into chunks (paragraphs or sections)
  const chunks = fullText
    .split(/\n\n+/)
    .filter(chunk => chunk.trim().length > 50);
  
  // Score each chunk based on keyword matches
  const scoredChunks = chunks.map(chunk => {
    const chunkLower = chunk.toLowerCase();
    let score = 0;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = chunkLower.match(regex);
      if (matches) {
        score += matches.length * 10;
      }
      // Partial matches
      if (chunkLower.includes(keyword)) {
        score += 5;
      }
    });
    
    return { chunk, score };
  });
  
  // Get top relevant chunks
  const relevantChunks = scoredChunks
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(c => c.chunk.trim());
  
  // Use the relevant chunks as context if found, otherwise send the document start as context
  const contextText = relevantChunks.length > 0 
    ? relevantChunks.join('\n\n') 
    : fullText.substring(0, 8000);

  const prompt = `Context from the document "${file.name}":\n\n${contextText}\n\nQuestion: ${question}\n\nAnswer the question concisely using only the provided context. If the answer cannot be found in the context, say "I cannot find the answer in the document."`;
  const systemPrompt = 'You are a document QA assistant. Answer the user\'s question accurately based on the provided context.';

  const answer = await callGroqAPI(prompt, systemPrompt);
  
  return {
    answer,
    relevantPassages: relevantChunks.length > 0 ? relevantChunks : [contextText.substring(0, 1000)]
  };
};

// AI Translate PDF - Basic word-by-word translation using a dictionary approach
// Note: For production, you'd use a real translation API
export const translatePDF = async (
  file: File,
  targetLanguage: 'spanish' | 'french' | 'german' | 'italian' | 'portuguese',
  onProgress?: (message: string) => void
): Promise<void> => {
  if (onProgress) onProgress('Extracting text from PDF...');
  const { fullText } = await extractTextFromPDF(file, onProgress);
  
  if (!fullText.trim()) {
    throw new Error('No text found in PDF.');
  }
  
  if (onProgress) onProgress('Translating text...');
  
  // Basic translation dictionaries (limited vocabulary for demo)
  const dictionaries: Record<string, Record<string, string>> = {
    spanish: {
      'the': 'el/la', 'a': 'un/una', 'is': 'es', 'are': 'son', 'was': 'era',
      'and': 'y', 'or': 'o', 'but': 'pero', 'not': 'no', 'with': 'con',
      'for': 'para', 'from': 'de', 'to': 'a', 'in': 'en', 'on': 'sobre',
      'this': 'este/esta', 'that': 'ese/esa', 'it': 'ello', 'we': 'nosotros',
      'you': 'tú/usted', 'they': 'ellos', 'he': 'él', 'she': 'ella',
      'document': 'documento', 'page': 'página', 'text': 'texto',
      'important': 'importante', 'information': 'información',
      'please': 'por favor', 'thank': 'gracias', 'hello': 'hola',
      'good': 'bueno', 'new': 'nuevo', 'first': 'primero', 'last': 'último'
    },
    french: {
      'the': 'le/la', 'a': 'un/une', 'is': 'est', 'are': 'sont', 'was': 'était',
      'and': 'et', 'or': 'ou', 'but': 'mais', 'not': 'ne pas', 'with': 'avec',
      'for': 'pour', 'from': 'de', 'to': 'à', 'in': 'dans', 'on': 'sur',
      'this': 'ce/cette', 'that': 'ce/cette', 'it': 'il/elle', 'we': 'nous',
      'you': 'vous/tu', 'they': 'ils/elles', 'he': 'il', 'she': 'elle',
      'document': 'document', 'page': 'page', 'text': 'texte',
      'important': 'important', 'information': 'information',
      'please': 's\'il vous plaît', 'thank': 'merci', 'hello': 'bonjour',
      'good': 'bon', 'new': 'nouveau', 'first': 'premier', 'last': 'dernier'
    },
    german: {
      'the': 'der/die/das', 'a': 'ein/eine', 'is': 'ist', 'are': 'sind', 'was': 'war',
      'and': 'und', 'or': 'oder', 'but': 'aber', 'not': 'nicht', 'with': 'mit',
      'for': 'für', 'from': 'von', 'to': 'zu', 'in': 'in', 'on': 'auf',
      'this': 'dies', 'that': 'das', 'it': 'es', 'we': 'wir',
      'you': 'du/Sie', 'they': 'sie', 'he': 'er', 'she': 'sie',
      'document': 'Dokument', 'page': 'Seite', 'text': 'Text',
      'important': 'wichtig', 'information': 'Information',
      'please': 'bitte', 'thank': 'danke', 'hello': 'hallo',
      'good': 'gut', 'new': 'neu', 'first': 'erste', 'last': 'letzte'
    },
    italian: {
      'the': 'il/la', 'a': 'un/una', 'is': 'è', 'are': 'sono', 'was': 'era',
      'and': 'e', 'or': 'o', 'but': 'ma', 'not': 'non', 'with': 'con',
      'for': 'per', 'from': 'da', 'to': 'a', 'in': 'in', 'on': 'su',
      'this': 'questo', 'that': 'quello', 'it': 'esso', 'we': 'noi',
      'you': 'tu/Lei', 'they': 'loro', 'he': 'lui', 'she': 'lei',
      'document': 'documento', 'page': 'pagina', 'text': 'testo',
      'important': 'importante', 'information': 'informazione',
      'please': 'per favore', 'thank': 'grazie', 'hello': 'ciao',
      'good': 'buono', 'new': 'nuovo', 'first': 'primo', 'last': 'ultimo'
    },
    portuguese: {
      'the': 'o/a', 'a': 'um/uma', 'is': 'é', 'are': 'são', 'was': 'era',
      'and': 'e', 'or': 'ou', 'but': 'mas', 'not': 'não', 'with': 'com',
      'for': 'para', 'from': 'de', 'to': 'para', 'in': 'em', 'on': 'sobre',
      'this': 'este/esta', 'that': 'esse/essa', 'it': 'ele/ela', 'we': 'nós',
      'you': 'você/tu', 'they': 'eles', 'he': 'ele', 'she': 'ela',
      'document': 'documento', 'page': 'página', 'text': 'texto',
      'important': 'importante', 'information': 'informação',
      'please': 'por favor', 'thank': 'obrigado', 'hello': 'olá',
      'good': 'bom', 'new': 'novo', 'first': 'primeiro', 'last': 'último'
    }
  };
  
  const dict = dictionaries[targetLanguage];
  
  // Translate word by word (preserving structure)
  const translatedText = fullText.replace(/\b(\w+)\b/g, (match) => {
    const lower = match.toLowerCase();
    const translation = dict[lower];
    if (translation) {
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return translation.charAt(0).toUpperCase() + translation.slice(1);
      }
      return translation;
    }
    return match; // Keep original if no translation
  });
  
  // Save translated text
  const languageNames: Record<string, string> = {
    spanish: 'Spanish', french: 'French', german: 'German',
    italian: 'Italian', portuguese: 'Portuguese'
  };
  
  const blob = new Blob([
    `TRANSLATED DOCUMENT\n`,
    `${'='.repeat(50)}\n\n`,
    `Source: ${file.name}\n`,
    `Target Language: ${languageNames[targetLanguage]}\n`,
    `Note: This is a basic word-by-word translation. For professional translations, please use a certified translation service.\n\n`,
    `${'='.repeat(50)}\n\n`,
    translatedText
  ], { type: 'text/plain;charset=utf-8' });
  
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  saveAs(blob, `${fileName}-${targetLanguage}.txt`);
};

// OCR PDF - Extract text from scanned PDFs using Tesseract.js
export const ocrPDF = async (
  file: File,
  language: 'eng' | 'spa' | 'fra' | 'deu' | 'ita' | 'por' = 'eng',
  onProgress?: (message: string) => void
): Promise<string> => {
  if (onProgress) onProgress('Initializing OCR engine...');
  
  const worker = await createWorker(language, 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(`OCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    }
  });
  
  try {
    if (onProgress) onProgress('Converting PDF pages to images...');
    
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    
    let fullText = '';
    
    for (let i = 1; i <= numPages; i++) {
      if (onProgress) onProgress(`Processing page ${i} of ${numPages}...`);
      
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Type assertion for PDFPageProxy render method
      // pdfjs-dist has inconsistent TypeScript definitions across versions
      const renderTask = (page.render({
        canvasContext: context,
        viewport: viewport,
      }) as any).promise;
      await renderTask;
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });
      
      // Run OCR on the image
      const { data: { text } } = await worker.recognize(blob);
      fullText += `\n--- Page ${i} ---\n${text}\n`;
    }
    
    await worker.terminate();
    
    // Save OCR text
    const blob = new Blob([
      `OCR EXTRACTED TEXT\n`,
      `${'='.repeat(50)}\n\n`,
      `Source: ${file.name}\n`,
      `Pages: ${numPages}\n`,
      `Language: ${language}\n`,
      `Generated: ${new Date().toLocaleString()}\n\n`,
      `${'='.repeat(50)}\n`,
      fullText
    ], { type: 'text/plain;charset=utf-8' });
    
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    saveAs(blob, `${fileName}-ocr.txt`);
    
    return fullText;
  } catch (error) {
    await worker.terminate();
    throw error;
  }
};
