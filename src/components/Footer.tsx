export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-6 md:px-10 py-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-display font-bold text-white text-xs tracking-widest uppercase">
          Alex Mercer
        </span>
        <span className="text-[10px] text-white/18 tracking-wide">
          © {year} Alex Mercer. All rights reserved.
        </span>
        <span className="text-[10px] text-white/18 tracking-wide">
          Designed &amp; built with care.
        </span>
      </div>
    </footer>
  );
}
