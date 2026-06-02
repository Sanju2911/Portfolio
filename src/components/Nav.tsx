import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between transition-all duration-500 ${
        scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5' : ''
      }`}
    >
      <button
        onClick={() => scrollTo('hero')}
        className="font-display font-bold text-white text-sm tracking-widest uppercase hover:text-white/70 transition-all duration-300 hover:scale-105 origin-left"
      >
        Alex Mercer
      </button>

      <div className="hidden md:flex items-center gap-10">
        {['about', 'work', 'process', 'contact'].map((item) => (
          <button
            key={item}
            onClick={() => scrollTo(item)}
            onMouseEnter={() => setNavItems({ ...navItems, [item]: true })}
            onMouseLeave={() => setNavItems({ ...navItems, [item]: false })}
            className="text-xs text-white/40 hover:text-white transition-all duration-300 capitalize tracking-widest uppercase relative group"
          >
            {item}
            <span
              className={`absolute -bottom-1 left-0 h-px bg-white transition-all duration-300 ${
                navItems[item] ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </button>
        ))}
      </div>

      <button
        onClick={() => scrollTo('contact')}
        className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-black bg-white px-5 py-2.5 rounded-full hover:bg-white/85 transition-all duration-300 group tracking-wide uppercase hover:scale-110 hover:shadow-lg"
      >
        Hire Me
        <ArrowUpRight
          size={13}
          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
        />
      </button>

      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden flex flex-col gap-1.5 p-1"
        aria-label="Menu"
      >
        <span
          className={`block w-5 h-px bg-white transition-all duration-300 ${
            menuOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block w-5 h-px bg-white transition-all duration-300 ${
            menuOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-5 h-px bg-white transition-all duration-300 ${
            menuOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0a0a]/98 backdrop-blur-md border-b border-white/5 px-6 py-8 flex flex-col gap-6 md:hidden animate-slide-down">
          {['about', 'work', 'process', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="text-left text-sm text-white/60 hover:text-white transition-all capitalize tracking-widest uppercase hover:translate-x-2"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
