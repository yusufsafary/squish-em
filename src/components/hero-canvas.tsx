import { useEffect, useRef } from "react";

interface Blob {
  x: number; y: number; vx: number; vy: number;
  baseSize: number; hue: number; sat: number; lit: number;
  points: { angle: number; r: number; rTarget: number; rSpeed: number }[];
  rot: number; rotSpeed: number;
  pulsePhase: number; pulseSpeed: number;
  trail: { x: number; y: number }[];
  opacity: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; hue: number;
}

interface Star {
  x: number; y: number; size: number; speed: number;
  opacity: number; twinklePhase: number; twinkleSpeed: number;
}

/** Draw a smooth closed blob using cubic bezier through radial control points */
function drawSmoothBlob(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  pts: { angle: number; r: number }[]
) {
  const n = pts.length;
  const coords = pts.map(p => ({
    x: cx + Math.cos(p.angle) * p.r,
    y: cy + Math.sin(p.angle) * p.r,
  }));

  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const prev = coords[(i - 1 + n) % n];
    const curr = coords[i];
    const next = coords[(i + 1) % n];
    const next2 = coords[(i + 2) % n];

    if (i === 0) ctx.moveTo(curr.x, curr.y);

    // Catmull-Rom → cubic bezier control points
    const cp1x = curr.x + (next.x - prev.x) / 6;
    const cp1y = curr.y + (next.y - prev.y) / 6;
    const cp2x = next.x - (next2.x - curr.x) / 6;
    const cp2y = next.y - (next2.y - curr.y) / 6;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
  }
  ctx.closePath();
}

const PALETTE = [
  { h: 127, s: 65, l: 52 },
  { h: 263, s: 68, l: 58 },
  { h: 48,  s: 95, l: 58 },
  { h: 215, s: 88, l: 62 },
  { h: 0,   s: 78, l: 62 },
];

