import { createFileRoute } from "@tanstack/react-router";
import { SeoToolPage } from "@/components/SeoToolPage";

export const Route = createFileRoute("/yaml-to-json")({
  head: () => ({
    meta: [
      { title: "YAML to JSON — Convert config formats | Fileforge" },
      { name: "description", content: "Convert YAML configuration files to JSON with clean output." },
    ],
  }),
  component: YamlToJsonPage,
});

function YamlToJsonPage() {
  return (
    <SeoToolPage
      title="YAML to JSON"
      tagline="Convert YAML files to JSON for app tooling."
      description="Makes CI/CD configs and infrastructure docs easier to process programmatically."
      faqs={[
        { q: "Do comments carry over?", a: "Comments are not represented in JSON output." },
        { q: "Can I format JSON output?", a: "Pretty/minified output modes are planned." },
        { q: "Is this suitable for large configs?", a: "Yes, with queued mode for very large files." },
      ]}
    />
  );
}
