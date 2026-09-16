// ذيل غبار فلكي وبريق ذهبي يتبع مؤشر النجمة بسلاسة
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  decay: number;
  vx: number;
  vy: number;
}

export const StarCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationId: number;
    let lastX = -100;
    let lastY = -100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // توليد ذرات بريق كلما تحرك الماوس
      if (dist > 6) {
        lastX = e.clientX;
        lastY = e.clientY;

        for (let i = 0; i < 2; i++) {
          particles.push({
            x: e.clientX + (Math.random() * 8 - 4),
            y: e.clientY + (Math.random() * 8 - 4),
            size: Math.random() * 2.2 + 1.0,
            alpha: 0.85,
            decay: Math.random() * 0.03 + 0.02,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 + 0.3,
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${p.alpha})`;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 4;
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};
