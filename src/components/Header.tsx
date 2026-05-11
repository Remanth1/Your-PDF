import { Link } from "@tanstack/react-router";
import { FileStack } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const tools = [
  { to: "/merge-pdf", label: "Merge PDF" },
  { to: "/split-pdf", label: "Split PDF" },
  { to: "/jpg-to-png", label: "JPG to PNG" },
  { to: "/jpg-to-pdf", label: "JPG to PDF" },
  { to: "/compress-pdf", label: "Compress" },
  { to: "/word-to-pdf", label: "Word to PDF" },
  { to: "/pdf-to-word", label: "PDF to Word" },
  { to: "/ocr-pdf", label: "OCR" },
  { to: "/ai-pdf", label: "AI PDF" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground"
          >
            <FileStack className="h-4 w-4" />
          </span>
          <span>Fileforge</span>
        </Link>
        <nav className="hidden md:flex">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground">
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[340px] gap-1 p-3 md:grid-cols-2">
                    {tools.map((tool) => (
                      <NavigationMenuLink key={tool.to} asChild>
                        <Link
                          to={tool.to}
                          className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground hover:translate-x-0.5 hover:shadow-sm"
                          activeProps={{ className: "bg-accent text-foreground" }}
                        >
                          {tool.label}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground">
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[260px] gap-1 p-3">
                    {[
                      { to: "/about", label: "About us" },
                      { to: "/privacy", label: "Privacy policy" },
                      { to: "/terms", label: "Terms & conditions" },
                    ].map((item) => (
                      <NavigationMenuLink key={item.to} asChild>
                        <Link
                          to={item.to}
                          className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground hover:translate-x-0.5 hover:shadow-sm"
                          activeProps={{ className: "bg-accent text-foreground" }}
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
    </header>
  );
}
