import { useEffect, useRef } from "react";

interface Blob {
  x: number; y: number; vx: number; vy: number;
  baseSize: number; hue: number; sat: number; lit: number;
  points: { angle: number; r: number; rTarget: number; rSpeed: number }[];
  rot: number; rotSpeed: number;
  pulsePhase: number; pulseSpeed: number;
  trail: { x: number; y: number; opacity: number }[];
  opacity: number;
  wobble: number; wobbleSpeed: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; hue: number;
  type: "normal" | "spark" | "ring";
}

interface Star {
  x: number; y: number; size: number; speed: number;
  opacity: number; twinklePhase: number; twinkleSpeed: number;
}

interface ShootingStar {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; len: number;
}

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
  { h: 180, s: 80, l: 55 },
];

function makeBlob(width: number, height: number, large: boolean): Blob {
  const p = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const nPts = 10;
  const base = large ? Math.random() * 80 + 80 : Math.random() * 36 + 24;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * (large ? 0.45 : 1.0),
    vy: (Math.random() - 0.5) * (large ? 0.45 : 1.0),
    baseSize: base,
    hue: p.h + (Math.random() - 0.5) * 22,
    sat: p.s,
    lit: p.l,
    points: Array.from({ length: nPts }, (_, i) => {
      const angle = (i / nPts) * Math.PI * 2;
      const r = base * (0.78 + Math.random() * 0.44);
      return { angle, r, rTarget: r, rSpeed: Math.random() * 0.018 + 0.007 };
    }),
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.004,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 1.4 + 0.5,
    trail: [],
    opacity: large ? 0.75 : 0.68,
    wobble: 0,
    wobbleSpeed: Math.random() * 2 + 1,
  };
}

