import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div>
            <h4 className="mb-2 font-semibold text-foreground">Fileforge</h4>
            <p className="text-xs">© {new Date().getFullYear()} Fileforge. Files never leave your browser.</p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-foreground">Product</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><a href="/#features" className="hover:text-foreground">Features</a></li>
              <li><a href="/#tools" className="hover:text-foreground">Tools</a></li>
              <li><a href="/#faq" className="hover:text-foreground">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-foreground">Company</h4>
            <ul className="space-y-1">
              <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground">Terms &amp; conditions</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-foreground">Resources</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:text-foreground">Help Center</Link></li>
              <li><a href="/" className="hover:text-foreground">Blog</a></li>
              <li><a href="/" className="hover:text-foreground">Developers</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>Built with privacy in mind — no uploads, no tracking by default.</div>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
