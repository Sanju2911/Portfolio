import { useContent } from '../hooks/useContent';

export default function Footer() {
  const year = new Date().getFullYear();
  const { data } = useContent('footer', {
    name: "Alex Mercer",
    leftText: "All rights reserved.",
    rightText: "Designed & built with care."
  });

  return (
    <footer className="px-6 md:px-10 py-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-display font-bold text-white text-xs tracking-widest uppercase">
          {data.name}
        </span>
        <span className="text-[10px] text-white/18 tracking-wide text-center md:text-left">
          © {year} {data.name}. {data.leftText}
        </span>
        <span className="text-[10px] text-white/18 tracking-wide">
          {data.rightText}
        </span>
      </div>
    </footer>
  );
}
