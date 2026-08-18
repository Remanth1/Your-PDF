import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  darkMode: boolean;
}

export default function TermsPage({ darkMode }: TermsPageProps) {
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
            Terms of Service
          </h1>
          <p className={`text-sm mb-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Last updated: January 1, 2025
          </p>

          <div className={`space-y-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using YourPDF, you agree to be bound by these Terms of Service. 
                If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                2. Description of Service
              </h2>
              <p>
                YourPDF provides free online tools for document conversion, editing, and management. 
                Our services include PDF merging, splitting, compression, format conversion, and more.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                3. Acceptable Use
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Upload illegal, harmful, or copyrighted content without authorization</li>
                <li>Attempt to bypass service limitations or security measures</li>
                <li>Use automated tools to abuse our services</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Use our services for any unlawful purpose</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                4. Intellectual Property
              </h2>
              <p>
                You retain ownership of all files you upload. By using our services, you grant us 
                a temporary license to process your files solely for the purpose of providing the 
                requested service.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                5. Limitation of Liability
              </h2>
              <p>
                YourPDF is provided "as is" without warranties of any kind. We are not liable for 
                any data loss, service interruptions, or damages arising from the use of our services.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                6. Service Modifications
              </h2>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of our services 
                at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                7. Contact
              </h2>
              <p>
                For questions about these terms, please contact us at legal@yourpdf.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
