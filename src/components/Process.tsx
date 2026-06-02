import { useInView } from '../hooks/useInView';
import { useState } from 'react';
import { useContent } from '../hooks/useContent';

const defaultSteps = [
  {
    number: '01',
    title: 'Discover & Define',
    description:
      'Every great product starts with deep understanding. I spend time learning your users, your constraints, and your ambitions — before writing a single line of code.',
  },
  {
    number: '02',
    title: 'Design & Prototype',
    description:
      'Rapid iteration from lo-fi sketches to high-fidelity prototypes. Assumptions get validated early, when changes cost nothing, not after months of engineering.',
  },
  {
    number: '03',
    title: 'Build & Ship',
    description:
      'Clean, maintainable code and thoughtful architecture. I build products that can grow — and deploy them with the care that production systems deserve.',
  },
  {
    number: '04',
    title: 'Measure & Iterate',
    description:
      'Shipping is the beginning, not the end. I instrument, observe, and improve — using real data to drive decisions that compound in value over time.',
  },
];

function ProcessStep({ step, index }: { step: any; index: number }) {
  const { ref, inView } = useInView();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-t border-white/5 hover:border-white/15 transition-all duration-700 cursor-default ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Background highlight on hover */}
      {isHovered && (
        <div className="absolute -inset-6 bg-white/[0.02] rounded-lg blur-lg transition-all duration-500 -z-10" />
      )}

      <div className="md:col-span-2">
        <span
          className={`text-[10px] font-mono text-white/18 group-hover:text-white/35 transition-all duration-300 tracking-widest ${
            isHovered ? 'scale-110 origin-left' : 'scale-100'
          }`}
          style={{ transform: isHovered ? 'translateX(8px)' : 'translateX(0)' }}
        >
          {step.number}
        </span>
      </div>
      <div className="md:col-span-4">
        <h3
          className={`font-display text-lg font-bold text-white/60 group-hover:text-white transition-all duration-400 ${
            isHovered ? 'translate-x-2' : 'translate-x-0'
          }`}
        >
          {step.title}
        </h3>
      </div>
      <div className="md:col-span-6">
        <p
          className={`text-sm text-white/35 leading-relaxed group-hover:text-white/55 transition-all duration-400 ${
            isHovered ? 'translate-x-2' : 'translate-x-0'
          }`}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function Process() {
  const { ref, inView } = useInView();
  const { data } = useContent('process', {
    headline: 'How I Work',
    subtitle: 'A structured approach that keeps projects moving with clarity and purpose — from first conversation to final deployment.',
    steps: defaultSteps
  });

  const headline = data.headline || 'How I Work';
  const subtitle = data.subtitle || 'A structured approach that keeps projects moving with clarity and purpose — from first conversation to final deployment.';
  const steps = Array.isArray(data.steps) ? data.steps : defaultSteps;

  return (
    <section id="process" className="px-6 md:px-10 py-24 md:py-40 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-24">
          <div className="md:col-span-2">
            <span
              className={`text-[10px] text-white/25 tracking-widest uppercase transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              — Process
            </span>
          </div>
          <div className="md:col-span-7">
            <h2
              className={`font-display font-bold text-white leading-none tracking-tight transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', transitionDelay: '100ms' }}
            >
              {headline}
            </h2>
            <p
              className={`mt-5 text-white/40 text-[15px] leading-relaxed max-w-lg transition-all duration-700 hover:text-white/60 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div>
          {steps.map((step, i) => (
            <ProcessStep key={step.number || i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
