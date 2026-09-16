// مؤثر احتفالي فلكي عند تحميل السيرة الذاتية الرسمية (Celestial Starburst Confetti)
export const triggerCelestialConfetti = (originX?: number, originY?: number) => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const startX = originX ?? window.innerWidth / 2;
  const startY = originY ?? window.innerHeight / 2;

  interface Sparkle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    vRot: number;
    color: string;
    alpha: number;
    decay: number;
    shape: 'star' | 'circle' | 'diamond';
  }

  const colors = [
    '#C9A227', // Brass Gold
    '#E0B739', // Bright Gold
    '#FFF5C0', // Starlight
    '#38BDF8', // Cyan Glow
    '#FFFFFF', // White Sparkle
  ];

  const sparkles: Sparkle[] = [];
  const count = 130;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 4;
    const shapes: ('star' | 'circle' | 'diamond')[] = ['star', 'circle', 'diamond'];

    sparkles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
      vy: Math.sin(angle) * speed - Math.random() * 4,
      size: Math.random() * 5 + 2,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.012,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    });
  }

  const drawStar = (c: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerR: number, innerR: number) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    c.beginPath();
    c.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerR;
      y = cy + Math.sin(rot) * outerR;
      c.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerR;
      y = cy + Math.sin(rot) * innerR;
      c.lineTo(x, y);
      rot += step;
    }
    c.lineTo(cx, cy - outerR);
    c.closePath();
  };

  let animId: number;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let aliveCount = 0;

    for (let i = 0; i < sparkles.length; i++) {
      const s = sparkles[i];
      if (s.alpha <= 0) continue;

      aliveCount++;
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.22; // Gravity
      s.vx *= 0.98; // Air resistance
      s.rotation += s.vRot;
      s.alpha -= s.decay;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 10;

      if (s.shape === 'star') {
        drawStar(ctx, 0, 0, 4, s.size * 1.5, s.size * 0.6);
        ctx.fill();
      } else if (s.shape === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(0, -s.size);
        ctx.lineTo(s.size * 0.7, 0);
        ctx.lineTo(0, s.size);
        ctx.lineTo(-s.size * 0.7, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (aliveCount > 0) {
      animId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  };

  animate();
};
