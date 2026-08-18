import { motion } from 'framer-motion';
import { Check, Zap, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  'All PDF tools included',
  'Up to 50MB per file',
  'Unlimited conversions',
  'High quality output',
  'No watermarks',
  'Works on all devices',
  'Files processed locally',
  '100% private - no uploads',
];

interface PricingProps {
  darkMode: boolean;
}

export default function Pricing({ darkMode }: PricingProps) {
  const navigate = useNavigate();

  const scrollToTools = () => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('tools');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="pricing" className={`py-20 lg:py-28 ${darkMode ? 'bg-gray-950' : 'bg-muted'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            darkMode ? 'bg-success/10 text-success' : 'bg-success/10 text-success'
          }`}>
            <Gift className="w-4 h-4" />
            <span className="text-sm font-semibold">100% Free — No Credit Card Required</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-secondary'}`}>
            All Tools, Completely Free
          </h2>
          <p className={`mt-4 text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            No subscriptions, no hidden fees. Every tool is free to use, forever.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-lg mx-auto"
        >
          <div className={`relative p-8 lg:p-10 rounded-3xl border shadow-xl ${
            darkMode
              ? 'bg-gray-900 border-gray-700 shadow-black/20'
              : 'bg-white border-border shadow-black/5'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-secondary'}`}>
                  Free Forever
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  No account needed
                </p>
              </div>
            </div>

            <div className="mb-8">
              <span className={`text-5xl lg:text-6xl font-extrabold ${darkMode ? 'text-white' : 'text-secondary'}`}>
                $0
              </span>
              <span className={`text-lg ml-2 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                forever
              </span>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={scrollToTools}
              className="block w-full py-4 rounded-xl text-center text-base font-semibold bg-primary hover:bg-primary-hover text-white transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              Start Using Tools — It's Free
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
