import { Link } from "@tanstack/react-router";
import { FileStack } from "lucide-react";

const tools = [
  { to: "/merge-pdf", label: "Merge PDF" },
  { to: "/jpg-to-pdf", label: "JPG to PDF" },
  { to: "/compress-pdf", label: "Compress" },
  { to: "/word-to-pdf", label: "Word to PDF" },
  { to: "/pdf-to-word", label: "PDF to Word" },
  { to: "/ocr-pdf", label: "OCR" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <FileStack className="h-4 w-4" />
          </span>
          <span>Fileforge</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {tools.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
