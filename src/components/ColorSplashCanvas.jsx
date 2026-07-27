import { useEffect, useRef } from 'react';

// SetaPrint-Style Dynamic Aurora Liquid Wave Ribbon Colors
const COLOR_STOPS = [
  { r: 30,  g: 100, b: 255 }, // Electric Blue (Screenshot 1)
  { r: 16,  g: 225, b: 130 }, // Emerald Green (Screenshot 3)
  { r: 255, g: 120, b: 60  }, // Peach Orange (Screenshot 4)
  { r: 170, g: 70,  b: 255 }, // Violet Purple (Screenshot 2)
  { r: 13,  g: 195, b: 220 }  // Cyan Blue (Screenshot 5)
];

const lerp = (a, b, t) => a + (b - a) * t;

const ColorSplashCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const render = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Calculate smooth color cycle interpolation (Slower transition)
      const colorIndex = (time * 0.2) % COLOR_STOPS.length;
      const idx1 = Math.floor(colorIndex);
      const idx2 = (idx1 + 1) % COLOR_STOPS.length;
      const colorFactor = colorIndex - idx1;

      const c1 = COLOR_STOPS[idx1];
      const c2 = COLOR_STOPS[idx2];

      const r = Math.round(lerp(c1.r, c2.r, colorFactor));
      const g = Math.round(lerp(c1.g, c2.g, colorFactor));
      const b = Math.round(lerp(c1.b, c2.b, colorFactor));

      ctx.save();
      ctx.filter = 'blur(60px)';

      // Draw undulating organic S-curve liquid wave ribbon
      const pointCount = 12;
      const points = [];

      for (let i = 0; i <= pointCount; i++) {
        const progress = i / pointCount;
        const px = w * progress;
        
        // Sine wave superposition with lower speed and lower amplitude for reduced intensity
        const wave1 = Math.sin(time * 0.8 + progress * Math.PI * 2) * (h * 0.18);
        const wave2 = Math.cos(time * 0.6 + progress * Math.PI * 3) * (h * 0.10);
        const py = h * 0.5 + wave1 + wave2;

        points.push({ x: px, y: py });
      }

      // Draw thick fluid glow ribbon along bezier curve
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }

      // Create glowing gradient stroke with softened opacities
      const ribbonGrad = ctx.createLinearGradient(0, 0, w, h);
      ribbonGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.12)`);
      ribbonGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.45)`);
      ribbonGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.12)`);

      ctx.strokeStyle = ribbonGrad;
      ctx.lineWidth = Math.min(w, h) * 0.22;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Additional secondary glowing liquid wave for depth (softer alpha)
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y + 50);

      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2 + Math.sin(time * 0.7 + i) * 25;
        ctx.quadraticCurveTo(points[i].x, points[i].y + 50, xc, yc);
      }

      const secR = Math.round(lerp(c2.r, c1.r, colorFactor));
      const secG = Math.round(lerp(c2.g, c1.g, colorFactor));
      const secB = Math.round(lerp(c2.b, c1.b, colorFactor));

      ctx.strokeStyle = `rgba(${secR}, ${secG}, ${secB}, 0.30)`;
      ctx.lineWidth = Math.min(w, h) * 0.14;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[10] overflow-hidden opacity-70"
      style={{ mixBlendMode: 'screen' }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full block"
      />
      {/* SVG Subtle Film Grain Overlay matching setaprint.ch aesthetic */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-overlay pointer-events-none">
        <filter id="setaGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#setaGrain)" />
      </svg>
    </div>
  );
};

export default ColorSplashCanvas;
