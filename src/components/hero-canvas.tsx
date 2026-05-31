import { useEffect, useRef } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Star { x: number; y: number; size: number; opacity: number; twinkle: number; twinkleSpeed: number; }
interface ShootingStar { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; }

interface EnemyBlob {
  x: number; y: number; vx: number; vy: number;
  r: number; hue: number; sat: number; lit: number;
  hp: number; maxHp: number;
  pts: { angle: number; r: number; rTarget: number; speed: number }[];
  rot: number; rotSpeed: number;
  pulsePhase: number; pulseSpeed: number;
  isBoss: boolean;
  wobble: number; wobbleT: number;
  dead: boolean; deathTimer: number;
}

interface Bullet {
  x: number; y: number; vy: number;
  life: number; hue: number; len: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number;
  size: number; hue: number;
  type: "spark" | "ring" | "normal";
}

interface PowerUp {
  x: number; y: number; vy: number;
  type: "rapid" | "triple" | "shield" | "nuke" | "freeze" | "score2x";
  life: number;
}

interface ComboText {
  x: number; y: number; vy: number;
  text: string; life: number; maxLife: number;
  color: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const ENEMY_PALETTE = [
  { h: 127, s: 65, l: 52 },
  { h: 263, s: 68, l: 58 },
  { h: 48,  s: 95, l: 58 },
  { h: 215, s: 88, l: 62 },
  { h: 0,   s: 78, l: 62 },
  { h: 180, s: 80, l: 55 },
];

const POWERUP_ICONS: Record<PowerUp["type"], string> = {
  rapid: "⚡", triple: "✦", shield: "🛡", nuke: "💥", freeze: "❄", score2x: "×2"
};
const POWERUP_COLORS: Record<PowerUp["type"], string> = {
  rapid: "#facc15", triple: "#a78bfa", shield: "#60a5fa", nuke: "#f87171", freeze: "#67e8f9", score2x: "#4ade80"
};
const POWERUP_TYPES: PowerUp["type"][] = ["rapid", "triple", "shield", "nuke", "freeze", "score2x"];

function makeEnemy(W: number, isBoss = false): EnemyBlob {
  const p = ENEMY_PALETTE[Math.floor(Math.random() * ENEMY_PALETTE.length)];
  const r = isBoss ? 64 + Math.random() * 24 : 18 + Math.random() * 28;
  const nPts = isBoss ? 14 : 9;
  return {
    x: r + Math.random() * (W - r * 2),
    y: -r - 20,
    vx: (Math.random() - 0.5) * (isBoss ? 0.6 : 1.2),
    vy: isBoss ? 0.35 : 0.5 + Math.random() * 0.8,
    r, hue: p.h + (Math.random() - 0.5) * 18, sat: p.s, lit: p.l,
    hp: isBoss ? 20 : 1 + Math.floor(Math.random() * 2),
    maxHp: isBoss ? 20 : 2,
    pts: Array.from({ length: nPts }, (_, i) => {
      const angle = (i / nPts) * Math.PI * 2;
      const rr = r * (0.75 + Math.random() * 0.5);
      return { angle, r: rr, rTarget: rr, speed: Math.random() * 0.018 + 0.007 };
    }),
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * (isBoss ? 0.005 : 0.012),
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: isBoss ? 1.2 : 1.5 + Math.random(),
    isBoss,
    wobble: 0, wobbleT: 0,
    dead: false, deathTimer: 0,
  };
}

function drawBlobShape(
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

function spawnExplosion(particles: Particle[], x: number, y: number, hue: number, big: boolean) {
  const count = big ? 28 : 10;
  for (let k = 0; k < count; k++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * (big ? 5 : 3) + 1);
    const type: Particle["type"] = Math.random() < 0.2 ? "spark" : "normal";
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: big ? 60 + Math.random() * 40 : 35 + Math.random() * 25,
      maxLife: big ? 100 : 60,
      size: type === "spark" ? 1.5 : Math.random() * (big ? 5 : 3) + 1,
      hue, type,
    });
  }
  if (big) {
    particles.push({ x, y, vx: 0, vy: 0, life: 30, maxLife: 30, size: 80, hue, type: "ring" });
  }
}

