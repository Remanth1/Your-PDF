import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Briefcase } from 'lucide-react';

interface CareersPageProps {
  darkMode: boolean;
}

const openings = [
  {
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Technical Writer',
    department: 'Content',
    location: 'Remote',
    type: 'Part-time',
  },
];

export default function CareersPage({ darkMode }: CareersPageProps) {
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
            Careers
          </h1>
          <p className={`text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
            Join our team and help build tools that millions of people use every day.
          </p>

          <div className={`rounded-3xl border p-8 mb-12 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-muted border-border'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-secondary'}`}>
              Why Work With Us?
            </h2>
            <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• 100% remote work — work from anywhere in the world</li>
              <li>• Competitive salary and equity</li>
              <li>• Flexible hours and unlimited PTO</li>
              <li>• Health, dental, and vision insurance</li>
              <li>• $1,000 annual learning budget</li>
              <li>• Latest equipment provided</li>
            </ul>
          </div>

          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-secondary'}`}>
            Open Positions
          </h2>
          <div className="space-y-4">
            {openings.map((job, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 cursor-pointer ${
                  darkMode
                    ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    : 'bg-white border-border hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-secondary'}`}>
                  {job.title}
                </h3>
                <div className={`flex flex-wrap gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
