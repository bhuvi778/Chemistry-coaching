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
      'H₂O', 'CO₂', 'O₂', 'CH₄', 'NH₃', 'C₆H₆', 'NaCl', 'H⁺', 'OH⁻', 'e⁻',
      'H₂SO₄', 'HCl', 'NaOH', 'KOH', 'CaCO₃', 'Fe²⁺', 'Cu²⁺', 'Zn', 'Ag⁺',
      'C₂H₅OH', 'CH₃COOH', 'NH₄⁺', 'NO₃⁻', 'SO₄²⁻', 'Cl⁻', 'Na⁺', 'K⁺',
      'Mg²⁺', 'Ca²⁺', 'Al³⁺', 'C₆H₁₂O₆', 'H₂O₂', 'N₂', 'Cl₂', 'Br₂'
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5; // Increased for better movement
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 7 + 8; // MUCH LARGER: 8-15 (was 1.5-3.5)
        const colors = isDark
          ? ['#00f3ff', '#ff00aa', '#a855f7', '#22d3ee', '#ec4899']
          : ['#0891b2', '#db2777', '#9333ea', '#0ea5e9', '#ec4899'];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Increase formula probability
        const rand = Math.random();
        if (rand < 0.9) this.type = 1; // Formula (60%)
        else if (rand < 1) this.type = 2; // Bond (25%)
        else this.type = 0; // Hexagon (15%)

        this.formula = formulas[Math.floor(Math.random() * formulas.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.01; // Increased rotation
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

        // MUCH HIGHER opacity for visibility
        const baseOpacity = isDark ? 0.85 : 0.9; // Increased from 0.4/0.5
        ctx.globalAlpha = baseOpacity;

        if (this.type === 0) {
          // Hexagon (Benzene Ring) - 10x LARGER
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = (this.size * 3) * Math.cos(angle); // 3x multiplier
            const hy = (this.size * 3) * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.lineWidth = 3; // Thicker lines
          ctx.stroke();

          // Inner circle
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 1.2, 0, Math.PI * 2);
          ctx.globalAlpha = baseOpacity * 0.6;
          ctx.fill();
          ctx.globalAlpha = baseOpacity;
        } else if (this.type === 1) {
          // Chemical Formula - 10x LARGER
          ctx.font = `bold ${this.size * 3}px 'Orbitron', sans-serif`; // 3x multiplier
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.rotate(-this.angle); // Keep text upright

          // Strong shadow for visibility
          ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          ctx.fillText(this.formula, 0, 0);

          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        } else if (this.type === 2) {
          // Chemical Bond - 10x LARGER
          const bondType = Math.floor(Math.random() * 3) + 1;
          ctx.lineWidth = 3; // Thicker lines

          for (let i = 0; i < bondType; i++) {
            const offset = (i - (bondType - 1) / 2) * 4;
            ctx.beginPath();
            ctx.moveTo(-this.size * 3, offset); // 3x multiplier
            ctx.lineTo(this.size * 3, offset);
            ctx.stroke();
          }

          // Atoms at ends
          ctx.beginPath();
          ctx.arc(-this.size * 3, 0, this.size * 1.2, 0, Math.PI * 2);
          ctx.arc(this.size * 3, 0, this.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
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