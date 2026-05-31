import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

// ── Phase 0: Spinning 3D coin ──────────────────────────────────────────────
function CoinAnim() {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
      {/* Outer glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.45) 0%, transparent 70%)" }}
        animate={{ scale: [0.7, 1.25, 0.7], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Coin body — scaleX trick for 3D spin */}
      <motion.div
        className="relative w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-[11px] select-none"
        style={{
          background: "radial-gradient(circle at 33% 30%, #fef9c3, #fbbf24 38%, #d97706 72%, #92400e 100%)",
          boxShadow: "0 0 10px 2px rgba(251,191,36,0.4), inset 0 -3px 6px rgba(120,53,15,0.5)",
          color: "#7c2d12",
          transformOrigin: "center",
        }}
        animate={{ scaleX: [1, 0.08, -1, -0.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
      >
        S$
      </motion.div>
      {/* Rim shadow */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full"
        style={{ background: "rgba(0,0,0,0.25)", filter: "blur(3px)" }} />
    </div>
  );
}

// ── Phase 1: Mini blob shooter ─────────────────────────────────────────────
function ArcadeAnim() {
  const [step, setStep] = useState<"idle"|"falling"|"hit"|"explode">("idle");
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setStep("falling");
      t = setTimeout(() => setStep("hit"), 900);
      t = setTimeout(() => setStep("explode"), 1050);
      t = setTimeout(() => { setStep("idle"); t = setTimeout(cycle, 400); }, 1350);
    };
    t = setTimeout(cycle, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden">
      {/* Blob */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: "radial-gradient(circle at 35% 30%, #86efac, #22c55e 45%, #15803d)", boxShadow: "0 0 8px rgba(34,197,94,0.6)" }}
        animate={
          step === "idle"    ? { y: -28, opacity: 0, scale: 0.8 }  :
          step === "falling" ? { y: 4,   opacity: 1, scale: 1 }    :
          step === "hit"     ? { y: 4,   opacity: 1, scale: 1.25 } :
                               { y: 4,   opacity: 0, scale: 2.2 }
        }
        transition={{ duration: step === "falling" ? 0.85 : 0.15, ease: "easeIn" }}
      >
        {/* Eyes */}
        <div className="flex gap-1 mt-0.5">
          <div className="w-1 h-1 rounded-full bg-black/70" />
          <div className="w-1 h-1 rounded-full bg-black/70" />
        </div>
      </motion.div>

      {/* Bullet */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-1 h-3 rounded-full"
        style={{ background: "linear-gradient(to top, rgba(74,222,128,0), #4ade80)", bottom: 6 }}
        animate={
          step === "idle"    ? { y: 0,   opacity: 0 } :
          step === "falling" ? { y: -38, opacity: [0,1,1] } :
                               { y: -38, opacity: 0 }
        }
        transition={{ duration: step === "falling" ? 0.7 : 0.1, ease: "easeOut", delay: step === "falling" ? 0.15 : 0 }}
      />

      {/* Explosion sparks */}
      {step === "explode" && [0,60,120,180,240,300].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-yellow-300"
          style={{ left: "50%", top: "40%", transformOrigin: "center" }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(deg*Math.PI/180)*18, y: Math.sin(deg*Math.PI/180)*18, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      ))}

      {/* Cannon base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-2 rounded-sm"
        style={{ background: "linear-gradient(to right, #166534, #4ade80, #166534)" }} />
    </div>
  );
}

// ── Phase 2: Radar sweep ───────────────────────────────────────────────────
function RadarAnim() {
  const DOTS = [
    { r: 28, a: 40 }, { r: 18, a: 130 }, { r: 24, a: 260 },
  ];
  return (
    <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
      {/* Screen */}
      <div className="absolute inset-1 rounded-full border border-purple-400/30"
        style={{ background: "radial-gradient(circle, rgba(147,51,234,0.12) 0%, rgba(88,28,135,0.06) 100%)" }} />
      {/* Grid rings */}
      {[0.35, 0.65, 1].map((s, i) => (
        <div key={i} className="absolute rounded-full border border-purple-400/15"
          style={{ width: `${s*100}%`, height: `${s*100}%` }} />
      ))}
      {/* Cross hairs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-px bg-purple-400/12" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-full w-px bg-purple-400/12" />
      </div>

      {/* Sweep */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "conic-gradient(from 180deg, rgba(168,85,247,0) 0deg, rgba(168,85,247,0.18) 35deg, rgba(168,85,247,0.55) 50deg, rgba(168,85,247,0) 60deg)",
          }}
        />
        {/* Leading edge line */}
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
          style={{ background: "linear-gradient(to right, rgba(192,132,252,0.9), rgba(192,132,252,0))" }}
        />
      </motion.div>

      {/* Blinking dots */}
      {DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-300"
          style={{
            left: `calc(50% + ${Math.cos(dot.a*Math.PI/180)*dot.r/2}px)`,
            top:  `calc(50% + ${Math.sin(dot.a*Math.PI/180)*dot.r/2}px)`,
            boxShadow: "0 0 4px rgba(192,132,252,0.9)",
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
        />
      ))}

      {/* Center dot */}
      <div className="w-1 h-1 rounded-full bg-purple-400/80 relative z-10"
        style={{ boxShadow: "0 0 5px rgba(168,85,247,0.8)" }} />
    </div>
  );
}

