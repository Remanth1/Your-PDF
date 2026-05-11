import { pdfjs } from "@/lib/converters/pdfjs-setup";

const STOPWORDS = new Set([
  "the", "and", "to", "a", "of", "in", "is", "for", "on", "with", "as", "that", "by", "it", "or", "be", "at", "from", "an"
]);

export async function extractPdfText(file: File, maxPages = 12): Promise<string> {
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages = Math.min(maxPages, pdf.numPages);
  const chunks: string[] = [];

  for (let i = 1; i <= pages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = (content.items as Array<{ str?: string }>)
      .map((item) => item.str ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (text) chunks.push(text);
  }

  return chunks.join("\n\n");
}

export function summarizeText(text: string, maxSentences = 5): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);

  if (sentences.length <= maxSentences) return sentences;

  const freq = new Map<string, number>();
  for (const token of text.toLowerCase().match(/[a-z]{3,}/g) ?? []) {
    if (STOPWORDS.has(token)) continue;
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }

  const scored = sentences.map((sentence) => {
    const score = (sentence.toLowerCase().match(/[a-z]{3,}/g) ?? []).reduce(
      (acc, token) => acc + (freq.get(token) ?? 0),
      0,
    );
    return { sentence, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .map((s) => s.sentence);
}

export function extractTableLikeRows(text: string): string[][] {
  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 300);

  const rows: string[][] = [];
  for (const line of lines) {
    if (line.includes(",")) {
      const cols = line.split(",").map((c) => c.trim());
      if (cols.length >= 3) rows.push(cols);
      continue;
    }

    const cols = line.split(/\s{2,}|\t+/).map((c) => c.trim());
    if (cols.length >= 3) rows.push(cols);
  }

  return rows.slice(0, 40);
}
