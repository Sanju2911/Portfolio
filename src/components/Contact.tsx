import { ArrowUpRight, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useState } from 'react';
import { useContent } from '../hooks/useContent';

const socials = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter / X', href: '#' },
];

export default function Contact() {
  const { ref, inView } = useInView();
  const [emailHovered, setEmailHovered] = useState(false);
  const [socialHovers, setSocialHovers] = useState<Record<string, boolean>>({});

  const { data } = useContent('contact', {
    lines: ["LET'S BUILD", "SOMETHING"],
    highlight: "GREAT.",
    email: "alex@example.com",
    availability: "Available for new projects — Starting Q1 2025",
    message: "Currently available for freelance projects and full-time opportunities. If you have something in mind, I'd love to hear about it."
  });

  const lines = Array.isArray(data.lines) ? data.lines : ["LET'S BUILD", "SOMETHING"];

  return (
    <section id="contact" className="px-6 md:px-10 py-24 md:py-40 border-t border-white/5 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] transition-all duration-700"
          style={{
            background: inView
              ? 'radial-gradient(ellipse, rgba(255,255,255,0.035) 0%, transparent 65%)'
              : 'radial-gradient(ellipse, rgba(255,255,255,0.01) 0%, transparent 65%)',
          }}
        />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto relative">
        <div className="max-w-5xl">
          <span
            className={`text-[10px] text-white/25 tracking-widest uppercase block mb-8 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            — Contact
          </span>

          <h2
            className={`font-display font-bold text-white leading-[0.88] tracking-tight mb-8 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
            }`}
            style={{ fontSize: 'clamp(2.8rem, 9vw, 8rem)', transitionDelay: '100ms' }}
          >
            {lines[0] || "LET'S BUILD"}
            <br />
            {lines[1] || "SOMETHING"}
            <br />
            <span className="text-white/20 hover:text-white/40 transition-colors duration-500">{data.highlight || "GREAT."}</span>
          </h2>

          <p
            className={`text-white/40 text-lg mb-12 max-w-xl leading-relaxed transition-all duration-700 hover:text-white/65 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {data.message || "Currently available for freelance projects and full-time opportunities. If you have something in mind, I'd love to hear about it."}
          </p>

          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <a
              href={`mailto:${data.email || "alex@example.com"}`}
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
              className="inline-flex items-center gap-3 bg-white text-black px-7 py-4 rounded-full text-sm font-semibold hover:bg-white/88 transition-all duration-300 group hover:scale-105 hover:shadow-lg"
              style={{
                boxShadow: emailHovered ? '0 20px 60px rgba(255,255,255,0.15)' : 'none',
              }}
            >
              <Mail
                size={15}
                className={emailHovered ? 'animate-bounce' : ''}
              />
              {data.email || "alex@example.com"}
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
              />
            </a>

            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  onMouseEnter={() => setSocialHovers({ ...socialHovers, [label]: true })}
                  onMouseLeave={() => setSocialHovers({ ...socialHovers, [label]: false })}
                  className="w-11 h-11 border border-white/10 rounded-full flex items-center justify-center text-white/35 hover:text-white hover:border-white/30 transition-all duration-300 hover:scale-110 group"
                  style={{
                    boxShadow: socialHovers[label]
                      ? '0 0 20px rgba(255,255,255,0.1)'
                      : 'none',
                  }}
                >
                  <Icon
                    size={15}
                    className={socialHovers[label] ? 'animate-spin' : ''}
                    style={{
                      animationDuration: '1.5s',
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Availability indicator */}
          <div
            className={`mt-20 flex items-center gap-3 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '420ms' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-white/35 tracking-wide hover:text-white/55 transition-colors duration-300 group cursor-default">
              {data.availability || "Available for new projects — Starting Q1 2025"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
