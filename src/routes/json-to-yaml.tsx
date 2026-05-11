import { createFileRoute } from "@tanstack/react-router";
import { SeoToolPage } from "@/components/SeoToolPage";

export const Route = createFileRoute("/json-to-yaml")({
  head: () => ({
    meta: [
      { title: "JSON to YAML — Human-readable configs | Fileforge" },
      { name: "description", content: "Convert JSON objects into YAML for readable configuration files." },
    ],
  }),
  component: JsonToYamlPage,
});

function JsonToYamlPage() {
  return (
    <SeoToolPage
      title="JSON to YAML"
      tagline="Transform JSON documents into YAML syntax."
      description="Great for Kubernetes, CI pipelines, and human-readable config workflows."
      faqs={[
        { q: "Can I keep key ordering?", a: "Order-preservation options are being rolled out." },
        { q: "Does it support arrays?", a: "Yes, arrays are represented with YAML list syntax." },
        { q: "Can I validate output?", a: "Schema and syntax validation options are in progress." },
      ]}
    />
  );
}
