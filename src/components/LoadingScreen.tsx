import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate progressive loading
    const intervals = [
      setTimeout(() => setProgress(20), 200),
      setTimeout(() => setProgress(50), 600),
      setTimeout(() => setProgress(75), 900),
      setTimeout(() => setProgress(90), 1300),
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsVisible(false);
          onComplete();
        }, 500);
      }, 1800),
    ];

    return () => intervals.forEach(clearTimeout);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-[100]">
      {/* Animated logo / brand */}
      <div className="mb-16">
        <div
          className="font-display font-bold text-2xl text-white tracking-widest"
          style={{
            animation: 'fadeInBlur 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          SATH
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-px bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            width: `${progress}%`,
            transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 0 20px rgba(255,255,255,0.3)',
          }}
        />
      </div>

      {/* Percentage */}
      <div className="mt-6 text-[10px] text-white/25 tracking-widest font-mono">
        {progress}%
      </div>

      {/* Animated dots */}
      <div className="mt-10 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/30"
            style={{
              animation: `pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
