import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ChevronDown, Menu, X,
  Image, Database, Sparkles,
  FileOutput, Moon, Sun, ArrowRight,
  Shield, CheckCircle, Info
} from 'lucide-react';
import { categories } from '@/data/tools';

const categoryIcons: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-5 h-5 text-red-500" />,
  FileOutput: <FileOutput className="w-5 h-5 text-blue-500" />,
  Image: <Image className="w-5 h-5 text-purple-500" />,
  Database: <Database className="w-5 h-5 text-green-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-pink-500" />,
};

const categoryDescriptions: Record<string, string> = {
  pdf: 'Merge, split, compress, and edit PDFs.',
  document: 'Convert Word, Excel, and PPTX to PDF.',
  image: 'Resize, crop, and convert images.',
  data: 'Transform CSV, JSON, and XML files.',
  ai: 'OCR, search, and summarize with AI.',
};

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const scrollToTools = () => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('tools');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? 'bg-gray-950/80 backdrop-blur-lg shadow-lg shadow-black/10 border-b border-gray-800/80'
            : 'bg-white/80 backdrop-blur-lg shadow-lg shadow-black/5 border-b border-gray-200/80'
          : darkMode
            ? 'bg-transparent border-b border-transparent'
            : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-rose-500 rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-md shadow-primary/20">
              <FileText className="w-5.5 h-5.5 text-white" />
            </div>
            <span className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-secondary'}`}>
              Your<span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-rose-500 text-transparent">PDF</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                toolsOpen
                  ? darkMode ? 'text-white bg-gray-800' : 'text-secondary bg-gray-100'
                  : darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' : 'text-gray-600 hover:text-secondary hover:bg-gray-50'
              }`}>
                All Tools
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] rounded-3xl shadow-2xl border p-4 grid grid-cols-1 gap-2 ${
                      darkMode 
                        ? 'bg-gray-900/95 border-gray-800 backdrop-blur-xl shadow-black/55' 
                        : 'bg-white/95 border-gray-100 backdrop-blur-xl shadow-black/10'
                    }`}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-t border-l pointer-events-none hidden" />
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setToolsOpen(false);
                          scrollToTools();
                        }}
                        className={`group flex items-start gap-4 p-3 rounded-2xl text-left transition-all duration-200 ${
                          darkMode 
                            ? 'hover:bg-gray-800/70 text-gray-300 hover:text-white' 
                            : 'hover:bg-gray-50 text-gray-600 hover:text-secondary'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                          darkMode ? 'bg-gray-800 group-hover:bg-gray-700' : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'
                        }`}>
                          {categoryIcons[cat.icon]}
                        </div>
                        <div>
                          <div className="text-sm font-bold flex items-center gap-1">
                            {cat.label}
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
                          </div>
                          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {categoryDescriptions[cat.id]}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link
              to="/about"
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' : 'text-gray-600 hover:text-secondary hover:bg-gray-50'
              }`}
            >
              About Us
            </Link>
            
            <Link
              to="/contact"
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' : 'text-gray-600 hover:text-secondary hover:bg-gray-50'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl transition-all duration-200 border ${
                darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800 border-gray-800 hover:border-gray-700' 
                  : 'text-gray-500 hover:text-secondary hover:bg-gray-100 border-gray-200 hover:border-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={scrollToTools}
              className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-primary to-rose-500 hover:from-rose-500 hover:to-primary text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Free
            </button>
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2.5 rounded-xl border ${
                darkMode 
                  ? 'text-gray-300 border-gray-800 hover:bg-gray-800' 
                  : 'text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`lg:hidden border-t overflow-hidden ${
              darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100 shadow-xl'
            }`}
          >
            <div className="px-4 py-6 space-y-2">
              <p className={`text-xs font-bold uppercase tracking-widest px-3 mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                Tool Categories
              </p>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setMobileOpen(false);
                    scrollToTools();
                  }}
                  className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-sm font-semibold text-left transition-all duration-200 ${
                    darkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    {categoryIcons[cat.icon]}
                  </div>
                  <div>
                    <span className="font-bold block">{cat.label}</span>
                    <span className={`text-xs font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{categoryDescriptions[cat.id]}</span>
                  </div>
                </button>
              ))}
              
              <div className={`border-t my-4 ${darkMode ? 'border-gray-900' : 'border-gray-100'}`} />
              
              <Link
                to="/about"
                className={`block px-3 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  darkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                About Us
              </Link>
              
              <Link
                to="/contact"
                className={`block px-3 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  darkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>
              
              <div className={`border-t my-4 ${darkMode ? 'border-gray-900' : 'border-gray-100'}`} />
              
              <div className="px-3 pt-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    scrollToTools();
                  }}
                  className="block w-full text-center px-4 py-3.5 bg-gradient-to-r from-primary to-rose-500 hover:from-rose-500 hover:to-primary text-white text-sm font-bold rounded-2xl shadow-lg shadow-primary/20"
                >
                  Start Free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
