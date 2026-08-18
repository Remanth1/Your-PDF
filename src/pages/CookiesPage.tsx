import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface CookiesPageProps {
  darkMode: boolean;
}

export default function CookiesPage({ darkMode }: CookiesPageProps) {
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
            Cookie Policy
          </h1>
          <p className={`text-sm mb-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Last updated: January 1, 2025
          </p>

          <div className={`space-y-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                What Are Cookies?
              </h2>
              <p>
                Cookies are small text files stored on your device when you visit websites. 
                They help websites remember your preferences and improve your experience.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Cookies We Use
              </h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-border'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>Essential Cookies</h3>
                  <p className="text-sm">Required for basic site functionality. Cannot be disabled.</p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-border'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>Preference Cookies</h3>
                  <p className="text-sm">Remember your settings like dark mode preference.</p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-border'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>Analytics Cookies</h3>
                  <p className="text-sm">Help us understand how visitors use our site to improve it.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Managing Cookies
              </h2>
              <p>
                You can control cookies through your browser settings. Note that disabling 
                certain cookies may affect site functionality.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Contact
              </h2>
              <p>
                Questions about our cookie policy? Contact us at privacy@yourpdf.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
