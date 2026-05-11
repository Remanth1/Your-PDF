import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import {
  Combine,
  Image as ImageIcon,
  FileDown,
  FileText,
  FileType,
  ScanText,
  FileVideo,
  Scissors,
  RotateCw,
  Table2,
  Brain,
  ShieldCheck,
  Zap,
  HeartOff,
  Lock,
  Sparkles,
  Clock,
  Star,
  BookMarked,
  Zap as ZapIcon,
  Code2,
} from "lucide-react";
import { getMessagingCopy, getMessagingVariant } from "@/lib/landing-messaging";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    m: typeof search.m === "string" ? search.m : undefined,
  }),
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

const allTools = [
  { to: "/merge-pdf", icon: Combine, title: "Merge PDF", desc: "Combine documents without uploading anywhere.", category: "pdf" },
  { to: "/split-pdf", icon: Scissors, title: "Split PDF", desc: "Extract pages into a new file.", category: "pdf" },
  { to: "/rotate-pdf", icon: RotateCw, title: "Rotate PDF", desc: "Rotate PDF pages instantly.", category: "pdf" },
  { to: "/compress-pdf", icon: FileDown, title: "Compress PDF", desc: "Shrink PDF file size dramatically.", category: "pdf" },
  { to: "/ocr-pdf", icon: ScanText, title: "OCR PDF", desc: "Make scanned documents searchable.", category: "pdf" },
  { to: "/word-to-pdf", icon: FileType, title: "Word to PDF", desc: "Convert .docx files to PDF instantly.", category: "pdf" },
  { to: "/pdf-to-word", icon: FileText, title: "PDF to Word", desc: "Extract text into editable .docx.", category: "pdf" },
  { to: "/jpg-to-pdf", icon: ImageIcon, title: "JPG to PDF", desc: "Turn images into a single PDF.", category: "pdf" },
  { to: "/jpg-to-png", icon: ImageIcon, title: "JPG to PNG", desc: "Browser-based image conversion.", category: "image" },
  { to: "/png-to-jpg", icon: ImageIcon, title: "PNG to JPG", desc: "Fast local conversion to JPG.", category: "image" },
  { to: "/json-to-csv", icon: Table2, title: "JSON to CSV", desc: "Transform JSON data to CSV.", category: "data" },
  { to: "/csv-to-json", icon: Table2, title: "CSV to JSON", desc: "Convert CSV rows to JSON.", category: "data" },
  { to: "/xml-to-json", icon: Table2, title: "XML to JSON", desc: "Convert XML structures to JSON.", category: "data" },
  { to: "/yaml-to-json", icon: Table2, title: "YAML to JSON", desc: "Normalize YAML to JSON.", category: "data" },
  { to: "/json-to-yaml", icon: Table2, title: "JSON to YAML", desc: "Export JSON as YAML.", category: "data" },
  { to: "/mp4-to-mp3", icon: FileVideo, title: "MP4 to MP3", desc: "Extract audio from MP4 videos.", category: "data" },
  { to: "/ai-pdf", icon: Brain, title: "AI PDF Insights", desc: "Intelligent document analysis.", category: "ai" },
] as const;

const pdfTools = allTools.filter((t) => t.category === "pdf");
const imageTools = allTools.filter((t) => t.category === "image");
const dataTools = allTools.filter((t) => t.category === "data");
const aiTools = allTools.filter((t) => t.category === "ai");
const mostUsedTools = ["/merge-pdf", "/compress-pdf", "/pdf-to-word"] as const;

