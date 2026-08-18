import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const footerLinks = {
  'PDF Tools': [
    { label: 'Merge PDF', path: '/tools/merge-pdf' },
    { label: 'Split PDF', path: '/tools/split-pdf' },
    { label: 'Compress PDF', path: '/tools/compress-pdf' },
    { label: 'Rotate PDF', path: '/tools/rotate-pdf' },
    { label: 'Watermark PDF', path: '/tools/watermark-pdf' },
  ],
  'Convert': [
    { label: 'PDF to Word', path: '/tools/pdf-to-word' },
    { label: 'Word to PDF', path: '/tools/word-to-pdf' },
    { label: 'PDF to Excel', path: '/tools/pdf-to-excel' },
    { label: 'PDF to JPG', path: '/tools/pdf-to-jpg' },
    { label: 'JPG to PDF', path: '/tools/jpg-to-pdf' },
    { label: 'PDF to PowerPoint', path: '/tools/pdf-to-pptx' },
  ],
  'Company': [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ],
  'Legal': [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ],
};

const socialLinks = [
  { label: '𝕏', ariaLabel: 'Twitter / X' },
  { label: 'in', ariaLabel: 'LinkedIn' },
  { label: '▶', ariaLabel: 'YouTube' },
  { label: '◆', ariaLabel: 'GitHub' },
];

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  return (
    <footer className={`pt-16 pb-8 ${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-border'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Your<span className="text-primary">PDF</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed mb-6 max-w-xs ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
              Every file tool you need, in one place. Fast, secure, and free online file conversion tools.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                    darkMode
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-secondary'
                  }`}
                  aria-label={social.ariaLabel}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`text-sm transition-colors inline-flex items-center gap-1 ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-secondary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          darkMode ? 'border-gray-800' : 'border-border'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} YourPDF. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className={`text-sm ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
              Privacy
            </Link>
            <Link to="/terms" className={`text-sm ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
