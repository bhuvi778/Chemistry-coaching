import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let lastFrameTime = 0;
    const isMobile = window.innerWidth < 768;
    const FRAME_INTERVAL = 1000 / (isMobile ? 24 : 40); // 24fps mobile, 40fps desktop

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const formulas = [
      'H₂O', 'CO₂', 'CH₄', 'NH₃', 'C₆H₆', 'NaCl', 'H⁺', 'OH⁻',
      'H₂SO₄', 'HCl', 'NaOH', 'Fe²⁺', 'Cu²⁺', 'C₂H₅OH', 'CH₃COOH',
    ];

    const COLORS_DARK = ['#00f3ff', '#ff00aa', '#a855f7', '#22d3ee', '#ec4899'];
    const COLORS_LIGHT = ['#0891b2', '#db2777', '#9333ea', '#0ea5e9', '#ec4899'];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2 + 1.5;
        const colors = isDark ? COLORS_DARK : COLORS_LIGHT;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        const rand = Math.random();
        // ~40% formula, ~35% bond, ~25% hexagon
        this.type = rand < 0.4 ? 1 : rand < 0.75 ? 2 : 0;
        this.formula = formulas[Math.floor(Math.random() * formulas.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.03;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.spin;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = isDark ? 0.30 : 0.20;

        if (this.type === 0) {
          // Hexagon
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i;
            const hx = this.size * 5 * Math.cos(a);
            const hy = this.size * 5 * Math.sin(a);
            if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (this.type === 1) {
          // Chemical formula text
          ctx.font = `bold ${this.size * 5}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.rotate(-this.angle); // keep text upright
          ctx.fillText(this.formula, 0, 0);
        } else {
          // Bond — double line for realism
          const len = this.size * 5;
          const gap = this.size * 0.8;
          ctx.lineWidth = 2;
          // line 1
          ctx.beginPath();
          ctx.moveTo(-len, -gap);
          ctx.lineTo(len, -gap);
          ctx.stroke();
          // line 2
          ctx.beginPath();
          ctx.moveTo(-len, gap);
          ctx.lineTo(len, gap);
          ctx.stroke();
          // end atoms
          ctx.beginPath();
          ctx.arc(-len, 0, this.size * 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(len, 0, this.size * 1.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      // Fewer particles on mobile to keep CPU free for the page itself
      const isMobile = window.innerWidth < 768;
      const maxCount = isMobile ? 40 : 120;
      const count = Math.min(Math.floor(window.innerWidth / (isMobile ? 20 : 12)), maxCount);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const animate = (timestamp) => {
      animationFrameId = requestAnimationFrame(animate);

      // Throttle to 30fps
      if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = timestamp;

      // Pause when browser tab is not visible — free CPU entirely
      if (document.hidden) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // NOTE: Connection lines removed — they were O(n²) = ~780 sqrt() per frame at 150 particles
      particles.forEach(p => { p.update(); p.draw(); });
    };

    initParticles();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default ParticleCanvas;