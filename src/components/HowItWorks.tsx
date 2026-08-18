import { motion } from 'framer-motion';
import { Upload, Settings, Download, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your File',
    description: 'Drag and drop or browse to select your file. We support PDF, Word, Excel, images, and more.',
    color: '#3B82F6',
  },
  {
    icon: Settings,
    title: 'Choose Your Tool',
    description: 'Select the conversion or transformation you need. Customize settings for the perfect output.',
    color: '#E5322D',
  },
  {
    icon: Download,
    title: 'Download Instantly',
    description: 'Your processed file is ready in seconds. Download it directly or share via a secure link.',
    color: '#16A34A',
  },
];

interface HowItWorksProps {
  darkMode: boolean;
}

export default function HowItWorks({ darkMode }: HowItWorksProps) {
  return (
    <section className={`py-20 lg:py-28 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-secondary'}`}>
            How It Works
          </h2>
          <p className={`mt-4 text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Three simple steps to transform any file. No sign-up, no software — just results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+48px)] right-[calc(-50%+48px)]">
                  <div className={`h-0.5 w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <ArrowRight className={`absolute -right-2 -top-2 w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                </div>
              )}

              {/* Step Number */}
              <div className="relative inline-flex">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${step.color}10` }}
                >
                  <step.icon className="w-10 h-10" style={{ color: step.color }} />
                </div>
                <span
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: step.color }}
                >
                  {i + 1}
                </span>
              </div>

              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                {step.title}
              </h3>
              <p className={`text-base leading-relaxed max-w-xs mx-auto ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
