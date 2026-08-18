import { motion } from 'framer-motion';
import {
  Shield, Zap, Diamond, Monitor, Layers, CloudOff,
} from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Privacy-First',
    description: 'Your files are encrypted in transit and automatically deleted after processing. We never access your data.',
    color: '#16A34A',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Most conversions complete in under 10 seconds. Our infrastructure is optimized for speed.',
    color: '#F59E0B',
  },
  {
    icon: Diamond,
    title: 'High Quality Output',
    description: 'We preserve formatting, fonts, and layout. Your converted files look exactly as intended.',
    color: '#8B5CF6',
  },
  {
    icon: Monitor,
    title: 'Works Everywhere',
    description: 'Use any browser on any device — Windows, Mac, Linux, iOS, or Android. No installation needed.',
    color: '#3B82F6',
  },
  {
    icon: Layers,
    title: 'Batch Processing',
    description: 'Process multiple files at once with our Pro plan. Save hours on repetitive tasks.',
    color: '#E5322D',
  },
  {
    icon: CloudOff,
    title: 'No Software Needed',
    description: 'Everything runs in the cloud. No downloads, no updates, no storage space wasted.',
    color: '#EC4899',
  },
];

interface BenefitsProps {
  darkMode: boolean;
}

export default function Benefits({ darkMode }: BenefitsProps) {
  return (
    <section className={`py-20 lg:py-28 ${darkMode ? 'bg-gray-950' : 'bg-muted'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-secondary'}`}>
            Why Choose YourPDF?
          </h2>
          <p className={`mt-4 text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Built for professionals who value speed, quality, and security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`group p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                darkMode
                  ? 'bg-gray-900 border-gray-800 hover:border-gray-700 hover:shadow-xl hover:shadow-black/20'
                  : 'bg-white border-border hover:border-gray-300 hover:shadow-xl hover:shadow-black/5'
              }`}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${benefit.color}10`, color: benefit.color }}
              >
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                {benefit.title}
              </h3>
              <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
