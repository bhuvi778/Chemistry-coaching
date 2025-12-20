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
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;

        const colors = isDark
          ? ['#00f3ff', '#ff00aa', '#a855f7', '#22d3ee', '#ec4899']
          : ['#0891b2', '#db2777', '#9333ea', '#0ea5e9', '#ec4899'];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Determine particle type
        const rand = Math.random();
        if (rand < 0.5) this.type = 1; // Formula (50%)
        else if (rand < 0.8) this.type = 2; // Bond (30%)
        else this.type = 0; // Hexagon (20%)

        // Set consistent sizes based on type to prevent stretching
        if (this.type === 0) {
          // Hexagon - fixed radius
          this.size = 8 + Math.random() * 4; // 8-12px radius
        } else if (this.type === 1) {
          // Formula - font size
          this.size = 14 + Math.random() * 6; // 14-20px font
        } else {
          // Bond - length
          this.size = 12 + Math.random() * 6; // 12-18px half-length
        }

        this.formula = formulas[Math.floor(Math.random() * formulas.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.01;
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

        // Adjust opacity based on theme - Increased for better visibility
        const baseOpacity = isDark ? 0.7 : 0.8; // Increased from 0.5/0.6
        ctx.globalAlpha = baseOpacity;

        if (this.type === 0) {
          // Hexagon (Benzene Ring) - Use size directly as radius
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = this.size * Math.cos(angle);
            const hy = this.size * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Inner circle
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
          ctx.globalAlpha = baseOpacity * 0.6;
          ctx.fill();
          ctx.globalAlpha = baseOpacity;
        } else if (this.type === 1) {
          // Chemical Formula - Use size directly as font size
          ctx.font = `bold ${this.size}px 'Orbitron', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.rotate(-this.angle); // Keep text upright

          // Add text stroke for better visibility
          ctx.lineWidth = 2;
          ctx.strokeStyle = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)';
          ctx.strokeText(this.formula, 0, 0);

          // Add shadow/glow for better visibility
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Fill text
          ctx.fillStyle = this.color;
          ctx.globalAlpha = isDark ? 0.9 : 0.95; // Increased opacity
          ctx.fillText(this.formula, 0, 0);

          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.globalAlpha = baseOpacity;
        } else if (this.type === 2) {
          // Chemical Bond - Use size directly as half-length
          const bondType = Math.floor(Math.random() * 3) + 1;
          const bondLength = this.size; // Use size directly
          const atomRadius = this.size * 0.3; // Proportional to bond length
          ctx.lineWidth = 2.5;

          for (let i = 0; i < bondType; i++) {
            const offset = (i - (bondType - 1) / 2) * 3;
            ctx.beginPath();
            ctx.moveTo(-bondLength, offset);
            ctx.lineTo(bondLength, offset);
            ctx.stroke();
          }

          // Atoms at ends - properly sized
          ctx.beginPath();
          ctx.arc(-bondLength, 0, atomRadius, 0, Math.PI * 2);
          ctx.arc(bondLength, 0, atomRadius, 0, Math.PI * 2);
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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0, minHeight: '100vh' }} />;
};

export default ParticleCanvas;