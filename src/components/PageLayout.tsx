import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
  darkMode: boolean;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function PageLayout({ darkMode, title, description, children }: PageLayoutProps) {
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
            {title}
          </h1>

          {description && (
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
              {description}
            </p>
          )}

          <div className={`prose prose-lg max-w-none ${
            darkMode ? 'prose-invert' : ''
          }`}>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
