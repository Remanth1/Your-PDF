import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, HelpCircle } from 'lucide-react';

interface ContactPageProps {
  darkMode: boolean;
}

export default function ContactPage({ darkMode }: ContactPageProps) {
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
            Contact Us
          </h1>
          <p className={`text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Have a question or feedback? We'd love to hear from you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Mail, title: 'Email', desc: 'support@yourpdf.com', action: 'Send email' },
              { icon: MessageSquare, title: 'Live Chat', desc: 'Available 9am-5pm EST', action: 'Start chat' },
              { icon: HelpCircle, title: 'Help Center', desc: 'Browse FAQs', action: 'View FAQs' },
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
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {item.desc}
                </p>
                <span className="text-primary text-sm font-medium cursor-pointer hover:underline">
                  {item.action}
                </span>
              </div>
            ))}
          </div>

          <div className={`rounded-3xl border p-8 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-muted border-border'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-secondary'}`}>
              Send us a message
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-primary'
                        : 'bg-white border-border focus:border-primary'
                    }`}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-primary'
                        : 'bg-white border-border focus:border-primary'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-primary'
                      : 'bg-white border-border focus:border-primary'
                  }`}
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message
                </label>
                <textarea
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors resize-none ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-primary'
                      : 'bg-white border-border focus:border-primary'
                  }`}
                  placeholder="Tell us more..."
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