// ── Cannon drawing ─────────────────────────────────────────────────────────
function drawCannon(ctx: CanvasRenderingContext2D, x: number, y: number, recoil: number, shielded: boolean) {
  ctx.save();
  ctx.translate(x, y);

  // Shield aura
  if (shielded) {
    const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, 52);
    grad.addColorStop(0, "hsla(215,88%,62%,0.15)");
    grad.addColorStop(0.6, "hsla(215,88%,62%,0.08)");
    grad.addColorStop(1, "hsla(215,88%,62%,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "hsla(215,88%,72%,0.6)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Base platform
  const baseGrad = ctx.createLinearGradient(-22, 8, 22, 22);
  baseGrad.addColorStop(0, "#2d4a2d");
  baseGrad.addColorStop(0.5, "#3a6e3a");
  baseGrad.addColorStop(1, "#1e331e");
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.roundRect(-22, 8, 44, 16, 6);
  ctx.fill();
  ctx.strokeStyle = "hsla(127,49%,60%,0.5)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Wheels
  for (const wx of [-14, 14]) {
    ctx.fillStyle = "#1a2a1a";
    ctx.beginPath();
    ctx.arc(wx, 22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "hsla(127,49%,50%,0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "hsla(127,49%,60%,0.3)";
    ctx.beginPath();
    ctx.arc(wx, 22, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Barrel (with recoil)
  const barrelY = recoil;
  const barrelGrad = ctx.createLinearGradient(-5, barrelY - 26, 5, barrelY - 26);
  barrelGrad.addColorStop(0, "#4ade80");
  barrelGrad.addColorStop(0.5, "#86efac");
  barrelGrad.addColorStop(1, "#22c55e");
  ctx.fillStyle = barrelGrad;
  ctx.beginPath();
  ctx.roundRect(-5, barrelY - 26, 10, 26, 3);
  ctx.fill();
  ctx.strokeStyle = "hsla(127,60%,70%,0.4)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Barrel tip glow
  const tipGrad = ctx.createRadialGradient(0, barrelY - 27, 0, 0, barrelY - 27, 9);
  tipGrad.addColorStop(0, "hsla(127,90%,70%,0.9)");
  tipGrad.addColorStop(0.5, "hsla(127,80%,60%,0.4)");
  tipGrad.addColorStop(1, "hsla(127,80%,60%,0)");
  ctx.fillStyle = tipGrad;
  ctx.beginPath();
  ctx.arc(0, barrelY - 27, 9, 0, Math.PI * 2);
  ctx.fill();

  // Body dome
  const bodyGrad = ctx.createRadialGradient(-4, -2, 0, 0, 2, 20);
  bodyGrad.addColorStop(0, "#5aec8a");
  bodyGrad.addColorStop(0.5, "#22c55e");
  bodyGrad.addColorStop(1, "#14532d");
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(0, 4, 18, Math.PI, 0);
  ctx.lineTo(18, 10);
  ctx.lineTo(-18, 10);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "hsla(127,60%,65%,0.5)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Cockpit window
  ctx.fillStyle = "hsla(215,88%,70%,0.5)";
  ctx.beginPath();
  ctx.ellipse(0, 2, 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "hsla(215,88%,80%,0.7)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
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

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // ── Stars ──────────────────────────────────────────────────────────────
    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      size: Math.random() * 1.6 + 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 2.5 + 0.5,
    }));

    const shootingStars: ShootingStar[] = [];
    let ssTimer = 0;

    // ── Game entities ───────────────────────────────────────────────────────
    const enemies: EnemyBlob[] = [];
    const bullets: Bullet[] = [];
    const particles: Particle[] = [];
    const powerUps: PowerUp[] = [];
    const comboTexts: ComboText[] = [];

    let enemyTimer = 0;
    let bulletTimer = 0;
    let powerUpTimer = 0;
    let bossTimer = 0;
    let killStreak = 0;
    let streakResetTimer = 0;
    let score = 0;
    let recoil = 0;
    let shielded = false;
    let shieldTimer = 0;

    // Cannon auto-movement
    let cannonX = W / 2;
    let cannonTargetX = W / 2;
    let cannonMoveTimer = 0;
    const CANNON_Y_OFFSET = 80; // px from bottom

    function pickNewCannonTarget() {
      cannonTargetX = W * 0.1 + Math.random() * W * 0.8;
      cannonMoveTimer = 120 + Math.random() * 180;
    }
    pickNewCannonTarget();

    function spawnEnemy(boss = false) {
      if (enemies.filter(e => e.isBoss).length > 0 && boss) return;
      enemies.push(makeEnemy(W, boss));
    }

    function fireBullet() {
      bullets.push({
        x: cannonX, y: H - CANNON_Y_OFFSET - 28 + recoil,
        vy: -14,
        life: 60, hue: 127, len: 18,
      });
      recoil = 5;
    }

    function addComboText(x: number, y: number, multiplier: number) {
      const texts = ["SQUISH!", "COMBO!", "NICE!", "CHAIN!", "BOOM!", "OBLITERATED!", "×4 MAX!"];
      const text = multiplier >= 4 ? "×4 MAX!" : multiplier >= 3 ? "×3 CHAIN!" : multiplier >= 2 ? "×2 COMBO!" : texts[Math.floor(Math.random() * 4)];
      const colors = ["#4ade80", "#a78bfa", "#facc15", "#f87171", "#67e8f9"];
      comboTexts.push({
        x, y,
        vy: -1.2,
        text,
        life: 70, maxLife: 70,
        color: multiplier >= 3 ? "#facc15" : colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function frame() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      // ── Stars ──
      stars.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkle);
        ctx.globalAlpha = s.opacity * (0.4 + 0.6 * tw);
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Shooting stars ──
      ssTimer++;
      if (ssTimer % 160 === 0 && Math.random() < 0.7) {
        const spd = 10 + Math.random() * 8;
        const ang = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
        shootingStars.push({ x: Math.random() * W, y: Math.random() * H * 0.4, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 1, maxLife: 25 + Math.random() * 20 });
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx; ss.y += ss.vy; ss.life--;
        if (ss.life <= 0) { shootingStars.splice(i, 1); continue; }
        const frac = ss.life / ss.maxLife;
        ctx.globalAlpha = frac * 0.75;
        const tail = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        tail.addColorStop(0, "rgba(255,255,255,0.9)");
        tail.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.stroke();
      }

      // ── Spawn enemies ──
      enemyTimer++;
      if (enemyTimer % 90 === 0 && enemies.length < 10) spawnEnemy();

      // ── Boss spawn ──
      bossTimer++;
      if (bossTimer % 900 === 0) spawnEnemy(true);

      // ── Auto-fire ──
      bulletTimer++;
      if (bulletTimer % 18 === 0) fireBullet();

      // ── Cannon movement ──
      cannonMoveTimer--;
      if (cannonMoveTimer <= 0) pickNewCannonTarget();
      cannonX += (cannonTargetX - cannonX) * 0.025;
      recoil *= 0.8;

      // ── Shield timer ──
      if (shielded) { shieldTimer--; if (shieldTimer <= 0) shielded = false; }

      // ── Power-up spawning ──
      powerUpTimer++;
      if (powerUpTimer % 300 === 0) {
        powerUps.push({
          x: W * 0.1 + Math.random() * W * 0.8,
          y: -20,
          vy: 0.8,
          type: POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)],
          life: 300,
        });
      }

      // ── Bullets ──
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y += b.vy;
        b.life--;
        if (b.life <= 0 || b.y < -20) { bullets.splice(i, 1); continue; }

        // Bullet vs enemy
        let hit = false;
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (e.dead) continue;
          const dx = b.x - e.x, dy = b.y - e.y;
          if (Math.sqrt(dx * dx + dy * dy) < e.r * 1.1) {
            e.hp--;
            // Hit flash wobble
            e.wobble = 0.3;
            if (e.hp <= 0) {
              e.dead = true;
              e.deathTimer = 20;
              spawnExplosion(particles, e.x, e.y, e.hue, e.isBoss);
              killStreak++;
              streakResetTimer = 80;
              score += e.isBoss ? 500 : (10 * Math.min(killStreak, 4));
              if (killStreak >= 2) addComboText(e.x, e.y - e.r, Math.min(killStreak, 4));
            } else {
              spawnExplosion(particles, b.x, b.y, e.hue, false);
            }
            hit = true;
            break;
          }
        }
        if (hit) { bullets.splice(i, 1); continue; }

        // Draw bullet
        const bulletGrad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.len);
        bulletGrad.addColorStop(0, "hsla(127,100%,75%,0)");
        bulletGrad.addColorStop(0.3, "hsla(127,90%,65%,0.7)");
        bulletGrad.addColorStop(1, "hsla(127,90%,70%,1)");
        ctx.globalAlpha = 0.95;
        ctx.strokeStyle = bulletGrad;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x, b.y + b.len);
        ctx.stroke();

        // Bullet glow
        ctx.globalAlpha = 0.5;
        const bg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 8);
        bg.addColorStop(0, "hsla(127,90%,70%,0.8)");
        bg.addColorStop(1, "hsla(127,90%,70%,0)");
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Enemies ──
      streakResetTimer--;
      if (streakResetTimer <= 0) killStreak = 0;

      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];

        // Death animation
        if (e.dead) {
          e.deathTimer--;
          if (e.deathTimer <= 0) { enemies.splice(i, 1); continue; }
          ctx.globalAlpha = e.deathTimer / 20 * 0.5;
          const dg = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 2);
          dg.addColorStop(0, `hsla(${e.hue},${e.sat}%,80%,0.8)`);
          dg.addColorStop(1, `hsla(${e.hue},${e.sat}%,${e.lit}%,0)`);
          ctx.fillStyle = dg;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.r * 2 * (1 - e.deathTimer / 20), 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        // Movement
        e.x += e.vx; e.y += e.vy;
        e.rot += e.rotSpeed;
        e.wobbleT += 0.08;
        e.wobble *= 0.9;

        // Bounce off walls
        if (e.x < e.r) { e.x = e.r; e.vx = Math.abs(e.vx); }
        if (e.x > W - e.r) { e.x = W - e.r; e.vx = -Math.abs(e.vx); }
        if (e.y > H + e.r * 2) { enemies.splice(i, 1); continue; }

        // Update blob points
        e.pts.forEach(pt => {
          pt.r += (pt.rTarget - pt.r) * pt.speed;
          if (Math.abs(pt.r - pt.rTarget) < 1) {
            pt.rTarget = e.r * (0.7 + Math.random() * 0.6);
          }
        });

        const wobblePulse = 1 + (0.06 + e.wobble) * Math.sin(t * e.pulseSpeed + e.pulsePhase);
        const rotPts = e.pts.map(pt => ({ angle: pt.angle + e.rot, r: pt.r * wobblePulse }));

        // Boss HP bar
        if (e.isBoss && !e.dead) {
          const bw = e.r * 2.5;
          const bx = e.x - bw / 2;
          const by = e.y - e.r - 18;
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, 6, 3);
          ctx.fill();
          ctx.fillStyle = `hsl(${e.hue},${e.sat}%,${e.lit}%)`;
          ctx.beginPath();
          ctx.roundRect(bx, by, bw * (e.hp / e.maxHp), 6, 3);
          ctx.fill();
        }

        // Outer glow
        const glowR = e.r * (e.isBoss ? 2.8 : 2.2);
        const gg = ctx.createRadialGradient(e.x, e.y, e.r * 0.1, e.x, e.y, glowR);
        gg.addColorStop(0, `hsla(${e.hue},${e.sat}%,${e.lit}%,${e.isBoss ? 0.22 : 0.15})`);
        gg.addColorStop(0.5, `hsla(${e.hue},${e.sat}%,${e.lit}%,0.05)`);
        gg.addColorStop(1, `hsla(${e.hue},${e.sat}%,${e.lit}%,0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(e.x, e.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.save();
        drawBlobShape(ctx, e.x, e.y, rotPts);
        ctx.clip();

        const bg = ctx.createRadialGradient(
          e.x - e.r * 0.3, e.y - e.r * 0.3, 0,
          e.x, e.y, e.r * 1.2
        );
        bg.addColorStop(0, `hsla(${e.hue},${e.sat}%,${Math.min(e.lit + 25, 88)}%,1)`);
        bg.addColorStop(0.45, `hsla(${e.hue},${e.sat}%,${e.lit}%,1)`);
        bg.addColorStop(1, `hsla(${e.hue},${e.sat - 8}%,${Math.max(e.lit - 18, 12)}%,1)`);
        ctx.globalAlpha = e.isBoss ? 0.88 : 0.78;
        ctx.fillStyle = bg;
        ctx.fillRect(e.x - glowR, e.y - glowR, glowR * 2, glowR * 2);

        // Specular
        const sg = ctx.createRadialGradient(e.x - e.r * 0.3, e.y - e.r * 0.35, 0, e.x - e.r * 0.1, e.y - e.r * 0.1, e.r * 0.55);
        sg.addColorStop(0, "rgba(255,255,255,0.45)");
        sg.addColorStop(0.5, "rgba(255,255,255,0.1)");
        sg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = sg;
        ctx.fillRect(e.x - glowR, e.y - glowR, glowR * 2, glowR * 2);

        // Rim stroke
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = `hsla(${e.hue},${e.sat}%,${Math.min(e.lit + 30, 92)}%,0.7)`;
        ctx.lineWidth = e.isBoss ? 3 : 1.5;
        ctx.stroke();

        ctx.restore();

        // Boss face (eyes)
        if (e.isBoss) {
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = "rgba(0,0,0,0.7)";
          for (const ex of [-e.r * 0.28, e.r * 0.28]) {
            ctx.beginPath();
            ctx.arc(e.x + ex, e.y - e.r * 0.1, e.r * 0.12, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = "#fff";
          for (const ex of [-e.r * 0.28, e.r * 0.28]) {
            ctx.beginPath();
            ctx.arc(e.x + ex - e.r * 0.03, e.y - e.r * 0.14, e.r * 0.04, 0, Math.PI * 2);
            ctx.fill();
          }
          // Angry brow
          ctx.strokeStyle = "rgba(0,0,0,0.7)";
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(e.x - e.r * 0.4, e.y - e.r * 0.28);
          ctx.lineTo(e.x - e.r * 0.18, e.y - e.r * 0.22);
          ctx.moveTo(e.x + e.r * 0.18, e.y - e.r * 0.22);
          ctx.lineTo(e.x + e.r * 0.4, e.y - e.r * 0.28);
          ctx.stroke();
        } else {
          // Normal blob eyes (cute dots)
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          for (const ex of [-e.r * 0.25, e.r * 0.25]) {
            ctx.beginPath();
            ctx.arc(e.x + ex, e.y - e.r * 0.1, e.r * 0.12, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = "#fff";
          for (const ex of [-e.r * 0.25, e.r * 0.25]) {
            ctx.beginPath();
            ctx.arc(e.x + ex - e.r * 0.03, e.y - e.r * 0.13, e.r * 0.04, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // ── Power-ups ──
      for (let i = powerUps.length - 1; i >= 0; i--) {
        const pu = powerUps[i];
        pu.y += pu.vy;
        pu.life--;
        if (pu.life <= 0 || pu.y > H + 30) { powerUps.splice(i, 1); continue; }

        // Shield pickup (just visuals, no real collision needed for the bg)
        const dx = pu.x - cannonX, dy = pu.y - (H - CANNON_Y_OFFSET);
        if (Math.sqrt(dx * dx + dy * dy) < 32) {
          if (pu.type === "shield") { shielded = true; shieldTimer = 240; }
          powerUps.splice(i, 1);
          spawnExplosion(particles, pu.x, pu.y, 127, false);
          continue;
        }

        const color = POWERUP_COLORS[pu.type];
        const icon = POWERUP_ICONS[pu.type];
        const bob = Math.sin(t * 3 + i) * 4;

        // Glow
        ctx.globalAlpha = 0.6;
        const pg = ctx.createRadialGradient(pu.x, pu.y + bob, 0, pu.x, pu.y + bob, 22);
        pg.addColorStop(0, color + "55");
        pg.addColorStop(1, color + "00");
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(pu.x, pu.y + bob, 22, 0, Math.PI * 2);
        ctx.fill();

        // Box
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "rgba(10,20,10,0.8)";
        ctx.beginPath();
        ctx.roundRect(pu.x - 14, pu.y + bob - 14, 28, 28, 8);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Icon
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.font = `bold ${pu.type === "score2x" ? 11 : 14}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(icon, pu.x, pu.y + bob);
      }

      // ── Particles ──
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.06; // gravity
        p.vx *= 0.97;
        p.life--;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const frac = p.life / p.maxLife;

        if (p.type === "ring") {
          const rad = p.size * (1 - frac) * 2;
          ctx.globalAlpha = frac * 0.6;
          ctx.strokeStyle = `hsl(${p.hue},80%,65%)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.type === "spark") {
          ctx.globalAlpha = frac * 0.9;
          ctx.strokeStyle = `hsl(${p.hue},100%,82%)`;
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
          ctx.stroke();
        } else {
          ctx.globalAlpha = frac * 0.8;
          ctx.fillStyle = `hsl(${p.hue},80%,68%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(p.size * frac, 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Cannon ──
      ctx.globalAlpha = 1;
      drawCannon(ctx, cannonX, H - CANNON_Y_OFFSET, recoil, shielded);

      // ── Combo / Score texts ──
      for (let i = comboTexts.length - 1; i >= 0; i--) {
        const ct = comboTexts[i];
        ct.y += ct.vy;
        ct.life--;
        if (ct.life <= 0) { comboTexts.splice(i, 1); continue; }
        const frac = ct.life / ct.maxLife;
        ctx.globalAlpha = frac;
        ctx.fillStyle = ct.color;
        ctx.font = `bold ${11 + (1 - frac) * 4}px "Share Tech Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ct.text, ct.x, ct.y);
      }

      // ── HUD Score ──
      if (score > 0) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "hsla(127,60%,65%,0.8)";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`SCORE ${score.toLocaleString()}`, 16, H - 20);
      }

      ctx.globalAlpha = 1;
      ctx.textAlign = "left";
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen", opacity: 0.9 }}
    />
  );
}
