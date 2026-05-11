import { createFileRoute } from "@tanstack/react-router";
import { SeoToolPage } from "@/components/SeoToolPage";

export const Route = createFileRoute("/xml-to-json")({
  head: () => ({
    meta: [
      { title: "XML to JSON — Transform XML structures | Fileforge" },
      { name: "description", content: "Convert XML documents into JSON for modern app workflows." },
    ],
  }),
  component: XmlToJsonPage,
});

function XmlToJsonPage() {
  return (
    <SeoToolPage
      title="XML to JSON"
      tagline="Transform XML payloads to JSON objects."
      description="Useful for API migrations, integration projects, and legacy system modernization."
      faqs={[
        { q: "Are attributes preserved?", a: "Attribute-to-field mapping options are included in upcoming updates." },
        { q: "Can I validate XML first?", a: "Schema validation is on the short-term roadmap." },
        { q: "Will order be preserved?", a: "Element ordering controls will be configurable." },
      ]}
    />
  );
}
