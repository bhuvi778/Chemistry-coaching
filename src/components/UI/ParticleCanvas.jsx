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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const formulas = [
      'H₂O', 'CO₂', 'O₂', 'CH₄', 'NH₃', 'NaCl', 'H⁺', 'OH⁻',
      'HCl', 'NaOH', 'KOH', 'Fe²⁺', 'Cu²⁺', 'Zn', 'Ag⁺',
      'NH₄⁺', 'NO₃⁻', 'Cl⁻', 'Na⁺', 'K⁺', 'Ca²⁺', 'N₂', 'Cl₂'
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;

        const colors = isDark
          ? ['#00f3ff', '#ff00aa', '#a855f7', '#22d3ee', '#ec4899']
          : ['#0891b2', '#db2777', '#9333ea', '#0ea5e9', '#ec4899'];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Only use formulas - they're clearest and most readable
        this.type = 1;
        this.formula = formulas[Math.floor(Math.random() * formulas.length)];

        // NO rotation to prevent stretching
        this.angle = 0;
        this.spin = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 50 || this.x > canvas.width - 50) this.vx *= -1;
        if (this.y < 50 || this.y > canvas.height - 50) this.vy *= -1;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        // NO ROTATION - keep text perfectly horizontal
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 1;

        // Chemical Formula - HUGE 42px font, NO rotation
        ctx.font = `bold 42px 'Orbitron', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Very thick black/white outline for maximum contrast
        ctx.lineWidth = 6;
        ctx.strokeStyle = isDark ? '#000000' : '#FFFFFF';
        ctx.strokeText(this.formula, 0, 0);

        // Strong glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Fill text with bright color
        ctx.fillStyle = this.color;
        ctx.fillText(this.formula, 0, 0);

        // Reset
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      // More particles since we're only showing formulas
      const particleCount = Math.min(window.innerWidth / 15, 80);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 300) {
            const opacity = (300 - distance) / 300 * 0.25;
            ctx.beginPath();
            if (isDark) {
              ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
            } else {
              ctx.strokeStyle = `rgba(8, 145, 178, ${opacity * 1.5})`;
            }
            ctx.lineWidth = 3;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0, minHeight: '100vh' }} />;
};

export default ParticleCanvas;