import { ArrowUpRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useState } from 'react';

const projects = [
  {
    id: '01',
    title: 'Meridian',
    category: 'Product Design & Development',
    year: '2024',
    description: 'A fintech dashboard for institutional investors managing multi-asset portfolios with real-time analytics.',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=900',
    tags: ['React', 'TypeScript', 'D3.js'],
  },
  {
    id: '02',
    title: 'Folio',
    category: 'Web Application',
    year: '2024',
    description: 'A creative portfolio platform for artists and designers — from blank canvas to launched product.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=900',
    tags: ['Next.js', 'Supabase', 'Tailwind'],
  },
  {
    id: '03',
    title: 'Pulse',
    category: 'Mobile & Web',
    year: '2023',
    description: 'A personal health analytics app that surfaces meaningful patterns from wearable and lifestyle data.',
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=900',
    tags: ['React Native', 'Node.js', 'ML'],
  },
  {
    id: '04',
    title: 'Arc Studio',
    category: 'Brand & Digital',
    year: '2023',
    description: 'Complete digital identity and web presence for a boutique architecture firm in New York.',
    image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=900',
    tags: ['Branding', 'Webflow', 'Motion'],
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const { ref, inView } = useInView();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <article
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative bg-[#0a0a0a] overflow-hidden cursor-pointer transition-all duration-700 transform ${
        inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{
        transitionDelay: `${index * 120}ms`,
        boxShadow: isHovered
          ? `${(mousePos.x - 0.5) * 40}px ${(mousePos.y - 0.5) * 40}px 80px rgba(255,255,255,0.08)`
          : 'none',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
          style={{
            transform: isHovered ? `scale(${1.08 + (mousePos.x - 0.5) * 0.08})` : 'scale(1)',
          }}
        />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/25 transition-all duration-500" />

        {/* Hover CTA circle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
          <div
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              transform: isHovered ? 'scale(1) rotate(45deg)' : 'scale(0) rotate(0deg)',
            }}
          >
            <ArrowUpRight size={20} className="text-black -rotate-45 transition-transform duration-300" />
          </div>
        </div>

        {/* Year badge */}
        <span className="absolute top-4 right-4 text-[10px] font-mono text-white/40 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full transition-all duration-300 group-hover:bg-black/60 group-hover:text-white">
          {project.year}
        </span>
      </div>

      {/* Info */}
      <div className="p-6 border-t border-white/5 group-hover:border-white/15 transition-colors duration-300">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-[10px] font-mono text-white/20 group-hover:text-white/40 transition-colors duration-300">
                {project.id}
              </span>
              <span className="text-[10px] text-white/35 tracking-widest uppercase truncate group-hover:text-white/60 transition-colors duration-300">
                {project.category}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-300">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {project.tags.map((tag, i) => (
            <span
              key={tag}
              className="text-[10px] text-white/25 border border-white/8 px-3 py-1 rounded-full tracking-wide transition-all duration-300 group-hover:border-white/20 group-hover:text-white/40"
              style={{
                transitionDelay: `${i * 50}ms`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const { ref, inView } = useInView();

  return (
    <section id="work" className="px-6 md:px-10 py-24 md:py-40 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={ref} className="flex items-end justify-between mb-14 md:mb-20">
          <div>
            <span
              className={`text-[10px] text-white/25 tracking-widest uppercase block mb-5 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              — Selected Work
            </span>
            <h2
              className={`font-display font-bold text-white leading-none tracking-tight transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', transitionDelay: '100ms' }}
            >
              Recent Projects
            </h2>
          </div>
          <span
            className={`hidden md:flex items-center gap-2 text-xs text-white/25 tracking-widest uppercase transition-all duration-700 ${
              inView ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {projects.length} Projects
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-lg overflow-hidden">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
