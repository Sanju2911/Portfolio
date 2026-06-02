import { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Skills from './components/Skills';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <div className="bg-[#0a0a0a] text-[#f0ede6] min-h-screen">
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Work />
      <Process />
      <Contact />
      <Footer />
    </div>
  );
}
