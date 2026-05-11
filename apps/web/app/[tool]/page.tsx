import type { Metadata } from "next";
import { notFound } from "next/navigation";

const TOOLS = [
  "pdf-to-word",
  "word-to-pdf",
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "jpg-to-png",
  "png-to-jpg",
  "mp4-to-mp3"
] as const;

type ToolSlug = (typeof TOOLS)[number];

function isToolSlug(value: string): value is ToolSlug {
  return (TOOLS as readonly string[]).includes(value);
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool } = await params;
  if (!isToolSlug(tool)) {
    return { title: "Not Found" };
  }

  const label = tool.replaceAll("-", " ");
  return {
    title: `${label} | Fileforge`,
    description: `Convert with ${label} using privacy-first processing.`
  };
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  if (!isToolSlug(tool)) notFound();

  const label = tool.replaceAll("-", " ");

  return (
    <main>
      <h1>{label}</h1>
      <p>Upload, process, and download with local-first privacy and secure fallback.</p>
    </main>
  );
}
