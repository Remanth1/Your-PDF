import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, FileOutput, Image, Database, Video, Sparkles, LayoutGrid,
} from 'lucide-react';
import { tools, categories } from '@/data/tools';
import type { ToolCategory } from '@/data/tools';
import ToolCard from './ToolCard';

const categoryIconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-4 h-4" />,
  FileOutput: <FileOutput className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
};

interface ToolGridProps {
  darkMode: boolean;
  searchQuery: string;
}

export default function ToolGrid({ darkMode, searchQuery }: ToolGridProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');

  const filteredTools = useMemo(() => {
    let filtered = tools;
    if (activeCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [activeCategory, searchQuery]);

  return (
    <section id="tools" className={`py-20 lg:py-28 ${darkMode ? 'bg-gray-950' : 'bg-muted'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-secondary'}`}>
            All the Tools You Need
          </h2>
          <p className={`mt-4 text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            30+ powerful tools to handle any file conversion, compression, or transformation task.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-border'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            All Tools
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-border'
              }`}
            >
              {categoryIconMap[cat.icon]}
              <span className="hidden sm:inline">{cat.label}</span>
              <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Tool Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} darkMode={darkMode} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-16 rounded-2xl border ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-border'
            }`}
          >
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <FileText className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>
              No tools found
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
              Try a different search term or browse categories above.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
