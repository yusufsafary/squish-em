import { useEffect, useRef } from "react";

interface Star {
  x: number; y: number; size: number; speed: number; opacity: number; twinkleSpeed: number; twinkleOffset: number;
}

interface Blob {
  x: number; y: number; vx: number; vy: number;
  baseSize: number; hue: number; sat: number; lit: number;
  morphSpeed: number; morphOffset: number; rotSpeed: number; rot: number;
  pulseSpeed: number; pulseOffset: number;
  trail: { x: number; y: number; a: number }[];
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; hue: number;
}

function drawBlobPath(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, radius: number,
  points: number, time: number, morphAmt: number
) {
  const step = (Math.PI * 2) / points;
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const angle = i * step + time;
    const noise1 = Math.sin(angle * 2.3 + time * 1.1) * morphAmt;
    const noise2 = Math.cos(angle * 3.7 - time * 0.8) * morphAmt * 0.6;
    const noise3 = Math.sin(angle * 1.5 + time * 2.0) * morphAmt * 0.4;
    const r = radius + noise1 + noise2 + noise3;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let lastTime = 0;
    let elapsed = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Stars — two layers for depth
    const stars: Star[] = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 2 + 1,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const PALETTE = [
      { h: 127, s: 65, l: 52 },  // green
      { h: 263, s: 70, l: 55 },  // purple
      { h: 48,  s: 100, l: 60 }, // gold
      { h: 215, s: 90, l: 60 },  // blue
      { h: 360, s: 80, l: 60 },  // red
    ];

    // Blobs — organic morphing shapes with trails
    const blobs: Blob[] = Array.from({ length: 8 }).map((_, i) => {
      const p = PALETTE[i % PALETTE.length];
      const isLarge = i < 3;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isLarge ? 0.6 : 1.4),
        vy: (Math.random() - 0.5) * (isLarge ? 0.6 : 1.4),
        baseSize: isLarge ? Math.random() * 60 + 60 : Math.random() * 30 + 18,
        hue: p.h + (Math.random() - 0.5) * 20,
        sat: p.s,
        lit: p.l,
        morphSpeed: Math.random() * 0.5 + 0.3,
        morphOffset: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.4,
        rot: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 1.5 + 0.8,
        pulseOffset: Math.random() * Math.PI * 2,
        trail: [],
      };
    });

    // Floating particles
    const particles: Particle[] = [];
    let particleTimer = 0;

    function spawnParticle() {
      const blob = blobs[Math.floor(Math.random() * blobs.length)];
      for (let k = 0; k < 2; k++) {
        particles.push({
          x: blob.x + (Math.random() - 0.5) * blob.baseSize,
          y: blob.y + (Math.random() - 0.5) * blob.baseSize,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 1.2 - 0.3,
          life: 1,
          maxLife: Math.random() * 60 + 40,
          size: Math.random() * 3 + 1,
          hue: blob.hue,
        });
      }
    }

    const render = (timestamp: number) => {
      const dt = Math.min(timestamp - lastTime, 32);
      lastTime = timestamp;
      elapsed += dt * 0.001;

      ctx.clearRect(0, 0, width, height);

      // === STARS ===
      stars.forEach(star => {
        const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(elapsed * star.twinkleSpeed + star.twinkleOffset));
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.y -= star.speed;
        if (star.y < -2) { star.y = height + 2; star.x = Math.random() * width; }
      });

      // Occasional shooting star
      if (Math.random() < 0.002) {
        const sx = Math.random() * width;
        ctx.globalAlpha = 0.7;
        const grad = ctx.createLinearGradient(sx, 0, sx + 120, 30);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, "rgba(255,255,255,0.8)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, Math.random() * height * 0.5);
        ctx.lineTo(sx + 120, (Math.random() * height * 0.5) + 30);
        ctx.stroke();
      }

      // === BLOB TRAILS ===
      blobs.forEach(blob => {
        blob.trail.push({ x: blob.x, y: blob.y, a: 0.15 });
        if (blob.trail.length > 18) blob.trail.shift();

        blob.trail.forEach((pt, i) => {
          const frac = i / blob.trail.length;
          const trailSize = blob.baseSize * frac * 0.45;
          ctx.globalAlpha = pt.a * frac * 0.5;
          const tGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, trailSize);
          tGrad.addColorStop(0, `hsla(${blob.hue},${blob.sat}%,${blob.lit}%,0.4)`);
          tGrad.addColorStop(1, `hsla(${blob.hue},${blob.sat}%,${blob.lit}%,0)`);
          ctx.fillStyle = tGrad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, trailSize, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // === BLOBS ===
      blobs.forEach(blob => {
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.rot += blob.rotSpeed * 0.01;

        // Smooth wrapping with margin
        const margin = blob.baseSize * 1.5;
        if (blob.x < -margin) blob.x = width + margin;
        if (blob.x > width + margin) blob.x = -margin;
        if (blob.y < -margin) blob.y = height + margin;
        if (blob.y > height + margin) blob.y = -margin;

        const morphT = elapsed * blob.morphSpeed + blob.morphOffset;
        const pulse = 1 + 0.08 * Math.sin(elapsed * blob.pulseSpeed + blob.pulseOffset);
        const size = blob.baseSize * pulse;
        const morphAmt = size * 0.22;

        // Outer glow
        const glowRadius = size * 2.2;
        const glowGrad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, glowRadius);
        glowGrad.addColorStop(0,   `hsla(${blob.hue},${blob.sat}%,${blob.lit}%,0.18)`);
        glowGrad.addColorStop(0.4, `hsla(${blob.hue},${blob.sat}%,${blob.lit}%,0.07)`);
        glowGrad.addColorStop(1,   `hsla(${blob.hue},${blob.sat}%,${blob.lit}%,0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Blob body with radial gradient fill
        ctx.save();
        ctx.translate(blob.x, blob.y);
        ctx.rotate(blob.rot);
        ctx.translate(-blob.x, -blob.y);

        const bodyGrad = ctx.createRadialGradient(
          blob.x - size * 0.25, blob.y - size * 0.25, 0,
          blob.x, blob.y, size
        );
        bodyGrad.addColorStop(0, `hsla(${blob.hue},${blob.sat + 10}%,${blob.lit + 20}%,0.95)`);
        bodyGrad.addColorStop(0.5, `hsla(${blob.hue},${blob.sat}%,${blob.lit}%,0.85)`);
        bodyGrad.addColorStop(1, `hsla(${blob.hue},${blob.sat - 10}%,${blob.lit - 15}%,0.7)`);

        ctx.globalAlpha = 0.75;
        ctx.fillStyle = bodyGrad;
        drawBlobPath(ctx, blob.x, blob.y, size, 12, morphT, morphAmt);
        ctx.fill();

        // Inner specular highlight
        ctx.globalAlpha = 0.25;
        const specX = blob.x - size * 0.28;
        const specY = blob.y - size * 0.28;
        const specGrad = ctx.createRadialGradient(specX, specY, 0, specX, specY, size * 0.45);
        specGrad.addColorStop(0, `hsla(${blob.hue},30%,95%,0.9)`);
        specGrad.addColorStop(1, `hsla(${blob.hue},30%,95%,0)`);
        ctx.fillStyle = specGrad;
        drawBlobPath(ctx, blob.x, blob.y, size, 12, morphT, morphAmt);
        ctx.fill();

        ctx.restore();
      });

      // === PARTICLES ===
      particleTimer++;
      if (particleTimer % 8 === 0) spawnParticle();

      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        p.vy -= 0.008;
        p.life--;
        if (p.life <= 0) { particles.splice(i, 1); return; }
        const frac = p.life / p.maxLife;
        ctx.globalAlpha = frac * 0.7;
        ctx.fillStyle = `hsl(${p.hue}, 80%, 70%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * frac, 0, Math.PI * 2);
        ctx.fill();
      });

      // === SCANLINE OVERLAY ===
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = "#000";
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 2);
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen", opacity: 0.85 }}
    />
  );
}
