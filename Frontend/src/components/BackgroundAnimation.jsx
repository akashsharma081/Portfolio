import { useEffect, useRef } from 'react';

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, stars, glowOrbs;
    let t = 0;
    let animationFrameId;
    const mouse = { x: -999, y: -999 };

    const init = () => {
      const starCount = Math.floor((W * H) / 9000);
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.5 + 0.15,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));

      const orbCount = Math.floor((W * H) / 55000) + 6;
      glowOrbs = Array.from({ length: orbCount }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 38 + 18,
        coreR: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.28 + 0.12,
        pulseSpeed: Math.random() * 0.018 + 0.006,
        pulseOffset: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleTouchMove = (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      stars.forEach(s => {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset);
        const a = s.alpha * (0.5 + 0.5 * twinkle);
        const dx = s.x - mouse.x, dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseMult = dist < 180 ? 1 + (1 - dist / 180) * 1.8 : 1;
        ctx.globalAlpha = Math.min(a * mouseMult, 0.95);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * mouseMult, 0, Math.PI * 2);
        ctx.fill();
      });

      glowOrbs.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r * 2) o.x = W + o.r;
        if (o.x > W + o.r * 2) o.x = -o.r;
        if (o.y < -o.r * 2) o.y = H + o.r;
        if (o.y > H + o.r * 2) o.y = -o.r;

        const pulse = 0.7 + 0.3 * Math.sin(t * o.pulseSpeed * 60 + o.pulseOffset);
        const glowR = o.r * pulse;

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, glowR);
        grad.addColorStop(0,   `rgba(34, 163, 96, ${o.alpha * pulse * 1.1})`);
        grad.addColorStop(0.35,`rgba(26, 122, 74, ${o.alpha * pulse * 0.55})`);
        grad.addColorStop(0.7, `rgba(14, 80, 48,  ${o.alpha * pulse * 0.18})`);
        grad.addColorStop(1,   `rgba(0, 0, 0, 0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        const coreGrad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.coreR * 3.5);
        coreGrad.addColorStop(0,   `rgba(160, 255, 200, ${0.85 * pulse})`);
        coreGrad.addColorStop(0.4, `rgba(34, 163, 96,  ${0.5 * pulse})`);
        coreGrad.addColorStop(1,   `rgba(34, 163, 96, 0)`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.coreR * 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default BackgroundAnimation;
