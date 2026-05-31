import { useEffect, useRef } from "react";

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
  shootTimer: number; shootWarning: number;
}

interface Bullet { x: number; y: number; vy: number; life: number; hue: number; len: number; }

interface BossProjectile {
  x: number; y: number; vx: number; vy: number;
  r: number; hue: number; life: number; maxLife: number;
  wobble: number; trail: { x: number; y: number }[];
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; hue: number;
  type: "spark" | "ring" | "normal";
}

interface PowerUp { x: number; y: number; vy: number; type: string; life: number; }
interface ComboText { x: number; y: number; vy: number; text: string; life: number; maxLife: number; color: string; }
interface ImpactFlash { x: number; y: number; r: number; life: number; maxLife: number; }

const ENEMY_PALETTE = [
  { h: 127, s: 65, l: 52 }, { h: 263, s: 68, l: 58 }, { h: 48, s: 95, l: 58 },
  { h: 215, s: 88, l: 62 }, { h: 0, s: 78, l: 62 }, { h: 180, s: 80, l: 55 },
];
const POWERUP_ICONS: Record<string, string> = { rapid: "⚡", triple: "✦", shield: "🛡", nuke: "💥", freeze: "❄", score2x: "×2" };
const POWERUP_COLORS: Record<string, string> = { rapid: "#facc15", triple: "#a78bfa", shield: "#60a5fa", nuke: "#f87171", freeze: "#67e8f9", score2x: "#4ade80" };
const POWERUP_TYPES = ["rapid", "triple", "shield", "nuke", "freeze", "score2x"];

function makeEnemy(W: number, isBoss = false): EnemyBlob {
  const p = ENEMY_PALETTE[Math.floor(Math.random() * ENEMY_PALETTE.length)];
  const r = isBoss ? 64 + Math.random() * 24 : 18 + Math.random() * 28;
  const nPts = isBoss ? 14 : 9;
  return {
    x: r + Math.random() * (W - r * 2), y: -r - 20,
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
    rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * (isBoss ? 0.005 : 0.012),
    pulsePhase: Math.random() * Math.PI * 2, pulseSpeed: isBoss ? 1.2 : 1.5 + Math.random(),
    isBoss, wobble: 0, wobbleT: 0, dead: false, deathTimer: 0,
    shootTimer: isBoss ? 180 + Math.floor(Math.random() * 60) : 0,
    shootWarning: 0,
  };
}

function drawBlobShape(ctx: CanvasRenderingContext2D, cx: number, cy: number, pts: { angle: number; r: number }[]) {
  const n = pts.length;
  const coords = pts.map(p => ({ x: cx + Math.cos(p.angle) * p.r, y: cy + Math.sin(p.angle) * p.r }));
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const prev = coords[(i - 1 + n) % n], curr = coords[i], next = coords[(i + 1) % n], next2 = coords[(i + 2) % n];
    if (i === 0) ctx.moveTo(curr.x, curr.y);
    ctx.bezierCurveTo(curr.x + (next.x - prev.x) / 6, curr.y + (next.y - prev.y) / 6, next.x - (next2.x - curr.x) / 6, next.y - (next2.y - curr.y) / 6, next.x, next.y);
  }
  ctx.closePath();
}

function spawnExplosion(particles: Particle[], x: number, y: number, hue: number, big: boolean) {
  const count = big ? 28 : 10;
  for (let k = 0; k < count; k++) {
    const angle = Math.random() * Math.PI * 2, spd = Math.random() * (big ? 5 : 3) + 1;
    const type: Particle["type"] = Math.random() < 0.2 ? "spark" : "normal";
    particles.push({ x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, life: big ? 60 + Math.random() * 40 : 35 + Math.random() * 25, maxLife: big ? 100 : 60, size: type === "spark" ? 1.5 : Math.random() * (big ? 5 : 3) + 1, hue, type });
  }
  if (big) particles.push({ x, y, vx: 0, vy: 0, life: 30, maxLife: 30, size: 80, hue, type: "ring" });
}

