import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  darkMode: boolean;
}

export default function PrivacyPage({ darkMode }: PrivacyPageProps) {
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
            Privacy Policy
          </h1>
          <p className={`text-sm mb-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Last updated: January 1, 2025
          </p>

          <div className={`space-y-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Overview
              </h2>
              <p>
                At YourPDF, we take your privacy seriously. This policy describes how we collect, 
                use, and protect your information when you use our services.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Information We Collect
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Files you upload for processing (temporarily stored)</li>
                <li>Basic usage analytics (pages visited, tools used)</li>
                <li>Technical information (browser type, device type)</li>
                <li>IP address for security purposes</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To provide and improve our services</li>
                <li>To process your file conversions</li>
                <li>To analyze usage patterns and optimize performance</li>
                <li>To prevent abuse and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                File Security
              </h2>
              <p>
                All files are transmitted using 256-bit SSL encryption. Files are processed on 
                secure servers and automatically deleted within 2 hours of processing. We do not 
                access, read, or share the contents of your files.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Cookies
              </h2>
              <p>
                We use essential cookies to ensure our website functions properly. We also use 
                analytics cookies to understand how visitors interact with our site. You can 
                manage cookie preferences in your browser settings.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Your Rights
              </h2>
              <p>
                You have the right to access, correct, or delete your personal information. 
                Contact us at privacy@yourpdf.com for any privacy-related requests.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Contact
              </h2>
              <p>
                For privacy inquiries, please contact us at privacy@yourpdf.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
