import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Server, Clock, CheckCircle } from 'lucide-react';

interface SecurityPageProps {
  darkMode: boolean;
}

export default function SecurityPage({ darkMode }: SecurityPageProps) {
  const features = [
    { icon: Lock, title: '256-bit SSL Encryption', desc: 'All data transfers are encrypted using industry-standard SSL/TLS protocols.' },
    { icon: Server, title: 'Secure Infrastructure', desc: 'Our servers are hosted in SOC 2 compliant data centers with 24/7 monitoring.' },
    { icon: Clock, title: 'Auto-deletion', desc: 'Files are automatically and permanently deleted within 2 hours of processing.' },
    { icon: Shield, title: 'No Data Storage', desc: 'We never store, read, or analyze the contents of your files.' },
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
            Security
          </h1>
          <p className={`text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            How we protect your files and data.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${
                  darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-border'
                }`}
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          <div className={`rounded-3xl border p-8 mb-8 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-muted border-border'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-secondary'}`}>
              Certifications & Compliance
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['SOC 2 Type II', 'GDPR', 'ISO 27001', 'HIPAA Ready'].map((cert, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border text-center ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-border'
                  }`}
                >
                  <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-secondary'}`}>
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Vulnerability Reporting
              </h2>
              <p>
                If you discover a security vulnerability, please report it responsibly to 
                security@yourpdf.com. We appreciate your help in keeping YourPDF secure.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
