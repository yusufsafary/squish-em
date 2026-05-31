import { useEffect, useRef } from "react";

interface Star { x: number; y: number; size: number; opacity: number; twinkle: number; twinkleSpeed: number; }
interface EnemyBlob {
  x: number; y: number; vx: number; vy: number;
  r: number; hue: number; sat: number; lit: number;
  hp: number; maxHp: number;
  pts: { angle: number; r: number; rTarget: number; speed: number }[];
  rot: number; rotSpeed: number; pulsePhase: number; pulseSpeed: number;
  isBoss: boolean; wobble: number; dead: boolean; deathTimer: number;
  shootTimer: number; shootWarning: number; coinValue: number;
}
interface Bullet { x: number; y: number; vy: number; life: number; len: number; }
interface BossProjectile {
  x: number; y: number; vx: number; vy: number;
  r: number; hue: number; life: number; maxLife: number;
  trail: { x: number; y: number }[];
}
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number; type: "spark"|"ring"|"normal"; }
interface SquishCoin { x: number; y: number; vx: number; vy: number; value: number; life: number; maxLife: number; spin: number; spinSpeed: number; r: number; }
interface FloatText { x: number; y: number; vy: number; text: string; life: number; maxLife: number; color: string; }
interface PowerUp { x: number; y: number; vy: number; type: string; life: number; }

const PALETTE = [
  { h: 127, s: 65, l: 52, coin: 3 }, { h: 263, s: 68, l: 58, coin: 5 },
  { h: 48,  s: 95, l: 58, coin: 2 }, { h: 215, s: 88, l: 62, coin: 4 },
  { h: 0,   s: 78, l: 62, coin: 6 }, { h: 180, s: 80, l: 55, coin: 3 },
];
const PU_ICONS: Record<string, string> = { rapid:"⚡", triple:"✦", shield:"🛡", nuke:"💥", freeze:"❄", score2x:"×2" };
const PU_COLORS: Record<string, string> = { rapid:"#facc15", triple:"#a78bfa", shield:"#60a5fa", nuke:"#f87171", freeze:"#67e8f9", score2x:"#4ade80" };
const PU_TYPES = ["rapid","triple","shield","nuke","freeze","score2x"];

function makeEnemy(W: number, isBoss = false): EnemyBlob {
  const p = PALETTE[Math.floor(Math.random() * PALETTE.length)];
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
      const angle = (i / nPts) * Math.PI * 2, rr = r * (0.75 + Math.random() * 0.5);
      return { angle, r: rr, rTarget: rr, speed: Math.random() * 0.018 + 0.007 };
    }),
    rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * (isBoss ? 0.005 : 0.012),
    pulsePhase: Math.random() * Math.PI * 2, pulseSpeed: isBoss ? 1.2 : 1.5 + Math.random(),
    isBoss, wobble: 0, dead: false, deathTimer: 0,
    shootTimer: isBoss ? 180 + Math.floor(Math.random() * 60) : 0, shootWarning: 0,
    coinValue: isBoss ? 50 : p.coin,
  };
}

function blobPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, pts: { angle: number; r: number }[]) {
  const n = pts.length;
  const c = pts.map(p => ({ x: cx + Math.cos(p.angle) * p.r, y: cy + Math.sin(p.angle) * p.r }));
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const prev = c[(i-1+n)%n], curr = c[i], next = c[(i+1)%n], n2 = c[(i+2)%n];
    if (i===0) ctx.moveTo(curr.x, curr.y);
    ctx.bezierCurveTo(curr.x+(next.x-prev.x)/6, curr.y+(next.y-prev.y)/6, next.x-(n2.x-curr.x)/6, next.y-(n2.y-curr.y)/6, next.x, next.y);
  }
  ctx.closePath();
}

function boom(particles: Particle[], x: number, y: number, hue: number, big: boolean) {
  for (let k=0; k<(big?28:10); k++) {
    const a = Math.random()*Math.PI*2, spd = Math.random()*(big?5:3)+1;
    const tp: Particle["type"] = Math.random()<0.2 ? "spark" : "normal";
    particles.push({ x, y, vx: Math.cos(a)*spd, vy: Math.sin(a)*spd, life: big?80:45, maxLife: big?80:45, size: tp==="spark"?1.5:Math.random()*(big?5:3)+1, hue, type: tp });
  }
  if (big) particles.push({ x, y, vx:0, vy:0, life:30, maxLife:30, size:80, hue, type:"ring" });
}

