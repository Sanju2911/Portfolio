import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { useContent } from '../hooks/useContent';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const { data } = useContent('hero', {
    meta1: 'Portfolio — 2024',
    meta2: 'Based in San Francisco, CA',
    lines: ['CRAFTING', 'DIGITAL', 'EXPERIENCES'],
    subtitle: 'Full-stack developer & designer building products that fuse technical precision with thoughtful, lasting design.',
    stats: [
      { value: '8+', label: 'Years' },
      { value: '60+', label: 'Projects' },
      { value: '30+', label: 'Clients' }
    ]
  });

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  const lines = ['CRAFTING', 'DIGITAL', 'EXPERIENCES'];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between px-6 md:px-10 pt-28 pb-10 overflow-hidden">
      {/* Ambient radial glows */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(180,140,80,0.05) 0%, transparent 70%)' }}
        />
      </div>

      {/* Top meta row */}
      <div
        className={`flex items-center justify-between text-[10px] text-white/25 tracking-widest uppercase transition-all duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: '600ms',
        }}
      >
        <span className="line-reveal">{data.meta1}</span>
        <span className="line-reveal" style={{ animationDelay: '0.1s' }}>{data.meta2}</span>
      </div>

      {/* Main display headline */}
      <div className="flex-1 flex flex-col justify-center py-12 md:py-20">
        {data.lines.map((line: string, i: number) => (
          <div key={line + i} className="overflow-hidden">
            <h1
              className={`font-display font-bold leading-[0.88] tracking-tight transition-all duration-1000 ${
                i === 1 ? 'text-white/15 pl-4 md:pl-10' : 'text-white'
              }`}
              style={{
                fontSize: 'clamp(3.2rem, 11vw, 10.5rem)',
                transform: loaded ? 'translateY(0)' : 'translateY(110%)',
                transitionDelay: `${i * 120 + 100}ms`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {line}
            </h1>
          </div>
        ))}

        {/* Sub-row */}
        <div
          className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end justify-between gap-8 transition-all duration-1000"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(24px)',
            transitionDelay: '520ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <p className="text-white/45 text-base md:text-lg max-w-md leading-relaxed group">
            <span
              className="inline-block transition-all duration-500 group-hover:text-white/65"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(12px)',
              }}
            >
              {data.subtitle}
            </span>
          </p>

          <div className="flex items-center gap-8 text-white/30 text-xs shrink-0">
            {data.stats.map((stat: any, i: number, arr: any[]) => (
              <div
                key={stat.label}
                className="flex items-center gap-8 transition-all duration-500 hover:text-white/60"
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? 'translateY(0)' : 'translateY(12px)',
                  transitionDelay: `${650 + i * 80}ms`,
                }}
              >
                <div className="group cursor-default">
                  <div className="font-display font-bold text-white text-2xl mb-0.5 transition-all duration-300 group-hover:text-white/80 group-hover:scale-110 origin-left">
                    {stat.value}
                  </div>
                  <div className="tracking-wide">{stat.label}</div>
                </div>
                {i < arr.length - 1 && <div className="w-px h-7 bg-white/10 transition-all duration-300 group-hover:bg-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom scroll row */}
      <div
        className="flex items-center justify-between transition-all duration-700"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: '700ms',
        }}
      >
        <div className="flex items-center gap-3 text-white/20 text-[10px] tracking-widest uppercase">
          <div className="w-6 h-px bg-white/15 transition-all duration-500 hover:w-10 hover:bg-white/30" />
          <span>Scroll to explore</span>
        </div>
        <button
          onClick={scrollToWork}
          aria-label="Scroll down"
          className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all duration-300 hover:scale-110 group"
        >
          <ArrowDown
            size={15}
            className="group-hover:animate-bounce"
          />
        </button>
      </div>
    </section>
  );
}

