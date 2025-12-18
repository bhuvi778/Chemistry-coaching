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
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const formulas = [
      'H₂O', 'CO₂', 'O₂', 'CH₄', 'NH₃', 'C₆H₆', 'NaCl', 'H⁺', 'OH⁻', 'e⁻',
      'H₂SO₄', 'HCl', 'NaOH', 'KOH', 'CaCO₃', 'Fe²⁺', 'Cu²⁺', 'Zn', 'Ag⁺',
      'C₂H₅OH', 'CH₃COOH', 'NH₄⁺', 'NO₃⁻', 'SO₄²⁻', 'Cl⁻', 'Na⁺', 'K⁺',
      'Mg²⁺', 'Ca²⁺', 'Al³⁺', 'C₆H₁₂O₆', 'H₂O₂', 'N₂', 'Cl₂', 'Br₂'
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2; // Reduced from 0.5 to 0.2
        this.vy = (Math.random() - 0.5) * 0.2; // Reduced from 0.5 to 0.2
        this.size = Math.random() * 2 + 1.5; // Reduced from 3+2 to 2+1.5
        const colors = isDark
          ? ['#00f3ff', '#ff00aa', '#a855f7', '#22d3ee', '#ec4899']
          : ['#0891b2', '#db2777', '#9333ea', '#0ea5e9', '#ec4899'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        // Increase formula probability
        const rand = Math.random();
        if (rand < 0.5) this.type = 1; // Formula (50%)
        else if (rand < 0.8) this.type = 2; // Bond (30%)
        else this.type = 0; // Hexagon (20%)

        this.formula = formulas[Math.floor(Math.random() * formulas.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.005; // Reduced from 0.015 to 0.005
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

        // Adjust opacity based on theme
        const baseOpacity = isDark ? 0.4 : 0.5; // Reduced from 0.6/0.8 to 0.4/0.5
        ctx.globalAlpha = baseOpacity;

        if (this.type === 0) {
          // Hexagon (Benzene Ring)
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = (this.size * 4) * Math.cos(angle);
            const hy = (this.size * 4) * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.lineWidth = 2;
          ctx.stroke();

          // Inner circle
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
          ctx.globalAlpha = baseOpacity * 0.5;
          ctx.fill();
          ctx.globalAlpha = baseOpacity;
        } else if (this.type === 1) {
          // Chemical Formula
          ctx.font = `bold ${this.size * 4}px 'Orbitron', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.rotate(-this.angle); // Keep text upright

          // Add shadow for better visibility in light mode
          if (!isDark) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
          }

          ctx.fillText(this.formula, 0, 0);

          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        } else if (this.type === 2) {
          // Chemical Bond (Double or Triple Bond)
          const bondType = Math.floor(Math.random() * 3) + 1;
          ctx.lineWidth = 2;

          for (let i = 0; i < bondType; i++) {
            const offset = (i - (bondType - 1) / 2) * 3;
            ctx.beginPath();
            ctx.moveTo(-this.size * 4, offset);
            ctx.lineTo(this.size * 4, offset);
            ctx.stroke();
          }

          // Atoms at ends
          ctx.beginPath();
          ctx.arc(-this.size * 4, 0, this.size * 1.5, 0, Math.PI * 2);
          ctx.arc(this.size * 4, 0, this.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      // Reduced particle count for less visual clutter
      const particleCount = Math.min(window.innerWidth / 12, 100); // Reduced from /8, 150
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

          if (distance < 150) { // Reduced from 200
            const opacity = (150 - distance) / 150 * 0.08; // Reduced from 0.15
            ctx.beginPath();
            if (isDark) {
              ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
            } else {
              ctx.strokeStyle = `rgba(8, 145, 178, ${opacity * 1.2})`; // Reduced multiplier from 1.5
            }
            ctx.lineWidth = 1; // Reduced from 1.5
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
  }, [isDark]); // Re-render when theme changes

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
};

export default ParticleCanvas;