// Tool category component
const ToolCategory = ({ 
  name, 
  tools, 
  variant 
}: { 
  name: string; 
  tools: typeof pdfTools; 
  variant: string 
}) => (
  <div className="mb-16">
    <h3 className="mb-6 text-2xl font-bold text-foreground">{name}</h3>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tools.map((tool) => {
        const isMostUsed = mostUsedTools.includes(tool.to as any);
        return (
          <Link
            key={tool.to}
            to={tool.to}
            className="group"
            onClick={() => trackEvent("tool_card_click", { tool: tool.to, variant })}
          >
            <Card className="relative h-full p-6 transition-all duration-150 hover:-translate-y-1 hover:shadow-lg">
              {isMostUsed && (
                <div className="absolute right-3 top-3 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Most used
                </div>
              )}
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white transition-transform group-hover:scale-110">
                <tool.icon className="h-5 w-5" />
              </span>
              <h4 className="text-lg font-semibold text-foreground">{tool.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{tool.desc}</p>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                Convert now →
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  </div>
);

function Index() {
  const { m } = Route.useSearch();
  const copy = getMessagingCopy(getMessagingVariant(m));
  const variant = getMessagingVariant(m);

  useEffect(() => {
    trackEvent("landing_variant_view", { variant });
  }, [variant]);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-indigo-100 opacity-40 blur-3xl" />
          <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-blue-100 opacity-40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <PrivacyBadge />
          
          <h1 className="mt-8 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Your files never leave your device.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Convert, merge, compress, and edit PDFs in your browser. 
            <br />
            <span className="font-semibold">No uploads. No accounts. No tracking.</span>
          </p>

          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span className="text-green-800">Everything runs locally on your computer</span>
          </div>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/merge-pdf">
              <Button 
                size="lg" 
                className="h-12 px-8 text-base font-semibold"
                onClick={() => trackEvent("hero_cta_click", { variant, cta: "primary" })}
              >
                Start Converting Free
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-8 text-base font-semibold"
              onClick={() => {
                document.getElementById("trust")?.scrollIntoView({ behavior: "smooth" });
                trackEvent("hero_cta_click", { variant, cta: "secondary" });
              }}
            >
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* TOOLS SECTION - CATEGORIZED */}
      <section id="tools" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Core Features</p>
          <h2 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
            Everything you need, nothing you don't
          </h2>
        </div>

        <ToolCategory name="PDF Tools" tools={pdfTools} variant={variant} />
        <ToolCategory name="Image Tools" tools={imageTools} variant={variant} />
        <ToolCategory name="Data Tools" tools={dataTools} variant={variant} />

        {/* AI SECTION - PREMIUM */}
        <div className="mt-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white sm:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Coming Soon
              </div>
              <h3 className="mt-4 text-4xl font-bold sm:text-5xl">AI PDF Insights</h3>
              <p className="mt-4 text-lg text-white/90">
                Intelligent document analysis powered by AI. Summarize, extract, and understand your PDFs instantly.
              </p>
              
              <ul className="mt-8 space-y-3">
                <li className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Summarize long PDFs in seconds</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Extract tables and data automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Search across all your PDFs with smart matching</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Understand document structure instantly</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link to="/ai-pdf">
                  <Button 
                    size="lg"
                    className="h-12 px-8 bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
                    onClick={() => trackEvent("ai_cta_click", { variant })}
                  >
                    Try AI Features Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 lg:auto-rows-max">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-white hover:bg-white/15 transition-colors">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <Brain className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">Smart Summarization</h4>
                <p className="mt-2 text-sm text-white/80">
                  Extract key points and insights from long documents automatically.
                </p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-white hover:bg-white/15 transition-colors">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <Table2 className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">Extract Tables</h4>
                <p className="mt-2 text-sm text-white/80">
                  Automatically identify and convert PDF tables to CSV or JSON.
                </p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-white hover:bg-white/15 transition-colors">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <ScanText className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">OCR + Search</h4>
                <p className="mt-2 text-sm text-white/80">
                  Make scanned documents searchable and fully editable.
                </p>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-white hover:bg-white/15 transition-colors">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <Code2 className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">Smart Parsing</h4>
                <p className="mt-2 text-sm text-white/80">
                  Auto-detect invoices, forms, and extract structured data.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST ARCHITECTURE SECTION */}
      <section id="trust" className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Security & Privacy</p>
            <h2 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
              How Your Privacy is Protected
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Transparent, verifiable privacy by design
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Lock,
                title: "Everything Stays Local",
                description: "Your files run on your device using WebAssembly and JavaScript. We never see your data, even during conversion.",
              },
              {
                icon: ShieldCheck,
                title: "Nothing Logged",
                description: "No file names, no IP addresses, no behavioral tracking. Zero data collection except essential analytics.",
              },
              {
                icon: ZapIcon,
                title: "Auto-Cleanup",
                description: "Temporary files are automatically deleted immediately after conversion. Your browser cache is under your control.",
              },
              {
                icon: Code2,
                title: "Open & Verifiable",
                description: "Built on open standards. No proprietary algorithms. Auditable, transparent, no vendor lock-in.",
              },
            ].map((item) => (
              <Card key={item.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                  <item.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* RETENTION FEATURES SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Power Features</p>
          <h2 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
            Work Faster with Fileforge
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: Clock, title: "Recent Files", desc: "Access your recent conversions instantly." },
            { icon: Star, title: "Pin Favorites", desc: "Use Merge PDF daily? Pin it to the top." },
            { icon: Combine, title: "Batch Converting", desc: "Convert 10 files at once, download all together." },
            { icon: ZapIcon, title: "Keyboard Shortcuts", desc: "Press 'M' for Merge, 'C' for Compress." },
            { icon: BookMarked, title: "Install as App", desc: "Add Fileforge to desktop or home screen." },
          ].map((item) => (
            <Card key={item.title} className="p-5 text-center hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <item.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="text-base font-semibold text-foreground">{item.title}</h4>
              <p className="mt-2 text-xs text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">FAQs</p>
            <h2 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
              Quick Answers About Fileforge
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                q: "Do you track me?",
                a: "No. We don't track users. We only log page views anonymously to understand usage. No cookies, no user profiles.",
              },
              {
                q: "Why is this better than Smallpdf?",
                a: "Those tools upload files to their servers. Fileforge runs entirely on your device. No account needed, faster speeds, genuinely private.",
              },
              {
                q: "What if your servers go down?",
                a: "Most tools work completely offline. Your browser does the work. Servers only support advanced AI features.",
              },
              {
                q: "How do you make money?",
                a: "We're working on it. For now, Fileforge is free. Future plans: premium AI features, team collaboration, API access. No ads ever.",
              },
              {
                q: "Can I use this on mobile?",
                a: "Yes. The interface is fully responsive and works on modern mobile browsers. Install it as an app too.",
              },
              {
                q: "What file types are supported?",
                a: "PDFs, images (JPG, PNG), documents (Word), and data formats (JSON, CSV, XML, YAML). More coming soon.",
              },
            ].map((item) => (
              <Card key={item.q} className="p-6">
                <h3 className="font-semibold text-foreground">{item.q}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
