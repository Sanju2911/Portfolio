const skills = [
  'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'UI/UX Design',
  'System Architecture', 'Next.js', 'React Native', 'Product Strategy',
  'Motion Design', 'AWS', 'Figma', 'GraphQL', 'Tailwind CSS',
];

export default function Skills() {
  const doubled = [...skills, ...skills];

  return (
    <section className="py-14 border-t border-white/5 overflow-hidden select-none">
      <div className="flex gap-10 animate-marquee whitespace-nowrap">
        {doubled.map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 text-[10px] text-white/18 tracking-widest uppercase font-medium"
          >
            {skill}
            <span className="text-white/10 text-base">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}