function makeShootingStar(W: number, H: number): ShootingStar {
  const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
  const speed = Math.random() * 8 + 6;
  return {
    x: Math.random() * W,
    y: Math.random() * H * 0.3,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 1,
    maxLife: Math.random() * 30 + 20,
    len: Math.random() * 120 + 60,
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
    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      size: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.65 + 0.25,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 2.5 + 0.7,
    }));

    // Blobs — 4 large, 10 small
    const blobs: Blob[] = [
      ...Array.from({ length: 4 }, () => makeBlob(W, H, true)),
      ...Array.from({ length: 10 }, () => makeBlob(W, H, false)),
    ];

    const particles: Particle[] = [];
    const shootingStars: ShootingStar[] = [];
    let pTimer = 0;
    let ssTimer = 0;

    function spawnParticles() {
      const b = blobs[Math.floor(Math.random() * blobs.length)];
      for (let k = 0; k < 4; k++) {
        const type: Particle["type"] = Math.random() < 0.15 ? "spark" : "normal";
        particles.push({
          x: b.x + (Math.random() - 0.5) * b.baseSize,
          y: b.y + (Math.random() - 0.5) * b.baseSize,
          vx: (Math.random() - 0.5) * (type === "spark" ? 2.5 : 1.4),
          vy: -Math.random() * 1.4 - 0.3,
          life: 1, maxLife: Math.random() * 90 + 40,
          size: type === "spark" ? Math.random() * 1.5 + 0.5 : Math.random() * 3 + 1,
          hue: b.hue,
          type,
        });
      }
    }

    function drawConnections() {
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const a = blobs[i], b = blobs[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const threshold = 240;
          if (dist < threshold) {
            const alpha = (1 - dist / threshold) * 0.12;
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `hsla(${a.hue},${a.sat}%,${a.lit}%,${alpha})`);
            grad.addColorStop(1, `hsla(${b.hue},${b.sat}%,${b.lit}%,${alpha})`);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    function frame() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      // ── Stars ──
      stars.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        ctx.globalAlpha = s.opacity * (0.35 + 0.65 * tw);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      });

      // ── Shooting stars ──
      ssTimer++;
      if (ssTimer % 140 === 0 && Math.random() < 0.6) shootingStars.push(makeShootingStar(W, H));
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx; ss.y += ss.vy; ss.life--;
        if (ss.life <= 0) { shootingStars.splice(i, 1); continue; }
        const frac = ss.life / ss.maxLife;
        ctx.globalAlpha = frac * 0.8;
        const tail = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * (ss.len / 10), ss.y - ss.vy * (ss.len / 10));
        tail.addColorStop(0, "rgba(255,255,255,0.9)");
        tail.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * (ss.len / 10), ss.y - ss.vy * (ss.len / 10));
        ctx.stroke();
      }

      // ── Blob connections ──
      drawConnections();

      // ── Blob trails ──
      blobs.forEach(b => {
        b.trail.push({ x: b.x, y: b.y, opacity: b.opacity });
        if (b.trail.length > 22) b.trail.shift();

        b.trail.forEach((pt, i) => {
          const frac = i / b.trail.length;
          const ts = b.baseSize * frac * 0.42;
          if (ts < 1) return;
          const tg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, ts);
          tg.addColorStop(0, `hsla(${b.hue},${b.sat}%,${b.lit}%,${0.22 * frac})`);
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
        b.x += b.vx; b.y += b.vy; b.rot += b.rotSpeed;
        b.wobble = Math.sin(t * b.wobbleSpeed) * 0.05;
        const mg = b.baseSize * 1.8;
        if (b.x < -mg) b.x = W + mg;
        if (b.x > W + mg) b.x = -mg;
        if (b.y < -mg) b.y = H + mg;
        if (b.y > H + mg) b.y = -mg;

        b.points.forEach(pt => {
          pt.r += (pt.rTarget - pt.r) * pt.rSpeed;
          if (Math.abs(pt.r - pt.rTarget) < 1.2) {
            pt.rTarget = b.baseSize * (0.68 + Math.random() * 0.64);
          }
        });

        const pulse = 1 + (0.08 + b.wobble) * Math.sin(t * b.pulseSpeed + b.pulsePhase);
        const rotPts = b.points.map(pt => ({
          angle: pt.angle + b.rot,
          r: pt.r * pulse,
        }));

        // Outer atmospheric glow (double ring)
        const glowR = b.baseSize * 2.6;
        const gg = ctx.createRadialGradient(b.x, b.y, b.baseSize * 0.1, b.x, b.y, glowR);
        gg.addColorStop(0,   `hsla(${b.hue},${b.sat}%,${b.lit}%,0.18)`);
        gg.addColorStop(0.4, `hsla(${b.hue},${b.sat}%,${b.lit}%,0.07)`);
        gg.addColorStop(0.75,`hsla(${b.hue},${b.sat}%,${b.lit}%,0.02)`);
        gg.addColorStop(1,   `hsla(${b.hue},${b.sat}%,${b.lit}%,0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(b.x, b.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.save();
        drawSmoothBlob(ctx, b.x, b.y, rotPts);
        ctx.clip();

        const bg = ctx.createRadialGradient(
          b.x - b.baseSize * 0.32, b.y - b.baseSize * 0.32, 0,
          b.x, b.y, b.baseSize * 1.15
        );
        bg.addColorStop(0,    `hsla(${b.hue},${b.sat}%,${Math.min(b.lit + 28, 92)}%,1)`);
        bg.addColorStop(0.4,  `hsla(${b.hue},${b.sat}%,${b.lit}%,1)`);
        bg.addColorStop(1,    `hsla(${b.hue},${b.sat - 10}%,${Math.max(b.lit - 20, 10)}%,1)`);

        ctx.globalAlpha = b.opacity;
        ctx.fillStyle = bg;
        ctx.fillRect(b.x - glowR, b.y - glowR, glowR * 2, glowR * 2);

        // Specular highlight
        const sg = ctx.createRadialGradient(
          b.x - b.baseSize * 0.32, b.y - b.baseSize * 0.32, 0,
          b.x - b.baseSize * 0.1,  b.y - b.baseSize * 0.1,  b.baseSize * 0.52
        );
        sg.addColorStop(0, `hsla(0,0%,100%,0.42)`);
        sg.addColorStop(0.5, `hsla(0,0%,100%,0.1)`);
        sg.addColorStop(1, `hsla(0,0%,100%,0)`);
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = sg;
        ctx.fillRect(b.x - glowR, b.y - glowR, glowR * 2, glowR * 2);

        // Inner rim glow
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = `hsla(${b.hue},${b.sat}%,${Math.min(b.lit + 35, 95)}%,0.6)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      });

      // ── Particles ──
      pTimer++;
      if (pTimer % 8 === 0) spawnParticles();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy -= 0.012; p.life--;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const frac = p.life / p.maxLife;
        if (p.type === "spark") {
          ctx.globalAlpha = frac * 0.9;
          ctx.strokeStyle = `hsl(${p.hue},100%,85%)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
          ctx.stroke();
        } else {
          ctx.globalAlpha = frac * 0.7;
          ctx.fillStyle = `hsl(${p.hue},80%,72%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * frac, 0, Math.PI * 2);
          ctx.fill();
        }
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
      style={{ mixBlendMode: "screen", opacity: 0.92 }}
    />
  );
}
