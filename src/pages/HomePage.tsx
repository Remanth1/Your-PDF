import { useEffect } from 'react';
import Hero from '@/components/Hero';
import ToolGrid from '@/components/ToolGrid';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';

interface HomePageProps {
  darkMode: boolean;
  searchQuery: string;
  onSearch: (query: string) => void;
}

export default function HomePage({ darkMode, searchQuery, onSearch }: HomePageProps) {
  useEffect(() => {
    document.title = 'YourPDF — Every File Tool You Need, In One Place';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Free online PDF tools to merge, compress, convert, edit, sign, and transform your documents. Fast, secure, and easy to use.');
    }
  }, []);

  return (
    <>
      <Hero darkMode={darkMode} onSearch={onSearch} />
      <ToolGrid darkMode={darkMode} searchQuery={searchQuery} />
      <HowItWorks darkMode={darkMode} />
      <Benefits darkMode={darkMode} />
      <Testimonials darkMode={darkMode} />
      <Pricing darkMode={darkMode} />
      <FAQ darkMode={darkMode} />
      <CTA darkMode={darkMode} />
    </>
  );
}
