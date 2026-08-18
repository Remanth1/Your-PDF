import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Mail, FileText } from 'lucide-react';

interface PressPageProps {
  darkMode: boolean;
}

export default function PressPage({ darkMode }: PressPageProps) {
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
            Press Kit
          </h1>
          <p className={`text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Resources for journalists, bloggers, and media professionals.
          </p>

          <div className={`rounded-3xl border p-8 mb-8 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-muted border-border'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
              About YourPDF
            </h2>
            <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>
                YourPDF is a free online document tool platform that helps millions of users 
                convert, edit, and manage their files. Founded with the mission to make 
                document tools accessible to everyone.
              </p>
              <ul className="space-y-2">
                <li><strong>Users:</strong> 2+ million monthly active users</li>
                <li><strong>Files Processed:</strong> 50+ million files</li>
                <li><strong>Tools:</strong> 30+ free document tools</li>
                <li><strong>Uptime:</strong> 99.9% availability</li>
              </ul>
            </div>
          </div>

          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-secondary'}`}>
            Brand Assets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              { title: 'Logo Pack', desc: 'PNG, SVG, and PDF formats' },
              { title: 'Brand Guidelines', desc: 'Colors, typography, usage' },
              { title: 'Screenshots', desc: 'Product screenshots' },
              { title: 'Fact Sheet', desc: 'Company information' },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 ${
                  darkMode
                    ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    : 'bg-white border-border hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <FileText className="w-8 h-8 text-primary mb-3" />
                <h3 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {item.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download
                </span>
              </div>
            ))}
          </div>

          <div className={`rounded-2xl border p-6 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-border'
          }`}>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>
              Media Inquiries
            </h3>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
              For press inquiries, interviews, or additional information, please contact our media team.
            </p>
            <a
              href="mailto:press@yourpdf.com"
              className="inline-flex items-center gap-2 text-primary font-medium"
            >
              <Mail className="w-4 h-4" />
              press@yourpdf.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
