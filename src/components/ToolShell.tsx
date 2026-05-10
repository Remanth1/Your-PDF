import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PrivacyBadge } from "@/components/PrivacyBadge";

export interface ToolFAQ {
  q: string;
  a: string;
}

interface ToolShellProps {
  title: string;
  tagline: string;
  description: string;
  children: ReactNode;
  howItWorks: string[];
  faqs: ToolFAQ[];
}

export function ToolShell({ title, tagline, description, children, howItWorks, faqs }: ToolShellProps) {
  return (
    <div>
      <section
        className="border-b border-border"
        style={{ background: "var(--gradient-soft)" }}
      >
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <PrivacyBadge />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8">{children}</section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2 className="mb-3 text-xl font-semibold">How it works</h2>
        <ol className="space-y-2 text-muted-foreground">
          {howItWorks.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="mb-2 text-xl font-semibold">About this tool</h2>
        <p className="mb-6 text-muted-foreground">{description}</p>

        <h2 className="mb-3 text-xl font-semibold">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
