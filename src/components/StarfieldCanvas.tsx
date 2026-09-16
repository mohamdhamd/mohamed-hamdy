// كانفاس حقل النجوم الكوني المتفاعل مع التمرير (شهب متحركة عند الـ Scroll Down والـ Scroll Up)
import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  baseRadius: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  parallaxFactor: number;
  color: string;
  hasSpikes: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
  colorHead: string;
  colorTail: string;
}

export const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = performance.now();

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    // متابعة سرعة واتجاه التمرير (Scroll Velocity)
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastScrollSpawnTime = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const starColors = [
      'rgba(255, 255, 255,',
      'rgba(230, 226, 211,',
      'rgba(201, 162, 39,',
      'rgba(224, 242, 254,',
    ];

    const initStars = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const count = Math.min(380, Math.max(120, Math.floor(width / 4.5)));
      stars = [];

      for (let i = 0; i < count; i++) {
        const isBright = Math.random() < 0.12;
        const isMedium = Math.random() < 0.35;
        const colorPrefix = starColors[Math.floor(Math.random() * starColors.length)];

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseRadius: isBright ? Math.random() * 1.5 + 1.8 : (isMedium ? Math.random() * 1.0 + 1.0 : Math.random() * 0.7 + 0.6),
          alpha: isBright ? Math.random() * 0.3 + 0.7 : Math.random() * 0.5 + 0.4,
          twinkleSpeed: Math.random() * 0.002 + 0.001,
          twinkleOffset: Math.random() * Math.PI * 2,
          parallaxFactor: Math.random() * 0.7 + 0.3,
          color: colorPrefix,
          hasSpikes: isBright && Math.random() < 0.65,
        });
      }
    };

    initStars();

    // دالة إنشاء شهاب في اتجاه محدد
    const spawnMeteor = (isDown: boolean, intensity: number = 1) => {
      if (prefersReducedMotion) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // عند النزول (Scroll Down) الشهب تتحرك لأسفل ومائلاً لليمين
      // عند الصعود (Scroll Up) الشهب تتحرك لأعلى ومائلاً لليسار
      const baseAngle = isDown ? (Math.PI / 4) : (-3 * Math.PI / 4);
      const angleVariance = (Math.random() * 0.3 - 0.15);
      const angle = baseAngle + angleVariance;

      const startX = isDown
        ? Math.random() * width * 0.9
        : Math.random() * width * 0.9 + width * 0.1;

      const startY = isDown
        ? Math.random() * (height * 0.4)
        : Math.random() * (height * 0.4) + height * 0.6;

      const isGolden = Math.random() < 0.4;

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 80 + 70 + intensity * 4,
        speed: Math.random() * 8 + 14 + intensity * 1.2,
        angle,
        opacity: 1,
        life: 0,
        maxLife: Math.floor(Math.random() * 15 + 35),
        colorHead: '#FFFFFF',
        colorTail: isGolden ? '#C9A227' : '#E6E2D3',
      });
    };

    // الاستماع للتمرير وتوليد شهب حية متناسبة مع سرعة التمرير
    const handleScroll = () => {
      if (prefersReducedMotion) return;
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      scrollVelocity = deltaY;

      const now = performance.now();
      // توليد شهاب كلما زادت حركة التمرير
      if (Math.abs(deltaY) > 8 && now - lastScrollSpawnTime > 120) {
        lastScrollSpawnTime = now;
        const isDown = deltaY > 0;
        const count = Math.min(3, Math.max(1, Math.floor(Math.abs(deltaY) / 18)));
        for (let i = 0; i < count; i++) {
          spawnMeteor(isDown, Math.min(20, Math.abs(deltaY)));
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // إضافة شهاب عابر طبيعي كل 7 ثوانٍ في حالة السكون
    const maybeSpawnIdleShootingStar = (time: number) => {
      if (prefersReducedMotion) return;
      if (time - lastShootingStarTime > 7000 && Math.random() < 0.02) {
        lastShootingStarTime = time;
        spawnMeteor(true, 2);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || prefersReducedMotion) return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetParallaxX = ((e.clientX - centerX) / centerX) * 16;
      targetParallaxY = ((e.clientY - centerY) / centerY) * 16;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(initStars, 150);
    };
    window.addEventListener('resize', handleResize);

    const render = (time: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

      // تباطؤ سرعة التمرير تدريجياً
      scrollVelocity *= 0.92;

      ctx.clearRect(0, 0, width, height);

      // رسم النجوم مع إزاحة خفيفة متأثرة بالتمرير والبارالاكس
      stars.forEach((star) => {
        let currentAlpha = star.alpha;
        if (!prefersReducedMotion) {
          const oscillation = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
          currentAlpha = 0.25 + (oscillation + 1) * 0.38 * star.alpha;
        }

        const drawX = star.x + currentParallaxX * star.parallaxFactor;
        let drawY = star.y + currentParallaxY * star.parallaxFactor - (scrollVelocity * 0.15 * star.parallaxFactor);

        // التفاف النجوم عند خروجها من الشاشة
        if (drawY < 0) drawY += height;
        if (drawY > height) drawY -= height;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color} ${currentAlpha})`;
        ctx.fill();

        if (star.baseRadius > 1.2) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.baseRadius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color} ${currentAlpha * 0.25})`;
          ctx.fill();
        }

        if (star.hasSpikes && currentAlpha > 0.5) {
          const spikeLen = star.baseRadius * 3.5;
          ctx.beginPath();
          ctx.moveTo(drawX - spikeLen, drawY);
          ctx.lineTo(drawX + spikeLen, drawY);
          ctx.moveTo(drawX, drawY - spikeLen);
          ctx.lineTo(drawX, drawY + spikeLen);
          ctx.strokeStyle = `${star.color} ${currentAlpha * 0.6})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // شهب التمرير والشهب العابرة
      maybeSpawnIdleShootingStar(time);

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity = Math.max(0, 1 - s.life / s.maxLife);

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, s.colorHead);
        grad.addColorStop(0.2, s.colorTail);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.0;
        ctx.shadowColor = s.colorTail;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // رأس الشهاب المضيء
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.fill();

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      render(0);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