function dropCoins(coins: SquishCoin[], x: number, y: number, value: number) {
  const count = Math.min(value, 8);
  for (let k=0; k<count; k++) {
    const a = -Math.PI/2 + (Math.random()-0.5)*Math.PI, spd = 1.5 + Math.random()*3;
    coins.push({
      x: x+(Math.random()-0.5)*20, y,
      vx: Math.cos(a)*spd*0.6, vy: Math.sin(a)*spd-2,
      value: Math.ceil(value/count),
      life: 140+Math.random()*40, maxLife: 180,
      spin: Math.random()*Math.PI*2, spinSpeed: (Math.random()-0.5)*0.18+0.1,
      r: value>=50 ? 13 : 8,
    });
  }
}

function drawCoin(ctx: CanvasRenderingContext2D, x: number, y: number, spin: number, r: number) {
  const sx = Math.max(Math.abs(Math.cos(spin)), 0.06);
  ctx.save();
  ctx.translate(x, y);
  // glow
  const gl = ctx.createRadialGradient(0,0,0,0,0,r*2.5);
  gl.addColorStop(0,"rgba(251,191,36,0.35)"); gl.addColorStop(1,"rgba(251,191,36,0)");
  ctx.fillStyle=gl; ctx.beginPath(); ctx.arc(0,0,r*2.5,0,Math.PI*2); ctx.fill();
  ctx.scale(sx, 1);
  // body
  const cg = ctx.createRadialGradient(-r*0.3,-r*0.35,0,0,0,r);
  cg.addColorStop(0,"#fef08a"); cg.addColorStop(0.4,"#fbbf24"); cg.addColorStop(0.8,"#d97706"); cg.addColorStop(1,"#92400e");
  ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#fde68a"; ctx.lineWidth=1.5/sx; ctx.stroke();
  // inner ring
  ctx.strokeStyle="rgba(146,64,14,0.4)"; ctx.lineWidth=0.8/sx;
  ctx.beginPath(); ctx.arc(0,0,r*0.72,0,Math.PI*2); ctx.stroke();
  // symbol
  if (sx > 0.3) {
    ctx.scale(1/sx, 1);
    ctx.fillStyle="#7c2d12"; ctx.font=`bold ${Math.floor(r*0.75)}px monospace`;
    ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("S$",0,0);
  }
  ctx.restore();
}

