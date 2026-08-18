import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogPageProps {
  darkMode: boolean;
}

const blogPosts = [
  {
    title: 'How to Compress PDFs Without Losing Quality',
    excerpt: 'Learn the best techniques to reduce PDF file size while maintaining document clarity and readability.',
    date: 'Dec 15, 2024',
    readTime: '5 min read',
    category: 'Tutorial',
  },
  {
    title: 'The Complete Guide to PDF Security',
    excerpt: 'Everything you need to know about protecting your PDF documents with passwords and encryption.',
    date: 'Dec 10, 2024',
    readTime: '8 min read',
    category: 'Security',
  },
  {
    title: 'Converting Documents: Best Practices',
    excerpt: 'Tips and tricks for getting the best results when converting between document formats.',
    date: 'Dec 5, 2024',
    readTime: '6 min read',
    category: 'Guide',
  },
  {
    title: 'Why We Made All Our Tools Free',
    excerpt: 'Our philosophy on accessibility and why we believe document tools should be available to everyone.',
    date: 'Nov 28, 2024',
    readTime: '4 min read',
    category: 'Company',
  },
];

export default function BlogPage({ darkMode }: BlogPageProps) {
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
            Blog
          </h1>
          <p className={`text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Tips, tutorials, and updates from the YourPDF team.
          </p>

          <div className="space-y-6">
            {blogPosts.map((post, i) => (
              <article
                key={i}
                className={`group p-6 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer ${
                  darkMode
                    ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    : 'bg-white border-border hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'
                  }`}>
                    {post.category}
                  </span>
                  <div className={`flex items-center gap-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                <h2 className={`text-xl font-bold mb-2 group-hover:text-primary transition-colors ${
                  darkMode ? 'text-white' : 'text-secondary'
                }`}>
                  {post.title}
                </h2>
                <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="w-4 h-4" />
                </span>
              </article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
