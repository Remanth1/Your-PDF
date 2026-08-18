import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';

interface CTAProps {
  darkMode: boolean;
}

export default function CTA({ darkMode }: CTAProps) {
  const navigate = useNavigate();

  const scrollToTools = () => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('tools');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className={`py-20 lg:py-28 ${darkMode ? 'bg-gray-950' : 'bg-muted'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-hover p-12 lg:p-20 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/3 rounded-full" />

          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Start Converting Files
              <br />
              for Free Today
            </h2>
            <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto">
              Process your files directly in your browser. No uploads to servers,
              no waiting, no sign-up required. 100% free and private.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={scrollToTools}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-2xl text-base hover:bg-gray-100 transition-all shadow-xl shadow-black/10 hover:shadow-2xl"
              >
                Get Started — It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/api"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl text-base hover:bg-white/20 transition-all border border-white/20"
              >
                View API Docs
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/60">
              No servers • Files never leave your device • Completely private
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
