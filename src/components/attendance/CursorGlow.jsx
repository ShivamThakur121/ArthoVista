import { useEffect, useRef } from 'react';

const GLOW_RADIUS   = 60;
const GLOW_ALPHA    = 0.13;
const LERP_FACTOR   = 0.14;

const MAX_PARTICLES = 55;
const SPAWN_RATE    = 2;
const PARTICLE_LIFE = 55;

const rand   = (min, max) => Math.random() * (max - min) + min;
const lerp   = (a, b, t) => a + (b - a) * t;

class Particle {
  constructor(x, y) {
    this.x    = x + rand(-8, 8);
    this.y    = y + rand(-4, 4);
    this.vx   = rand(-0.4, 0.4);
    this.vy   = rand(-1.2, -0.5);
    this.life = PARTICLE_LIFE;
    this.age  = 0;
    this.r    = rand(4, 9);
    this.maxR = rand(18, 32);
    this.hue  = rand(230, 260);
    this.sat  = rand(30, 55);
  }

  update() {
    this.age++;
    this.x  += this.vx;
    this.y  += this.vy;
    this.vx += rand(-0.05, 0.05);
    this.r   = lerp(this.r, this.maxR, 0.04);
  }

  get alpha() {
    const t = this.age / this.life;
    return t < 0.2
      ? (t / 0.2) * 0.35
      : (1 - (t - 0.2) / 0.8) * 0.35;
  }

  get dead() { return this.age >= this.life; }

  draw(ctx) {
    const g = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.r
    );
    const a = this.alpha;
    g.addColorStop(0,   `hsla(${this.hue},${this.sat}%,70%,${a})`);
    g.addColorStop(0.5, `hsla(${this.hue},${this.sat}%,60%,${a * 0.6})`);
    g.addColorStop(1,   `hsla(${this.hue},${this.sat}%,50%,0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const CursorGlow = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas  = canvasRef.current;
    const ctx     = canvas.getContext('2d');
    const particles = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const mouse = { x: -999, y: -999 };
    const pos   = { x: -999, y: -999 };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (particles.length < MAX_PARTICLES) {
        for (let i = 0; i < SPAWN_RATE; i++) {
          particles.push(new Particle(e.clientX, e.clientY));
        }
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf;
    const tick = () => {
      pos.x = lerp(pos.x, mouse.x, LERP_FACTOR);
      pos.y = lerp(pos.y, mouse.y, LERP_FACTOR);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.dead) particles.splice(i, 1);
      }

      if (mouse.x > -999) {
        const g = ctx.createRadialGradient(
          pos.x, pos.y, 0,
          pos.x, pos.y, GLOW_RADIUS
        );
        g.addColorStop(0,   `rgba(99,102,241,${GLOW_ALPHA})`);
        g.addColorStop(0.5, `rgba(99,102,241,${GLOW_ALPHA * 0.4})`);
        g.addColorStop(1,   'rgba(99,102,241,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, GLOW_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        9999,
        willChange:    'transform',
      }}
    />
  );
};

export default CursorGlow;
