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
      'H₂O', 'CO₂', 'O₂', 'CH₄', 'NH₃', 'NaCl',
      'HCl', 'NaOH', 'Fe²⁺', 'Cu²⁺', 'Ag⁺',
      'NO₃⁻', 'Cl⁻', 'Na⁺', 'K⁺', 'N₂'
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5);
        this.vy = (Math.random() - 0.5);

        const colors = isDark
          ? ['#00f3ff', '#ff00aa', '#a855f7', '#22d3ee', '#ec4899']
          : ['#0891b2', '#db2777', '#9333ea', '#0ea5e9', '#ec4899'];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        this.formula = formulas[Math.floor(Math.random() * formulas.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.save();

        // Draw formula - NO translation, NO rotation
        ctx.font = `bold 48px 'Orbitron', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Black/white outline for contrast
        ctx.lineWidth = 8;
        ctx.strokeStyle = isDark ? '#000000' : '#FFFFFF';
        ctx.strokeText(this.formula, this.x, this.y);

        // Colored fill
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 30;
        ctx.fillText(this.formula, this.x, this.y);

        // Reset
        ctx.shadowBlur = 0;
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 250) {
            const opacity = (250 - distance) / 250 * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(100, 200, 255, ${opacity})`
              : `rgba(8, 145, 178, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Draw particles
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