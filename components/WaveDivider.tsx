/**
 * Decorative wave dividers used above/below the primary-colored bands
 * (ticker, CTA, footer). Pure CSS animation — no JS, no hydration risk
 * (the SPA's framer-motion marquee caused React #418; do not reintroduce it).
 */

export const WaveTop = () => (
  <div className="absolute -top-[50px] left-0 w-full h-[55px] z-10 overflow-hidden pointer-events-none">
    <svg className="h-full animate-wave" style={{ width: "200%", minWidth: "3840px" }} viewBox="0 0 2880 60" preserveAspectRatio="none">
      <path d="M0,60 C360,20 720,50 1080,30 C1440,10 1800,50 2160,25 C2520,5 2880,40 2880,40 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.3" />
      <path d="M0,60 C480,35 960,55 1440,40 C1920,25 2400,50 2880,35 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.55" />
      <path d="M0,60 C320,48 640,56 960,50 C1280,44 1600,54 1920,48 C2240,42 2560,52 2880,46 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.8" />
    </svg>
  </div>
);

export const WaveBottom = () => (
  <div className="absolute -bottom-[50px] left-0 w-full h-[55px] z-10 overflow-hidden pointer-events-none">
    <svg className="h-full animate-wave-reverse" style={{ width: "200%", minWidth: "3840px" }} viewBox="0 0 2880 60" preserveAspectRatio="none">
      <path d="M0,0 C360,40 720,10 1080,30 C1440,50 1800,10 2160,35 C2520,55 2880,20 2880,20 L2880,0 Z" fill="hsl(var(--primary))" opacity="0.3" />
      <path d="M0,0 C480,25 960,5 1440,20 C1920,35 2400,10 2880,25 L2880,0 Z" fill="hsl(var(--primary))" opacity="0.55" />
      <path d="M0,0 C320,12 640,4 960,10 C1280,16 1600,6 1920,12 C2240,18 2560,8 2880,14 L2880,0 Z" fill="hsl(var(--primary))" opacity="0.8" />
    </svg>
  </div>
);
