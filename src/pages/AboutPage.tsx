import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Heart, Globe } from 'lucide-react';

interface AboutPageProps {
  darkMode: boolean;
}

export default function AboutPage({ darkMode }: AboutPageProps) {
  const values = [
    { icon: Users, title: 'User-First', description: 'Every feature we build starts with understanding what our users need most.' },
    { icon: Target, title: 'Simplicity', description: 'We believe powerful tools should be simple to use. No complexity, no confusion.' },
    { icon: Heart, title: 'Privacy', description: 'Your files are yours. We process them securely and delete them automatically.' },
    { icon: Globe, title: 'Accessibility', description: 'Free tools for everyone, everywhere. No barriers, no paywalls.' },
  ];

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

          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 ${
            darkMode ? 'text-white' : 'text-secondary'
          }`}>
            About YourPDF
          </h1>

          <div className={`prose prose-lg max-w-none mb-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p className="text-xl leading-relaxed">
              YourPDF was founded with a simple mission: make document tools accessible to everyone. 
              We believe that converting, editing, and managing files shouldn't require expensive 
              software or technical expertise.
            </p>
          </div>

          <div className={`rounded-3xl border p-8 mb-12 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-muted border-border'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-secondary'}`}>
              Our Story
            </h2>
            <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>
                What started as a small project to help friends convert documents has grown into 
                a comprehensive suite of file tools used by millions of people worldwide.
              </p>
              <p>
                Our team of engineers and designers work tirelessly to ensure that every tool 
                is fast, secure, and incredibly easy to use. We're constantly adding new features 
                and improving existing ones based on feedback from our community.
              </p>
              <p>
                Today, YourPDF processes millions of files every month, helping students, 
                professionals, and businesses get their work done more efficiently.
              </p>
            </div>
          </div>

          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-secondary'}`}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((value, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${
                  darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-border'
                }`}
              >
                <value.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                  {value.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
