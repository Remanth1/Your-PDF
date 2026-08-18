import { motion } from 'framer-motion';
import { Star, Users, FileText, Shield, Award } from 'lucide-react';
import { testimonials } from '@/data/tools';

const stats = [
  { icon: Users, label: 'Active Users', value: '2M+' },
  { icon: FileText, label: 'Files Processed', value: '50M+' },
  { icon: Shield, label: 'Uptime', value: '99.9%' },
  { icon: Award, label: 'User Rating', value: '4.9/5' },
];

interface TestimonialsProps {
  darkMode: boolean;
}

export default function Testimonials({ darkMode }: TestimonialsProps) {
  return (
    <section className={`py-20 lg:py-28 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 p-8 rounded-3xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-muted border-border'
          }`}
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${darkMode ? 'text-primary' : 'text-primary'}`} />
              <div className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-secondary'}`}>
                {stat.value}
              </div>
              <div className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-secondary'}`}>
            Loved by Millions
          </h2>
          <p className={`mt-4 text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Join professionals worldwide who trust YourPDF for their daily workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className={`p-8 rounded-2xl border ${
                darkMode
                  ? 'bg-gray-800/50 border-gray-700'
                  : 'bg-muted border-border'
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>

              {/* Content */}
              <p className={`text-base leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-secondary'}`}>
                    {t.name}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-16 flex flex-wrap justify-center gap-8 items-center ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          {['SOC 2 Compliant', 'GDPR Ready', 'ISO 27001', 'SSL Encrypted'].map((badge) => (
            <div key={badge} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${
              darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-border bg-gray-50'
            }`}>
              <Shield className="w-4 h-4" />
              {badge}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
