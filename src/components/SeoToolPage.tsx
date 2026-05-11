import type { ReactNode } from "react";
import { ToolShell, type ToolFAQ } from "@/components/ToolShell";
import { SchemaMarkup } from "@/components/SchemaMarkup";

interface SeoToolPageProps {
  title: string;
  tagline: string;
  description: string;
  faqs: ToolFAQ[];
  children?: ReactNode;
}

export function SeoToolPage({ title, tagline, description, faqs, children }: SeoToolPageProps) {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description: tagline,
    step: [
      { "@type": "HowToStep", name: "Upload", text: "Upload your file." },
      { "@type": "HowToStep", name: "Convert", text: "Choose conversion settings and run the tool." },
      { "@type": "HowToStep", name: "Download", text: "Download the converted result." },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <ToolShell
      title={title}
      tagline={tagline}
      description={description}
      howItWorks={[
        "Upload your file.",
        "Choose conversion settings.",
        "Download the converted result.",
      ]}
      faqs={faqs}
    >
      <div className="rounded-xl border border-border bg-card px-4 py-4 text-sm text-muted-foreground">
        This SEO page is live and indexed. Conversion flow is being rolled out progressively.
      </div>
      {children}
      <SchemaMarkup id={`${title}-howto`} schema={howToSchema} />
      <SchemaMarkup id={`${title}-faq`} schema={faqSchema} />
    </ToolShell>
  );
}
