import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import {
  Combine,
  Image as ImageIcon,
  FileDown,
  FileText,
  FileType,
  ScanText,
  ShieldCheck,
  Zap,
  HeartOff,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fileforge — Free private PDF & document tools" },
      {
        name: "description",
        content:
          "Merge, compress, convert, and OCR PDFs in your browser. No sign-up, no uploads, no ads. 100% private file conversion.",
      },
    ],
  }),
  component: Index,
});

const tools = [
  { to: "/merge-pdf", icon: Combine, title: "Merge PDF", desc: "Combine multiple PDFs into one." },
  { to: "/jpg-to-pdf", icon: ImageIcon, title: "JPG to PDF", desc: "Turn images into a single PDF." },
  { to: "/compress-pdf", icon: FileDown, title: "Compress PDF", desc: "Shrink PDF file size." },
  { to: "/word-to-pdf", icon: FileType, title: "Word to PDF", desc: "Convert .docx to PDF." },
  { to: "/pdf-to-word", icon: FileText, title: "PDF to Word", desc: "Extract text into editable .docx." },
  { to: "/ocr-pdf", icon: ScanText, title: "OCR PDF", desc: "Make scanned PDFs searchable." },
] as const;

function Index() {
  return (
    <div>
      <section style={{ background: "var(--gradient-soft)" }}>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <PrivacyBadge />
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Fast, private PDF tools.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              No uploads. No sign-up.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Merge, convert, compress and OCR documents — entirely in your browser.
            Your files never touch a server.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.to} to={t.to} className="group">
              <Card className="h-full p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
                <span
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <t.icon className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "100% private", body: "Files are processed in your browser. Nothing is uploaded." },
            { icon: Zap, title: "Genuinely fast", body: "No queues, no waiting rooms. Conversion starts instantly." },
            { icon: HeartOff, title: "No nonsense", body: "No sign-up, no aggressive paywall, no surprise emails." },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <f.icon className="mx-auto h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
