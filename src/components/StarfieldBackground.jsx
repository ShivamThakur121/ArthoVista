import { useEffect, useRef } from 'react';

export default function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Star configuration
    const STAR_COUNT = Math.min(Math.floor((width * height) / 4500), 300);
    const starPalette = [
      'rgba(255, 255, 255, ',
      'rgba(186, 230, 253, ', // Ice Blue
      'rgba(254, 240, 138, ', // Soft Gold
      'rgba(165, 243, 252, ', // Subtle Cyan
    ];

    // Create stars
    const stars = Array.from({ length: STAR_COUNT }, () => {
      const radius = Math.random() * 1.6 + 0.4;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        colorPrefix: starPalette[Math.floor(Math.random() * starPalette.length)],
        baseAlpha: Math.random() * 0.5 + 0.3,
        alpha: Math.random(),
        blinkSpeed: Math.random() * 0.03 + 0.008,
        phase: Math.random() * Math.PI * 2,
        hasGlow: radius > 1.3,
        driftX: (Math.random() - 0.5) * 0.08,
        driftY: (Math.random() - 0.5) * 0.08,
      };
    });

    // Shooting stars
    const shootingStars = [];
    let lastShootingStarTime = Date.now();

    const createShootingStar = () => {
      const startX = Math.random() * width;
      const startY = Math.random() * (height * 0.5);
      const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 deg downward
      const speed = Math.random() * 7 + 9;
      const length = Math.random() * 80 + 60;
      shootingStars.push({
        x: startX,
        y: startY,
        length,
        speed,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 45 + 30,
      });
    };

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars.forEach((s) => {
        if (s.x > width) s.x = Math.random() * width;
        if (s.y > height) s.y = Math.random() * height;
      });
    };

    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Twinkling Stars
      stars.forEach((s) => {
        s.phase += s.blinkSpeed;
        const currentAlpha = s.baseAlpha + Math.sin(s.phase) * (s.baseAlpha * 0.7);
        const clampedAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        // Subtle drift
        s.x += s.driftX;
        s.y += s.driftY;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Glow halo for larger stars
        if (s.hasGlow && clampedAlpha > 0.6) {
          const gradient = ctx.createRadialGradient(
            s.x, s.y, 0,
            s.x, s.y, s.radius * 3.5
          );
          gradient.addColorStop(0, `${s.colorPrefix}${clampedAlpha * 0.6})`);
          gradient.addColorStop(1, `${s.colorPrefix}0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Core star
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.colorPrefix}${clampedAlpha})`;
        ctx.fill();
      });

      // 2. Manage & Draw Shooting Stars
      const now = Date.now();
      if (now - lastShootingStarTime > 4000 + Math.random() * 5000) {
        createShootingStar();
        lastShootingStarTime = now;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life += 1;
        ss.alpha = Math.max(0, 1 - ss.life / ss.maxLife);

        if (ss.alpha <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - (ss.vx / ss.speed) * ss.length;
        const tailY = ss.y - (ss.vy / ss.speed) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
        grad.addColorStop(0.7, `rgba(186, 230, 253, ${ss.alpha * 0.5})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Small head glow
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