// ── Phase 3: Floating coin stack ───────────────────────────────────────────
function TokenAnim() {
  return (
    <div className="relative w-14 h-14 flex-shrink-0 flex items-end justify-center pb-1">
      {/* Glow base */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full"
        style={{ background: "rgba(96,165,250,0.25)", filter: "blur(4px)" }}
        animate={{ scaleX: [0.7, 1.1, 0.7], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* 3 stacked coins */}
      {[2, 1, 0].map((layer) => (
        <motion.div
          key={layer}
          className="absolute flex items-center justify-center"
          style={{
            width: `${32 - layer*3}px`,
            height: `${32 - layer*3}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle at 33% 30%, ${layer===0?"#fef9c3, #fbbf24 38%, #d97706":"#fde68a, #f59e0b 38%, #b45309"} 100%)`,
            boxShadow: `0 ${4+layer*2}px ${8+layer*3}px rgba(0,0,0,0.3), 0 0 ${6+layer*3}px rgba(96,165,250,${0.3-layer*0.08})`,
            bottom: `${layer*7}px`,
            zIndex: 3 - layer,
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: layer * 0.15 }}
        >
          {layer === 0 && (
            <span className="font-mono font-bold text-[9px] text-yellow-900 select-none">S$</span>
          )}
        </motion.div>
      ))}
      {/* Expanding ring */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-blue-400/40"
        animate={{ width: [8, 44, 8], height: [8, 44, 8], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        style={{ translateX: "-50%" }}
      />
    </div>
  );
}

// ── Phase data ────────────────────────────────────────────────────────────
const PHASES = [
  {
    id: "genesis", label: "PHASE 0", title: "Genesis Mining",
    status: "LIVE" as const, date: "May 2026", hsl: "127,65%,52%",
    Anim: CoinAnim,
    description: "The foundation. Every enemy type defeated generates $SQUISH coins with a unique yield. Balance persists locally and broadcasts cross-component.",
    items: [
      "Unique coin yield per blob type — Green: 3, Purple: 5, Yellow: 2, Blue: 4, Red: 6, Cyan: 3",
      "Boss encounters drop 50 $SQUISH per kill",
      "Spinning 3D coin with proximity auto-collect and physics",
      "Persistent balance via localStorage + squish:coins event dispatch",
      "Per-enemy coin badge displayed on each character during animation",
    ],
  },
  {
    id: "arcade", label: "PHASE 1", title: "Squish Arcade",
    status: "BUILDING" as const, date: "Q3 2026", hsl: "48,95%,58%",
    Anim: ArcadeAnim,
    description: "The hero animation evolves into a full playable game. $SQUISH earned per session is scored, signed, and prepared for on-chain anchoring.",
    items: [
      "Full playable game — difficulty waves, combo system, lives",
      "Session-based $SQUISH ledger with global leaderboard",
      "Boss-tier multipliers: 2× standard through 10× elite",
      "Power-up economy: spend $SQUISH to unlock upgrades mid-session",
      "Off-chain signed session receipts ready for on-chain bridge",
    ],
  },
  {
    id: "agent-mining", label: "PHASE 2", title: "AI Agent Mining",
    status: "PLANNED" as const, date: "Q4 2026", hsl: "263,68%,58%",
    Anim: RadarAnim,
    description: "AI agents are deployed into the Squish universe. Each agent autonomously hunts enemies, accumulates $SQUISH, and reports yields — mining while you sleep.",
    items: [
      "Agent archetypes: Aggressive, Sniper, Tank, Collector — each with distinct yield curves",
      "Mining rate dynamically determined by agent precision and session score",
      "Multi-agent parallel deployment — scale your mining fleet",
      "Agent upgrade system funded by earned $SQUISH",
      "Real-time per-agent yield dashboard with historical chart",
    ],
  },
  {
    id: "token", label: "PHASE 3", title: "$SQUISH Token",
    status: "PLANNED" as const, date: "2027", hsl: "215,88%,62%",
    Anim: TokenAnim,
    description: "$SQUISH transitions from in-game currency to a live token. All accumulated balances are fully claimable. Agent mining becomes real-yield DeFi.",
    items: [
      "Token genesis: 1:1 redemption for all mined $SQUISH balances",
      "Staking pools backed by game revenue distribution",
      "Agent-as-a-service marketplace — rent or lease mining agents",
      "DAO governance: token holders vote on game parameter changes",
      "Cross-game $SQUISH interoperability across partner titles",
    ],
  },
];

const STATUS_CONFIG = {
  LIVE:     { label: "LIVE",     bg: "bg-primary/15",    border: "border-primary/40",    text: "text-primary",          dot: "bg-primary"     },
  BUILDING: { label: "BUILDING", bg: "bg-yellow-400/10", border: "border-yellow-400/30", text: "text-yellow-400",        dot: "bg-yellow-400"  },
  PLANNED:  { label: "PLANNED",  bg: "bg-white/5",       border: "border-white/15",      text: "text-muted-foreground", dot: "bg-white/30"    },
};

export default function Roadmap() {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    setBalance(parseInt(localStorage.getItem("squish_coin_balance") || "0"));
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.balance !== undefined) setBalance(detail.balance);
    };
    window.addEventListener("squish:coins", handler);
    return () => window.removeEventListener("squish:coins", handler);
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="font-mono text-xs text-primary/60 tracking-widest mb-3">SQUISHEM.FUN</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-4">Roadmap</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
            From a visual coin animation to a self-sustaining AI mining economy.
            Each phase builds on the last — no resets, no forks.
          </p>
          {balance > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-lg border border-yellow-400/20 bg-yellow-400/8"
            >
              <span className="text-yellow-400 text-base">⊕</span>
              <span className="font-mono text-xs text-yellow-400">
                Your balance: <span className="font-bold">{balance.toLocaleString()} $SQUISH</span> mined
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-0 w-px bg-white/8" />
          <div className="space-y-14">
            {PHASES.map(({ id, label, title, status, date, hsl, Anim, description, items }, i) => {
              const cfg = STATUS_CONFIG[status];
              const isLive = status === "LIVE";
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="relative pl-9"
                >
                  {/* Node */}
                  <div className="absolute left-0 top-1">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isLive ? "border-primary bg-primary/20" : "border-white/15 bg-white/5"}`}>
                      {isLive && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`rounded-xl border p-5 transition-all ${isLive ? "border-primary/20 bg-primary/5" : "border-white/8 bg-white/3"}`}>
                    {/* Top row: meta + animation */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[10px] tracking-widest text-muted-foreground/50 block mb-1">{label}</span>
                        <h2 className="font-display font-bold text-lg text-white leading-tight">{title}</h2>
                      </div>
                      {/* Mini animation — right side */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono tracking-wide ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isLive ? "animate-pulse" : ""}`} />
                            {cfg.label}
                          </span>
                        </div>
                        <Anim />
                        <span className="font-mono text-[10px] text-muted-foreground/40">{date}</span>
                      </div>
                    </div>

                    {/* Accent divider */}
                    <div className="h-px mb-4" style={{ background: `linear-gradient(to right, hsl(${hsl},0.35), transparent)` }} />

                    <p className="text-xs text-muted-foreground/70 leading-relaxed mb-4">{description}</p>

                    <ul className="space-y-2">
                      {items.map((item, k) => (
                        <li key={k} className="flex items-start gap-2.5">
                          <span className="flex-shrink-0 mt-[3px]" style={{ color: `hsl(${hsl})`, opacity: 0.7 }}>▸</span>
                          <span className="text-[11px] text-muted-foreground/65 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-16 pt-6 border-t border-white/5"
        >
          <p className="font-mono text-[10px] text-muted-foreground/30 leading-relaxed">
            Roadmap is directional — phases may shift based on technical progress and community signals.
            All $SQUISH mined in Phase 0 will carry forward to Phase 3 at 1:1.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
