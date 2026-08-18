import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Scissors, Minimize2, RotateCw, Lock, Unlock, Stamp, Hash,
  FileDown, FileSpreadsheet, Presentation, Globe, Image, FileImage,
  Maximize2, Crop, ArrowRightLeft, Database, Braces, Code, Video,
  Film, Music, Headphones, Sparkles, MessageSquare, Languages, ScanText,
  Merge, Sheet,
} from 'lucide-react';
import type { Tool } from '@/data/tools';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Scissors, Minimize2, RotateCw, Lock, Unlock, Stamp, Hash,
  FileDown, FileSpreadsheet, Presentation, Globe, Image, FileImage,
  Maximize2, Crop, ArrowRightLeft, Database, Braces, Code, Video,
  Film, Music, Headphones, Sparkles, MessageSquare, Languages, ScanText,
  Merge, Sheet,
};

const badgeStyles: Record<string, string> = {
  free: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  popular: 'bg-primary/5 text-primary border-primary/20',
  new: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  beta: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  'coming-soon': 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
};

const badgeLabels: Record<string, string> = {
  free: 'Free',
  popular: '🔥 Popular',
  new: '✨ New',
  beta: '⚡ Beta',
  'coming-soon': '🚧 Coming Soon',
};

interface ToolCardProps {
  tool: Tool;
  index: number;
  darkMode: boolean;
}

export default function ToolCard({ tool, index, darkMode }: ToolCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[tool.icon] || FileText;
  const isComingSoon = tool.badge === 'coming-soon';

  const handleClick = () => {
    navigate(`/tools/${tool.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <button
        onClick={handleClick}
        className={`group relative w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
          isComingSoon
            ? darkMode
              ? 'bg-gray-900/50 border-gray-800 opacity-70 cursor-pointer hover:opacity-90'
              : 'bg-gray-50/50 border-gray-200 opacity-70 cursor-pointer hover:opacity-90'
            : darkMode
              ? 'bg-gray-900 border-gray-800 hover:border-gray-600 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1'
              : 'bg-white border-border hover:border-gray-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1'
        }`}
      >
        {/* Badge */}
        {tool.badge && (
          <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles[tool.badge] || badgeStyles.free}`}>
            {badgeLabels[tool.badge] || tool.badge}
          </span>
        )}

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${tool.color}10`, color: tool.color }}
        >
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <h3 className={`text-base font-semibold mb-1.5 ${darkMode ? 'text-white' : 'text-secondary'}`}>
          {tool.name}
        </h3>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
          {tool.description}
        </p>
      </button>
    </motion.div>
  );
}
