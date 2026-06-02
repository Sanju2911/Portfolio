import { useInView } from '../hooks/useInView';
import { useRef, useState } from 'react';
import { useContent } from '../hooks/useContent';

export default function About() {
  const { ref, inView } = useInView();
  const imgRef = useRef<HTMLImageElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { data } = useContent('about', {
    quote: '"The best digital products are the ones you don\'t notice — they simply work, feel right, and leave you wanting more."',
    paragraphs: [
      "I'm Alex Mercer, a full-stack developer and product designer based in San Francisco. Over eight years I've shipped digital products for startups, scale-ups, and global brands — from consumer apps to complex enterprise platforms.",
      "My work lives at the intersection of engineering and design. I obsess over the details others overlook: the 200ms animation that makes a transition feel alive, the information architecture that makes complex data feel simple, the code structure that makes future change painless."
    ],
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
    locationString: "San Francisco, CA — Available 2025"
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const reveal = () =>
    `transition-all duration-700 ${inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`;

  return (
    <section id="about" className="px-6 md:px-10 py-24 md:py-40 border-t border-white/5">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Label */}
          <div className="md:col-span-2">
            <span
              className={`text-[10px] text-white/25 tracking-widest uppercase transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              — About
            </span>
          </div>

          {/* Content */}
          <div className="md:col-span-7">
            <blockquote
              className={`font-display text-[clamp(1.4rem,2.8vw,2.4rem)] font-semibold leading-[1.25] text-white mb-10 ${reveal()}`}
              style={{ transitionDelay: '100ms' }}
            >
              {data.quote}
            </blockquote>

            <div
              className={`space-y-5 text-white/45 text-[15px] leading-[1.8] ${reveal()}`}
              style={{ transitionDelay: '200ms' }}
            >
              {data.paragraphs.map((p: string, i: number) => (
                <p key={i} className="hover:text-white/65 transition-colors duration-500">
                  {p}
                </p>
              ))}
            </div>

            <div
              className={`mt-10 flex items-center gap-5 ${reveal()}`}
              style={{ transitionDelay: '300ms' }}
            >
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 text-xs font-semibold text-white border border-white/20 px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 group tracking-wide uppercase hover:scale-105"
              >
                Get in touch
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">→</span>
              </button>
              <button
                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs text-white/35 hover:text-white/70 transition-colors duration-300 tracking-wide uppercase hover:translate-x-1 transition-transform duration-300"
              >
                View my work
              </button>
            </div>
          </div>

          {/* Portrait */}
          <div
            className={`md:col-span-3 ${reveal()}`}
            style={{ transitionDelay: '200ms' }}
            onMouseMove={handleMouseMove}
          >
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white/5">
              <img
                ref={imgRef}
                src={data.image}
                alt="Profile"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 0.5}deg) rotateX(${-mousePos.y * 0.5}deg) scale(1.02)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent" />
            </div>
            <p className="mt-3 text-[10px] text-white/20 tracking-widest uppercase hover:text-white/40 transition-colors duration-300">
              {data.locationString}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
