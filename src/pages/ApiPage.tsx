import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Zap, Shield, Book } from 'lucide-react';

interface ApiPageProps {
  darkMode: boolean;
}

export default function ApiPage({ darkMode }: ApiPageProps) {
  const codeExample = `// Example: Convert PDF to Word
// Get API_URL from environment - NEVER hardcode endpoints
const API_URL = import.meta.env.VITE_API_URL || 'https://api.yourpdf.com';

const response = await fetch(\`\${API_URL}/v1/convert\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${YOUR_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    file_url: 'https://example.com/document.pdf',
    output_format: 'docx'
  })
});

const result = await response.json();
// Never log sensitive data or URLs
if (result.success) {
  window.location.href = result.download_url;
}`;

  return (
    <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-secondary'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${
            darkMode ? 'text-white' : 'text-secondary'
          }`}>
            Developer API
          </h1>
          <p className={`text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Integrate YourPDF tools directly into your applications with our REST API.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Zap, title: 'Fast', desc: 'Process files in seconds' },
              { icon: Shield, title: 'Secure', desc: '256-bit SSL encryption' },
              { icon: Code, title: 'Simple', desc: 'RESTful JSON API' },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border text-center ${
                  darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-border'
                }`}
              >
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className={`rounded-3xl border p-8 mb-8 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-muted border-border'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
              Quick Start
            </h2>
            <pre className={`p-4 rounded-xl overflow-x-auto text-sm ${
              darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-900 text-gray-100'
            }`}>
              <code>{codeExample}</code>
            </pre>
          </div>

          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-secondary'}`}>
            Available Endpoints
          </h2>
          <div className="space-y-3 mb-12">
            {[
              { method: 'POST', path: '/v1/convert', desc: 'Convert files between formats' },
              { method: 'POST', path: '/v1/merge', desc: 'Merge multiple PDFs' },
              { method: 'POST', path: '/v1/split', desc: 'Split PDF into pages' },
              { method: 'POST', path: '/v1/compress', desc: 'Compress PDF files' },
              { method: 'GET', path: '/v1/status/:id', desc: 'Check conversion status' },
            ].map((endpoint, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border flex items-center gap-4 ${
                  darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-border'
                }`}
              >
                <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                  endpoint.method === 'GET' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {endpoint.method}
                </span>
                <code className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-secondary'}`}>
                  {endpoint.path}
                </code>
                <span className={`text-sm ml-auto ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {endpoint.desc}
                </span>
              </div>
            ))}
          </div>

          <div className={`rounded-2xl border p-6 flex items-center gap-4 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-border'
          }`}>
            <Book className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h3 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Full Documentation
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                View complete API reference, SDKs, and code examples.
              </p>
            </div>
            <span className="ml-auto px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl cursor-pointer transition-all">
              View Docs
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