function cannon(ctx: CanvasRenderingContext2D, x: number, y: number, recoil: number, shield: boolean, dodge: number) {
  ctx.save(); ctx.translate(x+dodge, y);
  if (shield) {
    const sg = ctx.createRadialGradient(0,0,20,0,0,52);
    sg.addColorStop(0,"hsla(215,88%,62%,0.15)"); sg.addColorStop(1,"hsla(215,88%,62%,0)");
    ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(0,0,52,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="hsla(215,88%,72%,0.6)"; ctx.lineWidth=1.5; ctx.setLineDash([4,6]);
    ctx.beginPath(); ctx.arc(0,0,44,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
  }
  const bg=ctx.createLinearGradient(-22,8,22,22);
  bg.addColorStop(0,"#2d4a2d"); bg.addColorStop(0.5,"#3a6e3a"); bg.addColorStop(1,"#1e331e");
  ctx.fillStyle=bg; ctx.beginPath(); ctx.roundRect(-22,8,44,16,6); ctx.fill();
  ctx.strokeStyle="hsla(127,49%,60%,0.5)"; ctx.lineWidth=1; ctx.stroke();
  for (const wx of [-14,14]) {
    ctx.fillStyle="#1a2a1a"; ctx.beginPath(); ctx.arc(wx,22,7,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="hsla(127,49%,50%,0.4)"; ctx.lineWidth=1.5; ctx.stroke();
    ctx.fillStyle="hsla(127,49%,60%,0.3)"; ctx.beginPath(); ctx.arc(wx,22,3,0,Math.PI*2); ctx.fill();
  }
  const bg2=ctx.createLinearGradient(-5,recoil-26,5,recoil-26);
  bg2.addColorStop(0,"#4ade80"); bg2.addColorStop(0.5,"#86efac"); bg2.addColorStop(1,"#22c55e");
  ctx.fillStyle=bg2; ctx.beginPath(); ctx.roundRect(-5,recoil-26,10,26,3); ctx.fill();
  ctx.strokeStyle="hsla(127,60%,70%,0.4)"; ctx.lineWidth=1; ctx.stroke();
  const tg=ctx.createRadialGradient(0,recoil-27,0,0,recoil-27,9);
  tg.addColorStop(0,"hsla(127,90%,70%,0.9)"); tg.addColorStop(1,"hsla(127,80%,60%,0)");
  ctx.fillStyle=tg; ctx.beginPath(); ctx.arc(0,recoil-27,9,0,Math.PI*2); ctx.fill();
  const bd=ctx.createRadialGradient(-4,-2,0,0,2,20);
  bd.addColorStop(0,"#5aec8a"); bd.addColorStop(0.5,"#22c55e"); bd.addColorStop(1,"#14532d");
  ctx.fillStyle=bd; ctx.beginPath(); ctx.arc(0,4,18,Math.PI,0); ctx.lineTo(18,10); ctx.lineTo(-18,10); ctx.closePath(); ctx.fill();
  ctx.strokeStyle="hsla(127,60%,65%,0.5)"; ctx.lineWidth=1.5; ctx.stroke();
  ctx.fillStyle="hsla(215,88%,70%,0.5)"; ctx.beginPath(); ctx.ellipse(0,2,7,5,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d",{alpha:true}); if (!ctx) return;
    let raf: number;
    let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight, t = 0;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const stars: Star[] = Array.from({length:200},()=>({ x:Math.random()*W, y:Math.random()*H, size:Math.random()*1.6+0.2, opacity:Math.random()*0.6+0.2, twinkle:Math.random()*Math.PI*2, twinkleSpeed:Math.random()*2.5+0.5 }));
    const sstars: {x:number;y:number;vx:number;vy:number;life:number;maxLife:number}[] = [];
    const enemies: EnemyBlob[] = [], bullets: Bullet[] = [], bprojs: BossProjectile[] = [];
    const particles: Particle[] = [], powerUps: PowerUp[] = [];
    const squishCoins: SquishCoin[] = [], floatTexts: FloatText[] = [];

    let eTimer=0, bTimer=0, bulletTimer=0, puTimer=0, ssTimer=0;
    let streak=0, streakT=0;
    let recoil=0, dodge=0, dodgeTarget=0, shield=false, shieldT=0;
    let canX=W/2, canTarget=W/2, canTimer=0;
    const CY = () => H-80;

    let balance = parseInt(localStorage.getItem("squish_coin_balance")||"0");
    let balAnim = 0;

    function pickTarget() { canTarget=W*0.1+Math.random()*W*0.8; canTimer=120+Math.random()*180; }
    pickTarget();

    function fire() { bullets.push({x:canX,y:CY()-28+recoil,vy:-14,life:60,len:18}); recoil=5; }

    function bossFire(e: EnemyBlob) {
      for (let k=0;k<3;k++) {
        const dx=(canX-e.x)+(k-1)*60, dy=CY()-e.y, dist=Math.sqrt(dx*dx+dy*dy)||1, spd=3.5+Math.random()*1.5;
        bprojs.push({ x:e.x, y:e.y+e.r, vx:(dx/dist)*spd*0.4+(k-1)*1.5, vy:(dy/dist)*spd, r:9+Math.random()*5, hue:e.hue, life:120, maxLife:120, trail:[] });
      }
      dodgeTarget=(Math.random()-0.5)*60;
    }

    function collectCoin(coin: SquishCoin) {
      balance += coin.value;
      balAnim = 50;
      floatTexts.push({ x:coin.x, y:coin.y, vy:-2, text:`+${coin.value} $SQUISH`, life:65, maxLife:65, color:"#fbbf24" });
      localStorage.setItem("squish_coin_balance", String(balance));
      window.dispatchEvent(new CustomEvent("squish:coins",{detail:{balance}}));
      coin.life = 0;
    }

    function frame() {
      t += 0.016;
      ctx.clearRect(0,0,W,H);

      // Stars
      stars.forEach(s => {
        ctx.globalAlpha = s.opacity*(0.4+0.6*Math.sin(t*s.twinkleSpeed+s.twinkle)*0.5+0.5);
        ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(s.x,s.y,s.size,0,Math.PI*2); ctx.fill();
      });

      // Shooting stars
      ssTimer++; if(ssTimer%160===0&&Math.random()<0.7) { const sp=10+Math.random()*8,ag=Math.PI/4+(Math.random()-0.5)*0.4; sstars.push({x:Math.random()*W,y:Math.random()*H*0.4,vx:Math.cos(ag)*sp,vy:Math.sin(ag)*sp,life:1,maxLife:25+Math.random()*20}); }
      for(let i=sstars.length-1;i>=0;i--){const ss=sstars[i];ss.x+=ss.vx;ss.y+=ss.vy;ss.life--;if(ss.life<=0){sstars.splice(i,1);continue;}const tl=ctx.createLinearGradient(ss.x,ss.y,ss.x-ss.vx*8,ss.y-ss.vy*8);tl.addColorStop(0,"rgba(255,255,255,0.9)");tl.addColorStop(1,"rgba(255,255,255,0)");ctx.globalAlpha=(ss.life/ss.maxLife)*0.75;ctx.strokeStyle=tl;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ss.x,ss.y);ctx.lineTo(ss.x-ss.vx*8,ss.y-ss.vy*8);ctx.stroke();}

      // Spawn
      eTimer++; if(eTimer%90===0&&enemies.length<10) enemies.push(makeEnemy(W));
      bTimer++; if(bTimer%900===0&&!enemies.some(e=>e.isBoss)) enemies.push(makeEnemy(W,true));
      bulletTimer++; if(bulletTimer%18===0) fire();
      puTimer++; if(puTimer%300===0) powerUps.push({x:W*0.1+Math.random()*W*0.8,y:-20,vy:0.8,type:PU_TYPES[Math.floor(Math.random()*PU_TYPES.length)],life:300});

      // Cannon
      canTimer--; if(canTimer<=0) pickTarget();
      canX+=(canTarget-canX)*0.025; recoil*=0.8; dodge+=(dodgeTarget-dodge)*0.08; dodgeTarget*=0.95;
      if(shield){shieldT--;if(shieldT<=0)shield=false;}
      if(balAnim>0) balAnim--;

      // Bullets
      for(let i=bullets.length-1;i>=0;i--){
        const b=bullets[i]; b.y+=b.vy; b.life--;
        if(b.life<=0||b.y<-20){bullets.splice(i,1);continue;}
        let hit=false;
        for(const e of enemies){
          if(e.dead)continue;
          const dx=b.x-e.x,dy=b.y-e.y;
          if(Math.sqrt(dx*dx+dy*dy)<e.r*1.1){
            e.hp--;e.wobble=0.3;
            if(e.hp<=0){
              e.dead=true;e.deathTimer=20;
              boom(particles,e.x,e.y,e.hue,e.isBoss);
              dropCoins(squishCoins,e.x,e.y,e.coinValue);
              streak++;streakT=80;
              if(streak>=2) floatTexts.push({x:e.x,y:e.y-e.r,vy:-1.2,text:streak>=4?"×4 SQUISH!":streak>=3?"×3 CHAIN!":"×2 COMBO!",life:70,maxLife:70,color:streak>=3?"#facc15":"#4ade80"});
            } else boom(particles,b.x,b.y,e.hue,false);
            hit=true;break;
          }
        }
        if(hit){bullets.splice(i,1);continue;}
        const bg=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.len);
        bg.addColorStop(0,"hsla(127,100%,75%,0)");bg.addColorStop(0.3,"hsla(127,90%,65%,0.7)");bg.addColorStop(1,"hsla(127,90%,70%,1)");
        ctx.globalAlpha=0.95;ctx.strokeStyle=bg;ctx.lineWidth=3;ctx.lineCap="round";
        ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x,b.y+b.len);ctx.stroke();
        const bg2=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,8);
        bg2.addColorStop(0,"hsla(127,90%,70%,0.8)");bg2.addColorStop(1,"hsla(127,90%,70%,0)");
        ctx.globalAlpha=0.5;ctx.fillStyle=bg2;ctx.beginPath();ctx.arc(b.x,b.y,8,0,Math.PI*2);ctx.fill();
      }

      // Enemies
      streakT--;if(streakT<=0)streak=0;
      for(let i=enemies.length-1;i>=0;i--){
        const e=enemies[i];
        if(e.dead){e.deathTimer--;if(e.deathTimer<=0){enemies.splice(i,1);continue;}ctx.globalAlpha=e.deathTimer/20*0.5;const dg=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r*2);dg.addColorStop(0,`hsla(${e.hue},${e.sat}%,80%,0.8)`);dg.addColorStop(1,`hsla(${e.hue},${e.sat}%,${e.lit}%,0)`);ctx.fillStyle=dg;ctx.beginPath();ctx.arc(e.x,e.y,e.r*2*(1-e.deathTimer/20),0,Math.PI*2);ctx.fill();continue;}
        e.x+=e.vx;e.y+=e.vy;e.rot+=e.rotSpeed;e.wobble*=0.9;
        if(e.x<e.r){e.x=e.r;e.vx=Math.abs(e.vx);}
        if(e.x>W-e.r){e.x=W-e.r;e.vx=-Math.abs(e.vx);}
        if(e.y>H+e.r*2){enemies.splice(i,1);continue;}

        // Coin value badge
        ctx.globalAlpha=0.65;ctx.fillStyle="#fbbf24";ctx.font="bold 9px monospace";
        ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(`${e.coinValue}S$`,e.x,e.y+e.r+11);

        // Boss shoot
        if(e.isBoss&&e.y>80){
          e.shootTimer--;
          if(e.shootTimer<=30&&e.shootWarning===0)e.shootWarning=30;
          if(e.shootWarning>0){e.shootWarning--;const wf=1-e.shootWarning/30;ctx.globalAlpha=(1-wf)*0.7;ctx.strokeStyle=`hsl(${e.hue},90%,65%)`;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(e.x,e.y,e.r+wf*40,0,Math.PI*2);ctx.stroke();}
          if(e.shootTimer<=0){bossFire(e);e.shootTimer=220+Math.floor(Math.random()*80);e.shootWarning=0;}
        }

        e.pts.forEach(pt=>{pt.r+=(pt.rTarget-pt.r)*pt.speed;if(Math.abs(pt.r-pt.rTarget)<1)pt.rTarget=e.r*(0.7+Math.random()*0.6);});
        const pulse=1+(0.06+e.wobble)*Math.sin(t*e.pulseSpeed+e.pulsePhase);
        const rpts=e.pts.map(pt=>({angle:pt.angle+e.rot,r:pt.r*pulse}));

        if(e.isBoss){const bw=e.r*2.5,bx=e.x-bw/2,by=e.y-e.r-18;ctx.globalAlpha=0.8;ctx.fillStyle="rgba(0,0,0,0.5)";ctx.beginPath();ctx.roundRect(bx,by,bw,6,3);ctx.fill();ctx.fillStyle=`hsl(${e.hue},${e.sat}%,${e.lit}%)`;ctx.beginPath();ctx.roundRect(bx,by,bw*(e.hp/e.maxHp),6,3);ctx.fill();}

        const glR=e.r*(e.isBoss?2.8:2.2);
        const gg=ctx.createRadialGradient(e.x,e.y,e.r*0.1,e.x,e.y,glR);
        gg.addColorStop(0,`hsla(${e.hue},${e.sat}%,${e.lit}%,${e.isBoss?0.22:0.15})`);gg.addColorStop(1,`hsla(${e.hue},${e.sat}%,${e.lit}%,0)`);
        ctx.globalAlpha=1;ctx.fillStyle=gg;ctx.beginPath();ctx.arc(e.x,e.y,glR,0,Math.PI*2);ctx.fill();

        ctx.save();blobPath(ctx,e.x,e.y,rpts);ctx.clip();
        const bg3=ctx.createRadialGradient(e.x-e.r*0.3,e.y-e.r*0.3,0,e.x,e.y,e.r*1.2);
        bg3.addColorStop(0,`hsla(${e.hue},${e.sat}%,${Math.min(e.lit+25,88)}%,1)`);bg3.addColorStop(0.45,`hsla(${e.hue},${e.sat}%,${e.lit}%,1)`);bg3.addColorStop(1,`hsla(${e.hue},${e.sat-8}%,${Math.max(e.lit-18,12)}%,1)`);
        ctx.globalAlpha=e.isBoss?0.88:0.78;ctx.fillStyle=bg3;ctx.fillRect(e.x-glR,e.y-glR,glR*2,glR*2);
        const sg=ctx.createRadialGradient(e.x-e.r*0.3,e.y-e.r*0.35,0,e.x-e.r*0.1,e.y-e.r*0.1,e.r*0.55);
        sg.addColorStop(0,"rgba(255,255,255,0.45)");sg.addColorStop(1,"rgba(255,255,255,0)");
        ctx.globalAlpha=0.9;ctx.fillStyle=sg;ctx.fillRect(e.x-glR,e.y-glR,glR*2,glR*2);
        ctx.globalAlpha=0.4;ctx.strokeStyle=`hsla(${e.hue},${e.sat}%,${Math.min(e.lit+30,92)}%,0.7)`;ctx.lineWidth=e.isBoss?3:1.5;ctx.stroke();ctx.restore();

        const eyeR=e.r*0.12;ctx.globalAlpha=0.9;ctx.fillStyle="rgba(0,0,0,0.7)";
        for(const ex of[-e.r*0.28,e.r*0.28]){ctx.beginPath();ctx.arc(e.x+ex,e.y-e.r*0.1,eyeR,0,Math.PI*2);ctx.fill();}
        ctx.fillStyle="#fff";for(const ex of[-e.r*0.28,e.r*0.28]){ctx.beginPath();ctx.arc(e.x+ex-e.r*0.03,e.y-e.r*0.14,eyeR*0.35,0,Math.PI*2);ctx.fill();}
        if(e.isBoss){ctx.strokeStyle="rgba(0,0,0,0.7)";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(e.x-e.r*0.4,e.y-e.r*0.28);ctx.lineTo(e.x-e.r*0.18,e.y-e.r*0.22);ctx.moveTo(e.x+e.r*0.18,e.y-e.r*0.22);ctx.lineTo(e.x+e.r*0.4,e.y-e.r*0.28);ctx.stroke();}
      }

      // Boss projectiles
      for(let i=bprojs.length-1;i>=0;i--){
        const bp=bprojs[i];bp.trail.push({x:bp.x,y:bp.y});if(bp.trail.length>14)bp.trail.shift();
        bp.x+=bp.vx;bp.y+=bp.vy;bp.life--;
        if(bp.life<=0||bp.y>H+20){bprojs.splice(i,1);continue;}
        if(bp.y>CY()-40&&bp.y<CY()+20&&Math.abs(bp.x-(canX+dodge))<35){boom(particles,bp.x,bp.y,bp.hue,false);dodgeTarget=(Math.random()-0.5)*80;bprojs.splice(i,1);continue;}
        const f=bp.life/bp.maxLife;
        bp.trail.forEach((pt,ti)=>{ctx.globalAlpha=(ti/bp.trail.length)*f*0.4;ctx.fillStyle=`hsl(${bp.hue},90%,65%)`;ctx.beginPath();ctx.arc(pt.x,pt.y,bp.r*(ti/bp.trail.length)*0.6,0,Math.PI*2);ctx.fill();});
        ctx.globalAlpha=f;const pg=ctx.createRadialGradient(bp.x,bp.y,0,bp.x,bp.y,bp.r*2.5);pg.addColorStop(0,`hsla(${bp.hue},90%,70%,0.6)`);pg.addColorStop(1,`hsla(${bp.hue},80%,55%,0)`);ctx.fillStyle=pg;ctx.beginPath();ctx.arc(bp.x,bp.y,bp.r*2.5,0,Math.PI*2);ctx.fill();
        const og=ctx.createRadialGradient(bp.x-bp.r*0.3,bp.y-bp.r*0.3,0,bp.x,bp.y,bp.r);og.addColorStop(0,`hsla(${bp.hue},100%,85%,1)`);og.addColorStop(1,`hsla(${bp.hue},80%,35%,1)`);
        ctx.globalAlpha=f*0.95;ctx.fillStyle=og;ctx.beginPath();ctx.arc(bp.x,bp.y,bp.r,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=f*0.5;ctx.strokeStyle=`hsl(${bp.hue},100%,75%)`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(bp.x,bp.y,bp.r*(1+0.3*Math.sin(t*12+i)),0,Math.PI*2);ctx.stroke();
      }

      // $SQUISH Coins
      for(let i=squishCoins.length-1;i>=0;i--){
        const c2=squishCoins[i];c2.vx*=0.97;c2.vy+=0.08;c2.x+=c2.vx;c2.y+=c2.vy;c2.spin+=c2.spinSpeed;c2.life--;
        if(c2.life<=0||c2.y>H+30){squishCoins.splice(i,1);continue;}
        const dx=c2.x-(canX+dodge),dy=c2.y-CY();
        if(Math.sqrt(dx*dx+dy*dy)<55){collectCoin(c2);squishCoins.splice(i,1);continue;}
        ctx.globalAlpha=(c2.life/c2.maxLife)*0.92;
        drawCoin(ctx,c2.x,c2.y,c2.spin,c2.r);
      }

      // Power-ups
      for(let i=powerUps.length-1;i>=0;i--){
        const pu=powerUps[i];pu.y+=pu.vy;pu.life--;
        if(pu.life<=0||pu.y>H+30){powerUps.splice(i,1);continue;}
        const dx=pu.x-canX,dy=pu.y-CY();if(Math.sqrt(dx*dx+dy*dy)<32){if(pu.type==="shield"){shield=true;shieldT=240;}powerUps.splice(i,1);boom(particles,pu.x,pu.y,127,false);continue;}
        const col=PU_COLORS[pu.type]||"#fff",icon=PU_ICONS[pu.type]||"?",bob=Math.sin(t*3+i)*4,frac=pu.life/300;
        ctx.globalAlpha=0.6;const ppg=ctx.createRadialGradient(pu.x,pu.y+bob,0,pu.x,pu.y+bob,22);ppg.addColorStop(0,col+"55");ppg.addColorStop(1,col+"00");ctx.fillStyle=ppg;ctx.beginPath();ctx.arc(pu.x,pu.y+bob,22,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=0.85*frac;ctx.fillStyle="rgba(10,20,10,0.8)";ctx.beginPath();ctx.roundRect(pu.x-14,pu.y+bob-14,28,28,8);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.stroke();
        ctx.globalAlpha=frac;ctx.fillStyle=col;ctx.font=`bold ${pu.type==="score2x"?11:14}px monospace`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(icon,pu.x,pu.y+bob);
      }

      // Particles
      for(let i=particles.length-1;i>=0;i--){
        const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.06;p.vx*=0.97;p.life--;
        if(p.life<=0){particles.splice(i,1);continue;}
        const f=p.life/p.maxLife;
        if(p.type==="ring"){ctx.globalAlpha=f*0.6;ctx.strokeStyle=`hsl(${p.hue},80%,65%)`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.size*(1-f)*2,0,Math.PI*2);ctx.stroke();}
        else if(p.type==="spark"){ctx.globalAlpha=f*0.9;ctx.strokeStyle=`hsl(${p.hue},100%,82%)`;ctx.lineWidth=1.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*4,p.y-p.vy*4);ctx.stroke();}
        else{ctx.globalAlpha=f*0.8;ctx.fillStyle=`hsl(${p.hue},80%,68%)`;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(p.size*f,0.5),0,Math.PI*2);ctx.fill();}
      }

      // Cannon draw
      ctx.globalAlpha=1;
      cannon(ctx,canX,CY(),recoil,shield,dodge);

      // Float texts (combo + coins)
      for(let i=floatTexts.length-1;i>=0;i--){
        const ft=floatTexts[i];ft.y+=ft.vy;ft.life--;
        if(ft.life<=0){floatTexts.splice(i,1);continue;}
        ctx.globalAlpha=ft.life/ft.maxLife;ctx.fillStyle=ft.color;
        ctx.font="bold 11px monospace";ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(ft.text,ft.x,ft.y);
      }

      // HUD — $SQUISH balance
      if(balance>0||balAnim>0){
        const pulse=balAnim>0?1+(balAnim/50)*0.25:1;
        ctx.globalAlpha=0.8;ctx.save();ctx.translate(W-16,H-20);ctx.scale(pulse,pulse);ctx.translate(-(W-16),-(H-20));
        ctx.fillStyle="#fbbf24";ctx.font="bold 11px monospace";ctx.textAlign="right";ctx.textBaseline="middle";
        ctx.fillText(`⊕ ${balance.toLocaleString()} $SQUISH`,W-16,H-20);ctx.restore();
      }

      ctx.globalAlpha=1;ctx.textAlign="left";
      raf=requestAnimationFrame(frame);
    }

    raf=requestAnimationFrame(frame);
    return()=>{window.removeEventListener("resize",onResize);cancelAnimationFrame(raf);localStorage.setItem("squish_coin_balance",String(balance));};
  },[]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{mixBlendMode:"screen",opacity:0.9}} />;
}
