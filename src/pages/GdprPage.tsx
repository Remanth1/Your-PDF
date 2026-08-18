import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Trash2, Download } from 'lucide-react';

interface GdprPageProps {
  darkMode: boolean;
}

export default function GdprPage({ darkMode }: GdprPageProps) {
  const rights = [
    { icon: Eye, title: 'Right to Access', desc: 'Request a copy of your personal data' },
    { icon: Shield, title: 'Right to Rectification', desc: 'Correct inaccurate personal data' },
    { icon: Trash2, title: 'Right to Erasure', desc: 'Request deletion of your data' },
    { icon: Download, title: 'Right to Portability', desc: 'Export your data in a portable format' },
  ];

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
            GDPR Compliance
          </h1>
          <p className={`text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Your rights under the General Data Protection Regulation.
          </p>

          <div className={`rounded-3xl border p-8 mb-12 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-muted border-border'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
              Our Commitment
            </h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              YourPDF is committed to protecting your privacy and complying with the GDPR. 
              We process personal data lawfully, transparently, and for specific purposes. 
              We collect only the minimum data necessary and ensure it's kept secure.
            </p>
          </div>

          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-secondary'}`}>
            Your Rights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {rights.map((right, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${
                  darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-border'
                }`}
              >
                <right.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                  {right.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {right.desc}
                </p>
              </div>
            ))}
          </div>

          <div className={`space-y-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Data Processing
              </h2>
              <p>
                Files uploaded to YourPDF are processed temporarily and automatically deleted 
                within 2 hours. We do not store, analyze, or share the contents of your files.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Exercising Your Rights
              </h2>
              <p>
                To exercise any of your GDPR rights, please contact our Data Protection Officer 
                at dpo@yourpdf.com. We will respond to your request within 30 days.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
