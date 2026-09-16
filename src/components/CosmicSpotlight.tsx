// هالة ضوئية تفاعلية تتبع حركة الماوس بنعومة عبر الشاشة (Cosmic Spotlight)
import React, { useEffect, useRef } from 'react';

export const CosmicSpotlight: React.FC = () => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // إيقاف على الهواتف لتوفير الأداء
    if (window.innerWidth < 768) return;

    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    let targetX = -500;
    let targetY = -500;
    let currentX = -500;
    let currentY = -500;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // تنعيم الحركة باستخدام lerp (Linear Interpolation)
    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (spotlight) {
        spotlight.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-10 opacity-30 mix-blend-screen transition-opacity duration-500"
      style={{
        background: 'radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, rgba(12, 18, 38, 0.05) 50%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  );
};