function drawCannon(ctx: CanvasRenderingContext2D, x: number, y: number, recoil: number, shielded: boolean, dodgeX: number) {
  ctx.save();
  ctx.translate(x + dodgeX, y);
  if (shielded) {
    const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, 52);
    grad.addColorStop(0, "hsla(215,88%,62%,0.15)"); grad.addColorStop(0.6, "hsla(215,88%,62%,0.08)"); grad.addColorStop(1, "hsla(215,88%,62%,0)");
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, 52, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "hsla(215,88%,72%,0.6)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.arc(0, 0, 44, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  }
  const baseGrad = ctx.createLinearGradient(-22, 8, 22, 22);
  baseGrad.addColorStop(0, "#2d4a2d"); baseGrad.addColorStop(0.5, "#3a6e3a"); baseGrad.addColorStop(1, "#1e331e");
  ctx.fillStyle = baseGrad; ctx.beginPath(); ctx.roundRect(-22, 8, 44, 16, 6); ctx.fill();
  ctx.strokeStyle = "hsla(127,49%,60%,0.5)"; ctx.lineWidth = 1; ctx.stroke();
  for (const wx of [-14, 14]) {
    ctx.fillStyle = "#1a2a1a"; ctx.beginPath(); ctx.arc(wx, 22, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "hsla(127,49%,50%,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "hsla(127,49%,60%,0.3)"; ctx.beginPath(); ctx.arc(wx, 22, 3, 0, Math.PI * 2); ctx.fill();
  }
  const barrelY = recoil;
  const barrelGrad = ctx.createLinearGradient(-5, barrelY - 26, 5, barrelY - 26);
  barrelGrad.addColorStop(0, "#4ade80"); barrelGrad.addColorStop(0.5, "#86efac"); barrelGrad.addColorStop(1, "#22c55e");
  ctx.fillStyle = barrelGrad; ctx.beginPath(); ctx.roundRect(-5, barrelY - 26, 10, 26, 3); ctx.fill();
  ctx.strokeStyle = "hsla(127,60%,70%,0.4)"; ctx.lineWidth = 1; ctx.stroke();
  const tipGrad = ctx.createRadialGradient(0, barrelY - 27, 0, 0, barrelY - 27, 9);
  tipGrad.addColorStop(0, "hsla(127,90%,70%,0.9)"); tipGrad.addColorStop(0.5, "hsla(127,80%,60%,0.4)"); tipGrad.addColorStop(1, "hsla(127,80%,60%,0)");
  ctx.fillStyle = tipGrad; ctx.beginPath(); ctx.arc(0, barrelY - 27, 9, 0, Math.PI * 2); ctx.fill();
  const bodyGrad = ctx.createRadialGradient(-4, -2, 0, 0, 2, 20);
  bodyGrad.addColorStop(0, "#5aec8a"); bodyGrad.addColorStop(0.5, "#22c55e"); bodyGrad.addColorStop(1, "#14532d");
  ctx.fillStyle = bodyGrad; ctx.beginPath(); ctx.arc(0, 4, 18, Math.PI, 0); ctx.lineTo(18, 10); ctx.lineTo(-18, 10); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "hsla(127,60%,65%,0.5)"; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = "hsla(215,88%,70%,0.5)"; ctx.beginPath(); ctx.ellipse(0, 2, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "hsla(215,88%,80%,0.7)"; ctx.lineWidth = 1; ctx.stroke();
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
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * W, y: Math.random() * H, size: Math.random() * 1.6 + 0.2,
      opacity: Math.random() * 0.6 + 0.2, twinkle: Math.random() * Math.PI * 2, twinkleSpeed: Math.random() * 2.5 + 0.5,
    }));
    const shootingStars: ShootingStar[] = [];
    let ssTimer = 0;

    const enemies: EnemyBlob[] = [];
    const bullets: Bullet[] = [];
    const bossProjectiles: BossProjectile[] = [];
    const particles: Particle[] = [];
    const powerUps: PowerUp[] = [];
    const comboTexts: ComboText[] = [];
    const impactFlashes: ImpactFlash[] = [];

    let enemyTimer = 0, bulletTimer = 0, powerUpTimer = 0, bossTimer = 0;
    let killStreak = 0, streakResetTimer = 0, score = 0;
    let recoil = 0, dodgeX = 0, dodgeTarget = 0;
    let shielded = false, shieldTimer = 0;
    let cannonX = W / 2, cannonTargetX = W / 2, cannonMoveTimer = 0;
    const CANNON_Y = () => H - 80;

    function pickTarget() { cannonTargetX = W * 0.1 + Math.random() * W * 0.8; cannonMoveTimer = 120 + Math.random() * 180; }
    pickTarget();

    function spawnEnemy(boss = false) {
      if (boss && enemies.some(e => e.isBoss)) return;
      enemies.push(makeEnemy(W, boss));
    }

    function fireBullet() {
      bullets.push({ x: cannonX, y: CANNON_Y() - 28 + recoil, vy: -14, life: 60, hue: 127, len: 18 });
      recoil = 5;
    }

    function bossFire(boss: EnemyBlob) {
      const spread = boss.isBoss ? 3 : 1;
      for (let k = 0; k < spread; k++) {
        const dx = (cannonX - boss.x) + (k - 1) * 60;
        const dy = CANNON_Y() - boss.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const spd = 3.5 + Math.random() * 1.5;
        bossProjectiles.push({
          x: boss.x, y: boss.y + boss.r,
          vx: (dx / dist) * spd * 0.4 + (k - 1) * 1.5,
          vy: (dy / dist) * spd,
          r: 9 + Math.random() * 5,
          hue: boss.hue,
          life: 120, maxLife: 120,
          wobble: 0,
          trail: [],
        });
      }
      // Cannon dodge reaction
      dodgeTarget = (Math.random() - 0.5) * 60;
    }

    function addComboText(x: number, y: number, mult: number) {
      const t2 = mult >= 4 ? "×4 MAX!" : mult >= 3 ? "×3 CHAIN!" : mult >= 2 ? "×2 COMBO!" : "SQUISH!";
      comboTexts.push({ x, y, vy: -1.2, text: t2, life: 70, maxLife: 70, color: mult >= 3 ? "#facc15" : "#4ade80" });
    }

    function frame() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      // Stars
      stars.forEach(s => {
        const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkle);
        ctx.globalAlpha = s.opacity * (0.4 + 0.6 * tw);
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
      });

      // Shooting stars
      ssTimer++;
      if (ssTimer % 160 === 0 && Math.random() < 0.7) {
        const spd = 10 + Math.random() * 8, ang = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
        shootingStars.push({ x: Math.random() * W, y: Math.random() * H * 0.4, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 1, maxLife: 25 + Math.random() * 20 });
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]; ss.x += ss.vx; ss.y += ss.vy; ss.life--;
        if (ss.life <= 0) { shootingStars.splice(i, 1); continue; }
        const frac = ss.life / ss.maxLife;
        ctx.globalAlpha = frac * 0.75;
        const tail = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        tail.addColorStop(0, "rgba(255,255,255,0.9)"); tail.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = tail; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ss.x, ss.y); ctx.lineTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8); ctx.stroke();
      }

      // Spawn
      enemyTimer++; if (enemyTimer % 90 === 0 && enemies.length < 10) spawnEnemy();
      bossTimer++; if (bossTimer % 900 === 0) spawnEnemy(true);
      bulletTimer++; if (bulletTimer % 18 === 0) fireBullet();
      powerUpTimer++; if (powerUpTimer % 300 === 0) {
        powerUps.push({ x: W * 0.1 + Math.random() * W * 0.8, y: -20, vy: 0.8, type: POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)], life: 300 });
      }

      // Cannon movement
      cannonMoveTimer--; if (cannonMoveTimer <= 0) pickTarget();
      cannonX += (cannonTargetX - cannonX) * 0.025;
      recoil *= 0.8;
      dodgeX += (dodgeTarget - dodgeX) * 0.08; dodgeTarget *= 0.95;
      if (shielded) { shieldTimer--; if (shieldTimer <= 0) shielded = false; }

      // Bullets vs enemies
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i]; b.y += b.vy; b.life--;
        if (b.life <= 0 || b.y < -20) { bullets.splice(i, 1); continue; }
        let hit = false;
        for (const e of enemies) {
          if (e.dead) continue;
          const dx = b.x - e.x, dy = b.y - e.y;
          if (Math.sqrt(dx * dx + dy * dy) < e.r * 1.1) {
            e.hp--; e.wobble = 0.3;
            if (e.hp <= 0) {
              e.dead = true; e.deathTimer = 20;
              spawnExplosion(particles, e.x, e.y, e.hue, e.isBoss);
              killStreak++; streakResetTimer = 80;
              score += e.isBoss ? 500 : 10 * Math.min(killStreak, 4);
              if (killStreak >= 2) addComboText(e.x, e.y - e.r, Math.min(killStreak, 4));
            } else spawnExplosion(particles, b.x, b.y, e.hue, false);
            hit = true; break;
          }
        }
        if (hit) { bullets.splice(i, 1); continue; }
        // Draw bullet
        const bg2 = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.len);
        bg2.addColorStop(0, "hsla(127,100%,75%,0)"); bg2.addColorStop(0.3, "hsla(127,90%,65%,0.7)"); bg2.addColorStop(1, "hsla(127,90%,70%,1)");
        ctx.globalAlpha = 0.95; ctx.strokeStyle = bg2; ctx.lineWidth = 3; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x, b.y + b.len); ctx.stroke();
        ctx.globalAlpha = 0.5;
        const bg3 = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 8);
        bg3.addColorStop(0, "hsla(127,90%,70%,0.8)"); bg3.addColorStop(1, "hsla(127,90%,70%,0)");
        ctx.fillStyle = bg3; ctx.beginPath(); ctx.arc(b.x, b.y, 8, 0, Math.PI * 2); ctx.fill();
      }

      // Enemies
      streakResetTimer--; if (streakResetTimer <= 0) killStreak = 0;
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (e.dead) {
          e.deathTimer--;
          if (e.deathTimer <= 0) { enemies.splice(i, 1); continue; }
          ctx.globalAlpha = e.deathTimer / 20 * 0.5;
          const dg = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 2);
          dg.addColorStop(0, `hsla(${e.hue},${e.sat}%,80%,0.8)`); dg.addColorStop(1, `hsla(${e.hue},${e.sat}%,${e.lit}%,0)`);
          ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 2 * (1 - e.deathTimer / 20), 0, Math.PI * 2); ctx.fill();
          continue;
        }

        e.x += e.vx; e.y += e.vy; e.rot += e.rotSpeed; e.wobbleT += 0.08; e.wobble *= 0.9;
        if (e.x < e.r) { e.x = e.r; e.vx = Math.abs(e.vx); }
        if (e.x > W - e.r) { e.x = W - e.r; e.vx = -Math.abs(e.vx); }
        if (e.y > H + e.r * 2) { enemies.splice(i, 1); continue; }

        // Boss shoot logic
        if (e.isBoss && e.y > 80) {
          e.shootTimer--;
          if (e.shootTimer <= 30 && e.shootWarning === 0) e.shootWarning = 30;
          if (e.shootWarning > 0) {
            e.shootWarning--;
            // Warning pulse ring
            const wFrac = 1 - e.shootWarning / 30;
            ctx.globalAlpha = (1 - wFrac) * 0.7;
            ctx.strokeStyle = `hsl(${e.hue},90%,65%)`;
            ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(e.x, e.y, e.r + wFrac * 40, 0, Math.PI * 2); ctx.stroke();
          }
          if (e.shootTimer <= 0) {
            bossFire(e);
            e.shootTimer = 220 + Math.floor(Math.random() * 80);
            e.shootWarning = 0;
          }
        }

        e.pts.forEach(pt => {
          pt.r += (pt.rTarget - pt.r) * pt.speed;
          if (Math.abs(pt.r - pt.rTarget) < 1) pt.rTarget = e.r * (0.7 + Math.random() * 0.6);
        });
        const pulse = 1 + (0.06 + e.wobble) * Math.sin(t * e.pulseSpeed + e.pulsePhase);
        const rotPts = e.pts.map(pt => ({ angle: pt.angle + e.rot, r: pt.r * pulse }));

        if (e.isBoss && !e.dead) {
          const bw = e.r * 2.5, bx = e.x - bw / 2, by = e.y - e.r - 18;
          ctx.globalAlpha = 0.8; ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.roundRect(bx, by, bw, 6, 3); ctx.fill();
          ctx.fillStyle = `hsl(${e.hue},${e.sat}%,${e.lit}%)`; ctx.beginPath(); ctx.roundRect(bx, by, bw * (e.hp / e.maxHp), 6, 3); ctx.fill();
        }

        const glowR = e.r * (e.isBoss ? 2.8 : 2.2);
        const gg = ctx.createRadialGradient(e.x, e.y, e.r * 0.1, e.x, e.y, glowR);
        gg.addColorStop(0, `hsla(${e.hue},${e.sat}%,${e.lit}%,${e.isBoss ? 0.22 : 0.15})`);
        gg.addColorStop(0.5, `hsla(${e.hue},${e.sat}%,${e.lit}%,0.05)`);
        gg.addColorStop(1, `hsla(${e.hue},${e.sat}%,${e.lit}%,0)`);
        ctx.globalAlpha = 1; ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(e.x, e.y, glowR, 0, Math.PI * 2); ctx.fill();

        ctx.save();
        drawBlobShape(ctx, e.x, e.y, rotPts); ctx.clip();
        const bg = ctx.createRadialGradient(e.x - e.r * 0.3, e.y - e.r * 0.3, 0, e.x, e.y, e.r * 1.2);
        bg.addColorStop(0, `hsla(${e.hue},${e.sat}%,${Math.min(e.lit + 25, 88)}%,1)`);
        bg.addColorStop(0.45, `hsla(${e.hue},${e.sat}%,${e.lit}%,1)`);
        bg.addColorStop(1, `hsla(${e.hue},${e.sat - 8}%,${Math.max(e.lit - 18, 12)}%,1)`);
        ctx.globalAlpha = e.isBoss ? 0.88 : 0.78; ctx.fillStyle = bg; ctx.fillRect(e.x - glowR, e.y - glowR, glowR * 2, glowR * 2);
        const sg = ctx.createRadialGradient(e.x - e.r * 0.3, e.y - e.r * 0.35, 0, e.x - e.r * 0.1, e.y - e.r * 0.1, e.r * 0.55);
        sg.addColorStop(0, "rgba(255,255,255,0.45)"); sg.addColorStop(0.5, "rgba(255,255,255,0.1)"); sg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 0.9; ctx.fillStyle = sg; ctx.fillRect(e.x - glowR, e.y - glowR, glowR * 2, glowR * 2);
        ctx.globalAlpha = 0.4; ctx.strokeStyle = `hsla(${e.hue},${e.sat}%,${Math.min(e.lit + 30, 92)}%,0.7)`; ctx.lineWidth = e.isBoss ? 3 : 1.5; ctx.stroke();
        ctx.restore();

        ctx.globalAlpha = 0.9;
        const eyeR = e.isBoss ? e.r * 0.12 : e.r * 0.12;
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        for (const ex of [-e.r * 0.28, e.r * 0.28]) { ctx.beginPath(); ctx.arc(e.x + ex, e.y - e.r * 0.1, eyeR, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = "#fff";
        for (const ex of [-e.r * 0.28, e.r * 0.28]) { ctx.beginPath(); ctx.arc(e.x + ex - e.r * 0.03, e.y - e.r * 0.14, eyeR * 0.35, 0, Math.PI * 2); ctx.fill(); }
        if (e.isBoss) {
          ctx.strokeStyle = "rgba(0,0,0,0.7)"; ctx.lineWidth = 3; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(e.x - e.r * 0.4, e.y - e.r * 0.28); ctx.lineTo(e.x - e.r * 0.18, e.y - e.r * 0.22);
          ctx.moveTo(e.x + e.r * 0.18, e.y - e.r * 0.22); ctx.lineTo(e.x + e.r * 0.4, e.y - e.r * 0.28); ctx.stroke();
        }
      }

      // Boss Projectiles
      for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const bp = bossProjectiles[i];
        bp.trail.push({ x: bp.x, y: bp.y });
        if (bp.trail.length > 14) bp.trail.shift();
        bp.x += bp.vx; bp.y += bp.vy; bp.life--;
        bp.wobble = Math.sin(t * 8 + i) * 2;

        if (bp.life <= 0 || bp.y > H + 20) { bossProjectiles.splice(i, 1); continue; }

        // Hit cannon zone
        const cy = CANNON_Y();
        if (bp.y > cy - 40 && bp.y < cy + 20 && Math.abs(bp.x - (cannonX + dodgeX)) < 35) {
          spawnExplosion(particles, bp.x, bp.y, bp.hue, false);
          impactFlashes.push({ x: bp.x, y: bp.y, r: 50, life: 20, maxLife: 20 });
          dodgeTarget = (Math.random() - 0.5) * 80;
          bossProjectiles.splice(i, 1); continue;
        }

        const frac = bp.life / bp.maxLife;
        // Trail
        bp.trail.forEach((pt, ti) => {
          const tf = ti / bp.trail.length;
          ctx.globalAlpha = tf * frac * 0.4;
          ctx.fillStyle = `hsl(${bp.hue},90%,65%)`;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, bp.r * tf * 0.6, 0, Math.PI * 2); ctx.fill();
        });

        // Glow
        ctx.globalAlpha = frac;
        const pg = ctx.createRadialGradient(bp.x, bp.y, 0, bp.x, bp.y, bp.r * 2.5);
        pg.addColorStop(0, `hsla(${bp.hue},90%,70%,0.6)`);
        pg.addColorStop(0.5, `hsla(${bp.hue},80%,55%,0.2)`);
        pg.addColorStop(1, `hsla(${bp.hue},80%,55%,0)`);
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(bp.x, bp.y, bp.r * 2.5, 0, Math.PI * 2); ctx.fill();

        // Core orb
        const og = ctx.createRadialGradient(bp.x - bp.r * 0.3, bp.y - bp.r * 0.3, 0, bp.x, bp.y, bp.r);
        og.addColorStop(0, `hsla(${bp.hue},100%,85%,1)`);
        og.addColorStop(0.5, `hsla(${bp.hue},90%,60%,1)`);
        og.addColorStop(1, `hsla(${bp.hue},80%,35%,1)`);
        ctx.globalAlpha = frac * 0.95; ctx.fillStyle = og;
        ctx.beginPath(); ctx.arc(bp.x + bp.wobble, bp.y, bp.r, 0, Math.PI * 2); ctx.fill();

        // Pulse ring
        const pulseR = bp.r * (1 + 0.3 * Math.sin(t * 12 + i));
        ctx.globalAlpha = frac * 0.5; ctx.strokeStyle = `hsl(${bp.hue},100%,75%)`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(bp.x, bp.y, pulseR, 0, Math.PI * 2); ctx.stroke();
      }

      // Impact flashes
      for (let i = impactFlashes.length - 1; i >= 0; i--) {
        const f = impactFlashes[i]; f.life--;
        if (f.life <= 0) { impactFlashes.splice(i, 1); continue; }
        const frac = f.life / f.maxLife;
        ctx.globalAlpha = frac * 0.6;
        const ig = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * (1 + (1 - frac)));
        ig.addColorStop(0, "rgba(255,150,80,0.9)"); ig.addColorStop(0.5, "rgba(255,80,40,0.4)"); ig.addColorStop(1, "rgba(255,50,20,0)");
        ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 + (1 - frac)), 0, Math.PI * 2); ctx.fill();
      }

      // Power-ups
      for (let i = powerUps.length - 1; i >= 0; i--) {
        const pu = powerUps[i]; pu.y += pu.vy; pu.life--;
        if (pu.life <= 0 || pu.y > H + 30) { powerUps.splice(i, 1); continue; }
        const dx = pu.x - cannonX, dy = pu.y - CANNON_Y();
        if (Math.sqrt(dx * dx + dy * dy) < 32) {
          if (pu.type === "shield") { shielded = true; shieldTimer = 240; }
          powerUps.splice(i, 1); spawnExplosion(particles, pu.x, pu.y, 127, false); continue;
        }
        const color = POWERUP_COLORS[pu.type] || "#fff";
        const icon = POWERUP_ICONS[pu.type] || "?";
        const bob = Math.sin(t * 3 + i) * 4;
        ctx.globalAlpha = 0.6;
        const ppg = ctx.createRadialGradient(pu.x, pu.y + bob, 0, pu.x, pu.y + bob, 22);
        ppg.addColorStop(0, color + "55"); ppg.addColorStop(1, color + "00");
        ctx.fillStyle = ppg; ctx.beginPath(); ctx.arc(pu.x, pu.y + bob, 22, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.85; ctx.fillStyle = "rgba(10,20,10,0.8)"; ctx.beginPath(); ctx.roundRect(pu.x - 14, pu.y + bob - 14, 28, 28, 8); ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = color; ctx.font = `bold ${pu.type === "score2x" ? 11 : 14}px monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(icon, pu.x, pu.y + bob);
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.97; p.life--;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const frac = p.life / p.maxLife;
        if (p.type === "ring") {
          ctx.globalAlpha = frac * 0.6; ctx.strokeStyle = `hsl(${p.hue},80%,65%)`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 - frac) * 2, 0, Math.PI * 2); ctx.stroke();
        } else if (p.type === "spark") {
          ctx.globalAlpha = frac * 0.9; ctx.strokeStyle = `hsl(${p.hue},100%,82%)`; ctx.lineWidth = 1.5; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4); ctx.stroke();
        } else {
          ctx.globalAlpha = frac * 0.8; ctx.fillStyle = `hsl(${p.hue},80%,68%)`;
          ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(p.size * frac, 0.5), 0, Math.PI * 2); ctx.fill();
        }
      }

      // Cannon
      ctx.globalAlpha = 1;
      drawCannon(ctx, cannonX, CANNON_Y(), recoil, shielded, dodgeX);

      // Combo texts
      for (let i = comboTexts.length - 1; i >= 0; i--) {
        const ct = comboTexts[i]; ct.y += ct.vy; ct.life--;
        if (ct.life <= 0) { comboTexts.splice(i, 1); continue; }
        ctx.globalAlpha = ct.life / ct.maxLife;
        ctx.fillStyle = ct.color; ctx.font = `bold 12px monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(ct.text, ct.x, ct.y);
      }

      // Score HUD
      if (score > 0) {
        ctx.globalAlpha = 0.5; ctx.fillStyle = "hsla(127,60%,65%,0.8)";
        ctx.font = "bold 11px monospace"; ctx.textAlign = "left"; ctx.fillText(`SCORE ${score.toLocaleString()}`, 16, H - 20);
      }

      ctx.globalAlpha = 1; ctx.textAlign = "left";
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
