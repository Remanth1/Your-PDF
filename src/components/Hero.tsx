import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ArrowRight, Shield, Zap, Star,
  FileText, Scissors, Minimize2, Image, FileOutput,
} from 'lucide-react';
import { tools, popularToolIds } from '@/data/tools';

const popularTools = tools.filter((t) => popularToolIds.includes(t.id));

interface HeroProps {
  darkMode: boolean;
  onSearch: (query: string) => void;
}

export default function Hero({ darkMode, onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setTimeout(() => {
      const toolsSection = document.getElementById('tools');
      if (toolsSection) {
        toolsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleChipClick = (toolId: string) => {
    navigate(`/tools/${toolId}`);
  };

  const chipIcons: Record<string, React.ReactNode> = {
    'merge-pdf': <FileText className="w-3.5 h-3.5" />,
    'compress-pdf': <Minimize2 className="w-3.5 h-3.5" />,
    'pdf-to-word': <FileOutput className="w-3.5 h-3.5" />,
    'pdf-to-jpg': <Image className="w-3.5 h-3.5" />,
    'word-to-pdf': <FileText className="w-3.5 h-3.5" />,
    'split-pdf': <Scissors className="w-3.5 h-3.5" />,
  };

  return (
    <section className={`relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
          darkMode ? 'bg-primary/10' : 'bg-primary/5'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
          darkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'
        }`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${
          darkMode ? 'bg-purple-500/5' : 'bg-purple-500/3'
        }`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">


          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`mt-8 text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] ${
              darkMode ? 'text-white' : 'text-secondary'
            }`}
          >
            Every File Tool You
            <br />
            Need in{' '}
            <span className="relative">
              <span className="text-primary">One Place</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6C50 2 150 2 198 6" stroke="#E5322D" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
              </svg>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
              darkMode ? 'text-gray-400' : 'text-muted-foreground'
            }`}
          >
            Merge, compress, convert, and transform your PDFs, documents, images,
            and more — instantly, securely, and completely free.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearch}
            className="mt-10 max-w-xl mx-auto"
          >
            <div className={`relative flex items-center rounded-2xl shadow-xl transition-shadow focus-within:shadow-2xl ${
              darkMode
                ? 'bg-gray-800 shadow-black/20 border border-gray-700'
                : 'bg-white shadow-black/10 border border-border'
            }`}>
              <Search className={`absolute left-4 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools... (e.g., merge PDF, compress image)"
                className={`w-full pl-12 pr-4 py-4 rounded-2xl text-base bg-transparent outline-none placeholder:text-gray-400 ${
                  darkMode ? 'text-white' : 'text-secondary'
                }`}
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 flex items-center gap-1.5"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>

          {/* Popular Tools Chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Popular:</span>
            {popularTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleChipClick(tool.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {chipIcons[tool.id]}
                {tool.name}
              </button>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`mt-12 flex flex-wrap justify-center gap-6 sm:gap-10 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">100% Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium">Browser-based</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Instant Results</span>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
