import React, { useEffect, useRef } from 'react';

interface Flake {
  x: number;
  y: number;
  r: number; // radius
  vX: number;
  vY: number;
  o: number; // opacity
  swing: number; // horizontal oscillation phase
  speedFactor: number;
}

const Snow: React.FC<{ maxFlakes?: number }> = ({ maxFlakes = 140 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const flakesRef = useRef<Flake[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    // Respect user preference for reduced motion
    const prefReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = prefReduce.matches;

    // Resize canvas for crispness
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Regenerate flakes on resize so density adapts
      initFlakes();
    };

    // Determine particle count based on viewport area (capped)
    const calcCount = () => {
      const area = Math.max(40000, width * height); // avoid tiny counts
      const scaled = Math.round(area / 14000); // tuned constant
      return Math.max(40, Math.min(maxFlakes, scaled));
    };

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const initFlakes = () => {
      const count = calcCount();
      const flakes: Flake[] = [];
      for (let i = 0; i < count; i++) {
        const r = rand(0.6, 3.8);
        flakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r,
          vX: rand(-0.4, 0.8),
          vY: rand(0.4, 1.8),
          o: rand(0.4, 0.95),
          swing: Math.random() * Math.PI * 2,
          speedFactor: rand(0.6, 1.4)
        });
      }
      flakesRef.current = flakes;
    };

    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(50, now - last) / 16.6667; // normalized to ~60fps
      last = now;

      ctx.clearRect(0, 0, width, height);

      // soft background glow to add 'frosty' feel (subtle)
      // ctx.fillStyle = 'rgba(8, 16, 32, 0.02)';
      // ctx.fillRect(0, 0, width, height);

      const flakes = flakesRef.current;
      const wind = Math.sin(now / 2000) * 0.25; // slow changing wind

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];

        // Horizontal oscillation + wind
        f.swing += 0.02 * f.speedFactor;
        f.x += (Math.sin(f.swing) * 0.6 + wind + f.vX) * dt * f.speedFactor;
        f.y += f.vY * dt * f.speedFactor;

        // Wrap around horizontally
        if (f.x > width + 10) f.x = -10;
        if (f.x < -10) f.x = width + 10;

        // Respawn at top when leaving bottom
        if (f.y > height + 20) {
          f.y = -10;
          f.x = Math.random() * width;
          f.r = rand(0.6, 4.2);
          f.o = rand(0.4, 0.95);
        }

        // draw
        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 2.5);
        // slightly bluish-white for a crisp holiday feel
        grd.addColorStop(0, `rgba(255,255,255,${f.o})`);
        grd.addColorStop(0.6, `rgba(245,250,255,${Math.max(0, f.o - 0.3)})`);
        grd.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.beginPath();
        ctx.fillStyle = grd as unknown as string; // createRadialGradient returns CanvasGradient
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) rafRef.current = requestAnimationFrame(draw);
    };

    // handle reduced motion changes
    const handleReduceChange = () => {
      if (prefReduce.matches) {
        // stop animation
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        // render a single static frame
        draw(performance.now());
      } else {
        if (!rafRef.current) {
          last = performance.now();
          rafRef.current = requestAnimationFrame(draw);
        }
      }
    };

    window.addEventListener('resize', resize);
    prefReduce.addEventListener('change', handleReduceChange);

    resize();

    if (!reduced) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      // Render a static frame if reduced motion
      draw(performance.now());
    }

    return () => {
      window.removeEventListener('resize', resize);
      prefReduce.removeEventListener('change', handleReduceChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [maxFlakes]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="snow-canvas"
    />
  );
};

export default Snow;
