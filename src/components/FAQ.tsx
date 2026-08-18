import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs } from '@/data/tools';

interface FAQProps {
  darkMode: boolean;
}

export default function FAQ({ darkMode }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className={`py-20 lg:py-28 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
            darkMode ? 'bg-primary/10' : 'bg-primary/5'
          }`}>
            <HelpCircle className="w-7 h-7 text-primary" />
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-secondary'}`}>
            Frequently Asked Questions
          </h2>
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Everything you need to know about YourPDF.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`rounded-2xl border overflow-hidden transition-all ${
                openIndex === i
                  ? darkMode
                    ? 'border-gray-600 bg-gray-800/50'
                    : 'border-gray-300 bg-gray-50'
                  : darkMode
                    ? 'border-gray-800 bg-gray-800/20'
                    : 'border-border bg-white'
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors ${
                  darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                }`}
                aria-expanded={openIndex === i}
              >
                <span className={`text-base font-semibold pr-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`px-6 pb-5 text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
