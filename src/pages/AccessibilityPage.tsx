import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Accessibility, Keyboard, Eye, MessageSquare } from 'lucide-react';

interface AccessibilityPageProps {
  darkMode: boolean;
}

export default function AccessibilityPage({ darkMode }: AccessibilityPageProps) {
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
            Accessibility
          </h1>
          <p className={`text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Our commitment to making YourPDF accessible to everyone.
          </p>

          <div className={`rounded-3xl border p-8 mb-12 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-muted border-border'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
              Our Commitment
            </h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              YourPDF is committed to ensuring digital accessibility for people with disabilities. 
              We continually improve the user experience for everyone and apply relevant 
              accessibility standards.
            </p>
          </div>

          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-secondary'}`}>
            Accessibility Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              { icon: Keyboard, title: 'Keyboard Navigation', desc: 'Full keyboard support for all interactive elements.' },
              { icon: Eye, title: 'Screen Reader Support', desc: 'Semantic HTML and ARIA labels for assistive technologies.' },
              { icon: Accessibility, title: 'Color Contrast', desc: 'WCAG AA compliant color contrast ratios.' },
              { icon: MessageSquare, title: 'Alt Text', desc: 'Descriptive alt text for all meaningful images.' },
            ].map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${
                  darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-border'
                }`}
              >
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Standards
              </h2>
              <p>
                We aim to conform to WCAG 2.1 Level AA guidelines. Our team regularly tests 
                the platform with various assistive technologies to ensure compatibility.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                Feedback
              </h2>
              <p>
                We welcome your feedback on the accessibility of YourPDF. If you encounter 
                any barriers, please contact us at accessibility@yourpdf.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