function makeBlob(width: number, height: number, large: boolean): Blob {
  const p = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const nPts = 8;
  const base = large ? Math.random() * 70 + 70 : Math.random() * 32 + 22;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * (large ? 0.5 : 1.2),
    vy: (Math.random() - 0.5) * (large ? 0.5 : 1.2),
    baseSize: base,
    hue: p.h + (Math.random() - 0.5) * 18,
    sat: p.s,
    lit: p.l,
    points: Array.from({ length: nPts }, (_, i) => {
      const angle = (i / nPts) * Math.PI * 2;
      const r = base * (0.82 + Math.random() * 0.36);
      return { angle, r, rTarget: r, rSpeed: Math.random() * 0.015 + 0.008 };
    }),
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.003,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 1.2 + 0.6,
    trail: [],
    opacity: large ? 0.72 : 0.65,
  };
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let t = 0;

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    // Stars
    const stars: Star[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      size: Math.random() * 1.6 + 0.2,
      speed: Math.random() * 0.25 + 0.06,
      opacity: Math.random() * 0.6 + 0.3,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 2 + 0.8,
    }));

    // Blobs — 3 large, 6 small
    const blobs: Blob[] = [
      ...Array.from({ length: 3 }, () => makeBlob(W, H, true)),
      ...Array.from({ length: 6 }, () => makeBlob(W, H, false)),
    ];

    // Particles
    const particles: Particle[] = [];
    let pTimer = 0;

    function spawnParticles() {
      const b = blobs[Math.floor(Math.random() * blobs.length)];
      for (let k = 0; k < 3; k++) {
        particles.push({
          x: b.x + (Math.random() - 0.5) * b.baseSize * 0.8,
          y: b.y + (Math.random() - 0.5) * b.baseSize * 0.8,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -Math.random() * 1.0 - 0.4,
          life: 1, maxLife: Math.random() * 70 + 40,
          size: Math.random() * 2.5 + 0.8,
          hue: b.hue,
        });
      }
    }

    function frame() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      // ── Stars ──
      stars.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        ctx.globalAlpha = s.opacity * (0.4 + 0.6 * tw);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      });

      // ── Blob trails ──
      blobs.forEach(b => {
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 16) b.trail.shift();

        b.trail.forEach((pt, i) => {
          const frac = i / b.trail.length;
          const ts = b.baseSize * frac * 0.38;
          if (ts < 1) return;
          const tg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, ts);
          tg.addColorStop(0, `hsla(${b.hue},${b.sat}%,${b.lit}%,${0.18 * frac})`);
          tg.addColorStop(1, `hsla(${b.hue},${b.sat}%,${b.lit}%,0)`);
          ctx.globalAlpha = 1;
          ctx.fillStyle = tg;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, ts, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // ── Blobs ──
      blobs.forEach(b => {
        // Move
        b.x += b.vx; b.y += b.vy; b.rot += b.rotSpeed;
        const mg = b.baseSize * 1.6;
        if (b.x < -mg) b.x = W + mg;
        if (b.x > W + mg) b.x = -mg;
        if (b.y < -mg) b.y = H + mg;
        if (b.y > H + mg) b.y = -mg;

        // Morph radii
        b.points.forEach(pt => {
          pt.r += (pt.rTarget - pt.r) * pt.rSpeed;
          if (Math.abs(pt.r - pt.rTarget) < 1) {
            pt.rTarget = b.baseSize * (0.72 + Math.random() * 0.56);
          }
        });

        // Pulse
        const pulse = 1 + 0.07 * Math.sin(t * b.pulseSpeed + b.pulsePhase);

        // Build rotated point list
        const rotPts = b.points.map(pt => ({
          angle: pt.angle + b.rot,
          r: pt.r * pulse,
        }));

        // Outer atmospheric glow
        const glowR = b.baseSize * 2.4;
        const gg = ctx.createRadialGradient(b.x, b.y, b.baseSize * 0.2, b.x, b.y, glowR);
        gg.addColorStop(0, `hsla(${b.hue},${b.sat}%,${b.lit}%,0.15)`);
        gg.addColorStop(0.5, `hsla(${b.hue},${b.sat}%,${b.lit}%,0.05)`);
        gg.addColorStop(1, `hsla(${b.hue},${b.sat}%,${b.lit}%,0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(b.x, b.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Body — clip to blob shape, then fill with radial gradient
        ctx.save();
        drawSmoothBlob(ctx, b.x, b.y, rotPts);
        ctx.clip();

        const bg = ctx.createRadialGradient(
          b.x - b.baseSize * 0.3, b.y - b.baseSize * 0.3, 0,
          b.x, b.y, b.baseSize * 1.1
        );
        bg.addColorStop(0,   `hsla(${b.hue},${b.sat}%,${Math.min(b.lit + 22, 90)}%,1)`);
        bg.addColorStop(0.45,`hsla(${b.hue},${b.sat}%,${b.lit}%,1)`);
        bg.addColorStop(1,   `hsla(${b.hue},${b.sat - 8}%,${Math.max(b.lit - 18, 10)}%,1)`);

        ctx.globalAlpha = b.opacity;
        ctx.fillStyle = bg;
        ctx.fillRect(b.x - glowR, b.y - glowR, glowR * 2, glowR * 2);

        // Specular highlight
        const sg = ctx.createRadialGradient(
          b.x - b.baseSize * 0.3, b.y - b.baseSize * 0.3, 0,
          b.x - b.baseSize * 0.1, b.y - b.baseSize * 0.1, b.baseSize * 0.5
        );
        sg.addColorStop(0, `hsla(0,0%,100%,0.35)`);
        sg.addColorStop(1, `hsla(0,0%,100%,0)`);
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = sg;
        ctx.fillRect(b.x - glowR, b.y - glowR, glowR * 2, glowR * 2);

        ctx.restore();
      });

      // ── Particles ──
      pTimer++;
      if (pTimer % 10 === 0) spawnParticles();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy -= 0.01; p.life--;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const frac = p.life / p.maxLife;
        ctx.globalAlpha = frac * 0.65;
        ctx.fillStyle = `hsl(${p.hue},80%,72%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * frac, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen", opacity: 0.9 }}
    />
  );
}
