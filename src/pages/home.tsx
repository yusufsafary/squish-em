import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { HeroCanvas } from "@/components/hero-canvas";
import { Link } from "wouter";
import { useState, useCallback, useRef, useEffect } from "react";

function useGameSound() {
  const [muted, setMuted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctxRef.current;
  };
  const playShoot = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
  }, [muted]);
  const playClick = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1);
  }, [muted]);
  return { muted, setMuted, playShoot, playClick };
}

function GlitchTitle() {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 140);
    }, 3800 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div className="relative mb-5 select-none"
      initial={{ opacity: 0, y: 36, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
      <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tight glow-text-green relative z-10">
        SQUISH&nbsp;'EM!
      </h1>
      {glitch && (<>
        <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight absolute inset-0 z-20 pointer-events-none"
          style={{ color: "#0ff", clipPath: "inset(22% 0 58% 0)", transform: "translateX(-3px)", opacity: 0.65 }}>SQUISH&nbsp;'EM!</h1>
        <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight absolute inset-0 z-20 pointer-events-none"
          style={{ color: "#f0f", clipPath: "inset(58% 0 8% 0)", transform: "translateX(3px)", opacity: 0.65 }}>SQUISH&nbsp;'EM!</h1>
      </>)}
    </motion.div>
  );
}

function BlobCounter() {
  const [count, setCount] = useState(0);
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    const stored = parseInt(localStorage.getItem("squish_total_blobs") || "0");
    setCount(stored);
    const onKill = (e: Event) => {
      const kills = (e as CustomEvent).detail?.kills ?? 1;
      setCount(prev => { const next = prev + kills; localStorage.setItem("squish_total_blobs", String(next)); return next; });
      setAnimating(true); setTimeout(() => setAnimating(false), 400);
    };
    window.addEventListener("squish:kill", onKill);
    return () => window.removeEventListener("squish:kill", onKill);
  }, []);
  if (count === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/8 backdrop-blur-sm"
    >
      <motion.span animate={animating ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}} transition={{ duration: 0.35 }} className="text-base">💥</motion.span>
      <span className="font-mono text-xs text-primary/80">YOU'VE SQUISHED{" "}
        <motion.span key={count} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-bold text-primary">
          {count.toLocaleString()}
        </motion.span>{" "}BLOB{count !== 1 ? "S" : ""}
      </span>
    </motion.div>
  );
}

// ── $SQUISH Contract Address Card ──────────────────────────────────────────
const CA = "314yiE7VgKbBozCpAqyGaLk8EZzKdzDShtwzAyRBqory";

function SquishTokenCA() {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  const handleCopy = () => {
    if (CA === "TBA") return;
    navigator.clipboard.writeText(CA).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isLive = CA !== "TBA";
  const displayCA = isLive ? CA : "Launching Q3 2026 · Solana Mainnet";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.78, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="w-full max-w-md mx-auto mt-5"
    >
      {/* Outer glow ring */}
      <div className="relative rounded-2xl p-px overflow-hidden"
        style={{
          background: hover
            ? "linear-gradient(135deg, rgba(168,85,247,0.7) 0%, rgba(103,232,249,0.6) 50%, rgba(34,197,94,0.5) 100%)"
            : "linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(103,232,249,0.25) 50%, rgba(34,197,94,0.2) 100%)",
          transition: "background 0.4s ease",
        }}>
        <div className="relative rounded-2xl bg-[#080812] px-5 py-4 overflow-hidden">

          {/* Ambient background shimmer */}
          <motion.div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            animate={{ backgroundPosition: hover ? "200% 50%" : "0% 50%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(103,232,249,0.5), transparent)",
              backgroundSize: "200% 100%",
            }}
          />

          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {/* Solana diamond icon */}
              <div className="relative w-8 h-8 flex-shrink-0">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "radial-gradient(circle, rgba(168,85,247,0.6), rgba(103,232,249,0.3))" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                    <path d="M6 21.5h17.5a1 1 0 0 1 .7.3l2.5 2.5a1 1 0 0 1-.7 1.7H8.5a1 1 0 0 1-.7-.3L5.3 23.2A1 1 0 0 1 6 21.5Z" fill="url(#g1)"/>
                    <path d="M6 13.5h17.5a1 1 0 0 1 .7.3l2.5 2.5a1 1 0 0 1-.7 1.7H8.5a1 1 0 0 1-.7-.3L5.3 15.2A1 1 0 0 1 6 13.5Z" fill="url(#g2)"/>
                    <path d="M26 5.5H8.5a1 1 0 0 0-.7.3L5.3 8.3A1 1 0 0 0 6 10h17.5a1 1 0 0 0 .7-.3l2.5-2.5A1 1 0 0 0 26 5.5Z" fill="url(#g3)"/>
                    <defs>
                      <linearGradient id="g1" x1="5" y1="24" x2="27" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#9945FF"/><stop offset="1" stopColor="#14F195"/></linearGradient>
                      <linearGradient id="g2" x1="5" y1="16" x2="27" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#9945FF"/><stop offset="1" stopColor="#14F195"/></linearGradient>
                      <linearGradient id="g3" x1="5" y1="7.75" x2="27" y2="7.75" gradientUnits="userSpaceOnUse"><stop stopColor="#9945FF"/><stop offset="1" stopColor="#14F195"/></linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div>
                <div className="font-display font-black text-white text-sm tracking-widest">$SQUISH</div>
                <div className="font-mono text-[9px] text-white/35 tracking-wider">SPL TOKEN · SOLANA</div>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
              style={{
                borderColor: isLive ? "rgba(34,197,94,0.4)" : "rgba(168,85,247,0.35)",
                background: isLive ? "rgba(34,197,94,0.08)" : "rgba(168,85,247,0.08)",
              }}>
              <motion.span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                animate={{ opacity: [1, 0.25, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ background: isLive ? "#22c55e" : "#a855f7" }}
              />
              <span className="font-mono text-[9px] font-bold tracking-widest"
                style={{ color: isLive ? "#22c55e" : "#a855f7" }}>
                {isLive ? "LIVE" : "SOON"}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-3" />

          {/* CA row */}
          <div className="mb-3">
            <div className="font-mono text-[9px] text-white/30 tracking-widest mb-1.5">CONTRACT ADDRESS</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 font-mono text-[11px] rounded-lg px-3 py-2 border border-white/6 bg-white/[0.03]"
                style={{ color: isLive ? "rgba(103,232,249,0.9)" : "rgba(168,85,247,0.6)" }}>
                <span className="block truncate">{displayCA}</span>
              </div>
              <motion.button
                onClick={handleCopy}
                whileTap={isLive ? { scale: 0.93 } : {}}
                className="flex-shrink-0 px-3 py-2 rounded-lg border font-mono text-[10px] tracking-widest transition-all"
                style={{
                  borderColor: copied ? "rgba(34,197,94,0.5)" : isLive ? "rgba(103,232,249,0.3)" : "rgba(255,255,255,0.08)",
                  background: copied ? "rgba(34,197,94,0.1)" : isLive ? "rgba(103,232,249,0.07)" : "rgba(255,255,255,0.03)",
                  color: copied ? "#22c55e" : isLive ? "rgba(103,232,249,0.8)" : "rgba(255,255,255,0.2)",
                  cursor: isLive ? "pointer" : "default",
                }}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span key="ok" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>✓ OK</motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {isLive ? "COPY" : "TBA"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "SUPPLY", value: "1B" },
              { label: "NETWORK", value: "Solana" },
              { label: "EARN BY", value: "Playing" },
            ].map(stat => (
              <div key={stat.label} className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-2 text-center">
                <div className="font-mono text-[8px] text-white/25 tracking-widest mb-0.5">{stat.label}</div>
                <div className="font-mono text-[11px] font-bold text-white/60">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Buy button — visible only when live */}
          {isLive && (
            <>
              <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mt-3 mb-2.5" />
              <motion.a
                href={`https://jup.ag/swap/SOL-${CA}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.018 }}
                whileTap={{ scale: 0.975 }}
                className="relative w-full flex items-center justify-center gap-2 rounded-xl overflow-hidden py-2.5 font-display font-bold text-[12px] tracking-[0.18em] text-white select-none"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(103,232,249,0.12) 50%, rgba(20,241,149,0.16) 100%)",
                  border: "1px solid rgba(103,232,249,0.22)",
                }}
              >
                {/* Shimmer */}
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  animate={{ x: ["-100%", "220%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.055), transparent)", width: "55%" }}
                />
                {/* Jupiter icon */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke="rgba(103,232,249,0.75)" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8l4 4-4 4" />
                </svg>
                <span style={{ background: "linear-gradient(90deg, #a855f7, #67e8f9, #14f195)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  BUY $SQUISH ON JUPITER
                </span>
                {/* External arrow */}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke="rgba(103,232,249,0.45)" className="flex-shrink-0">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </motion.a>
            </>
          )}

          {/* Footer — share + roadmap */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* X / Twitter */}
              <motion.a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("🎮 SQUISH 'EM! $SQUISH is LIVE on Solana!\n\nPlay & earn — no install needed.\nCA: " + CA + "\n\nhttps://squishem.fun")}`}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-white/8 bg-white/[0.02] hover:border-white/18 hover:bg-white/[0.05] transition-all"
                title="Share on X"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="rgba(255,255,255,0.38)"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span className="font-mono text-[8px] text-white/28 tracking-widest">SHARE</span>
              </motion.a>
              {/* Telegram */}
              <motion.a
                href={`https://t.me/share/url?url=https://squishem.fun&text=${encodeURIComponent("🎮 $SQUISH is LIVE on Solana!\nPlay SQUISH 'EM & earn tokens — no install.\n\nCA: " + CA)}`}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-white/8 bg-white/[0.02] hover:border-cyan-400/20 hover:bg-cyan-400/[0.04] transition-all"
                title="Share on Telegram"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="rgba(103,232,249,0.42)"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.46 14.02l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.693.54z"/></svg>
                <span className="font-mono text-[8px] text-white/28 tracking-widest">TG</span>
              </motion.a>
            </div>
            <Link href="/roadmap"
              className="font-mono text-[9px] text-purple-400/60 hover:text-purple-300 transition-colors tracking-widest">
              ROADMAP →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const MARQUEE_ITEMS = [
  "SHOOT BLOBS", "CHAIN COMBOS", "SURVIVE BOSSES", "RACK UP POINTS",
  "COLLECT POWER-UPS", "EARN $SQUISH", "SQUISH 'EM ALL",
  "NO INSTALL", "PURE ARCADE", "INFINITE LEVELS", "CRYSTAL BLOBS", "NINJA BLOBS",
  "$SQUISH NOW LIVE", "BUY ON JUPITER", "SOLANA MAINNET", "1B SUPPLY", "EARN BY PLAYING",
];

function MarqueeTicker() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden py-2.5 border-y border-primary/15 bg-primary/[0.04]">
      <div className="absolute inset-y-0 left-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />
      <div className="flex gap-8 whitespace-nowrap" style={{ animation: "marquee 32s linear infinite", width: "max-content" }}>
        {items.map((item, i) => (
          <span key={i} className="font-display font-bold text-[11px] tracking-widest text-primary/60 flex items-center gap-4">
            {item}<span className="text-primary/20">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Mini AI Agent Simulator ─────────────────────────────────────────────────
type Strategy = "greedy" | "combo" | "dqn";
type ActionId = 0 | 1 | 2 | 3;
interface Blob { id: number; x: number; y: number; vx: number; vy: number; hp: number; type: string; }
interface GS { cannonX: number; blobs: Blob[]; bulletActive: boolean; bulletX: number; bulletY: number; comboMultiplier: number; score: number; }
interface Particle { id: number; x: number; y: number; vx: number; vy: number; color: string; life: number; }
const BLOB_COLORS: Record<string, string> = { green: "#22c55e", purple: "#a855f7", yellow: "#eab308", blue: "#3b82f6", red: "#ef4444" };
const ACTION_LABELS = ["MOVE_LEFT", "MOVE_RIGHT", "SHOOT", "WAIT"];
const ACTION_COLORS = ["#3b82f6", "#a855f7", "#22c55e", "#f59e0b"];
const STRAT_META: Record<Strategy, { label: string; color: string; desc: string }> = {
  greedy: { label: "Greedy", color: "#22c55e", desc: "Shoots first, asks questions later." },
  combo:  { label: "Combo",  color: "#eab308", desc: "Waits for alignment, then bursts." },
  dqn:    { label: "RL-DQN", color: "#a855f7", desc: "50k replays. Adapts to every wave." },
};
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function makeBlobs(): Blob[] {
  const types = ["green", "purple", "yellow", "blue", "red"];
  return Array.from({ length: 4 }, (_, i) => ({ id: i, x: 0.15 + (i / 4) * 0.7, y: 0.1 + Math.random() * 0.35, vx: (Math.random() - 0.5) * 0.003, vy: Math.random() * 0.002 + 0.001, hp: Math.floor(Math.random() * 3) + 1, type: types[i % types.length] }));
}
function computeQ(cannonX: number, blobs: Blob[], bulletActive: boolean, combo: number, strategy: Strategy): number[] {
  const nearest = blobs.length ? blobs.reduce((a, b) => Math.abs(b.x - cannonX) < Math.abs(a.x - cannonX) ? b : a) : null;
  const nx = nearest?.x ?? 0.5, nhp = (nearest?.hp ?? 0) / 5, dist = Math.abs(nx - cannonX);
  const cm = Math.min(combo / 8, 1);
  if (strategy === "greedy") {
    const shouldShoot = !bulletActive && dist < 0.15;
    return [nx < cannonX - 0.1 ? 0.6 + Math.random() * 0.25 : 0.15 + Math.random() * 0.12, nx > cannonX + 0.1 ? 0.6 + Math.random() * 0.25 : 0.15 + Math.random() * 0.12, shouldShoot ? 0.75 + nhp * 0.12 + Math.random() * 0.1 : 0.18 + Math.random() * 0.08, 0.05 + Math.random() * 0.06].map(v => +v.toFixed(3));
  }
  if (strategy === "combo") {
    const aligned = dist < 0.08, comboReady = cm > 0.4;
    return [nx < cannonX - 0.06 ? 0.55 + Math.random() * 0.2 : 0.1 + Math.random() * 0.08, nx > cannonX + 0.06 ? 0.55 + Math.random() * 0.2 : 0.1 + Math.random() * 0.08, aligned && comboReady ? 0.8 + Math.random() * 0.15 : 0.12 + Math.random() * 0.08, !comboReady ? 0.62 + Math.random() * 0.22 : 0.1 + Math.random() * 0.08].map(v => +v.toFixed(3));
  }
  const moveLeft = (nx < cannonX - 0.05 ? 0.5 : 0.1) + 0.2 + Math.random() * 0.12;
  const moveRight = (nx > cannonX + 0.05 ? 0.5 : 0.1) + 0.2 + Math.random() * 0.12;
  const shoot = !bulletActive && dist < 0.12 ? 0.62 + nhp * 0.18 + Math.random() * 0.08 : 0.12 + Math.random() * 0.07;
  const wait = cm < 0.35 ? 0.45 + Math.random() * 0.18 : 0.08 + Math.random() * 0.06;
  return [moveLeft, moveRight, shoot, wait].map(v => +Math.min(v, 0.99).toFixed(3));
}

function AgentSimulatorSection() {
  const [strategy, setStrategy] = useState<Strategy>("dqn");
  const [gs, setGs] = useState<GS>({ cannonX: 0.5, blobs: makeBlobs(), bulletActive: false, bulletX: 0.5, bulletY: 0.9, comboMultiplier: 1, score: 0 });
  const [qv, setQv] = useState<number[]>([0.25, 0.25, 0.25, 0.25]);
  const [chosen, setChosen] = useState<ActionId>(2);
  const [frame, setFrame] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const stratRef = useRef(strategy);
  const pidRef = useRef(0);
  const gsRef = useRef<GS>({ cannonX: 0.5, blobs: makeBlobs(), bulletActive: false, bulletX: 0.5, bulletY: 0.9, comboMultiplier: 1, score: 0 });
  stratRef.current = strategy;

  useEffect(() => {
    const id = setInterval(() => {
      let { blobs, bulletActive, bulletX, bulletY, score, comboMultiplier, cannonX } = gsRef.current;
      blobs = blobs.map(b => ({ ...b, x: ((b.x + b.vx + 1) % 1), y: clamp(b.y + b.vy * 0.5, 0.05, 0.55), vx: Math.abs(b.x + b.vx) > 1 || b.x + b.vx < 0 ? -b.vx : b.vx }));
      let spawnParticles: Particle[] = [];
      if (bulletActive) {
        bulletY -= 0.07;
        const hit = blobs.find(b => Math.abs(b.x - bulletX) < 0.09 && Math.abs(b.y - bulletY) < 0.1);
        if (hit) {
          score += 3 * comboMultiplier; comboMultiplier = Math.min(comboMultiplier + 0.5, 8);
          blobs = blobs.map(b => b.id === hit.id ? { ...b, hp: b.hp - 1 } : b).filter(b => b.hp > 0);
          bulletActive = false;
          const hc = BLOB_COLORS[hit.type];
          spawnParticles = Array.from({ length: 11 }, () => {
            const ang = Math.random() * Math.PI * 2; const spd = 0.006 + Math.random() * 0.018;
            return { id: pidRef.current++, x: hit.x, y: hit.y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, color: hc, life: 1 };
          });
        } else if (bulletY < -0.1) { bulletActive = false; comboMultiplier = Math.max(1, comboMultiplier - 0.5); }
      }
      if (blobs.length < 2) blobs = [...blobs, ...makeBlobs().slice(0, 3)];
      const newQ = computeQ(cannonX, blobs, bulletActive, comboMultiplier, stratRef.current);
      const act = newQ.indexOf(Math.max(...newQ)) as ActionId;
      setQv(newQ); setChosen(act); setFrame(f => f + 1);
      let nx = cannonX, nb = bulletActive, bx = bulletX, by = bulletY;
      if (act === 0) nx = clamp(cannonX - 0.045, 0.05, 0.95);
      if (act === 1) nx = clamp(cannonX + 0.045, 0.05, 0.95);
      if (act === 2 && !bulletActive) { nb = true; bx = nx; by = 0.87; }
      const nextGs = { ...gsRef.current, blobs, cannonX: nx, bulletActive: nb, bulletX: bx, bulletY: by, score, comboMultiplier };
      gsRef.current = nextGs; setGs(nextGs);
      setParticles(prev => [...prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.0008, life: p.life - 0.13 })).filter(p => p.life > 0), ...spawnParticles].slice(-60));
    }, 130);
    return () => clearInterval(id);
  }, []);

  const meta = STRAT_META[strategy];
  const maxQ = Math.max(...qv);

  return (
    <section className="border-t border-white/5 py-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mb-8">
          <p className="font-mono text-xs text-primary/60 tracking-widest mb-2">LIVE DEMO</p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
            <div>
              <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight">AI Mining Agent</h2>
              <p className="text-muted-foreground text-sm mt-1.5 max-w-md leading-relaxed">Python RL agent plays autonomously. State vector → Q-network → action every 130ms.</p>
            </div>
            <Link href="/ai-agent" className="flex-shrink-0 font-mono text-xs text-primary/70 border border-primary/30 px-4 py-2 rounded hover:bg-primary/8 transition-all hover:text-primary whitespace-nowrap">
              Full Simulator →
            </Link>
          </div>
        </motion.div>
        <div className="flex gap-2 flex-wrap mb-4">
          {(["greedy", "combo", "dqn"] as Strategy[]).map(s => {
            const m = STRAT_META[s]; const active = s === strategy;
            return (
              <button key={s} onClick={() => setStrategy(s)}
                className={`px-4 py-2 rounded-lg border font-mono text-xs tracking-wider transition-all duration-200 ${active ? "border-opacity-60 text-white" : "border-white/10 text-muted-foreground/50 hover:border-white/20 hover:text-white/60"}`}
                style={active ? { borderColor: m.color + "88", background: m.color + "14", color: m.color } : {}}>
                <span className="flex items-center gap-2">
                  {active && <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.7, repeat: Infinity }} />}
                  {m.label}
                </span>
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2 font-mono text-[10px] text-muted-foreground/30">
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 0.55, repeat: Infinity }} />
            FRAME {frame.toLocaleString()}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={strategy} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-xs text-muted-foreground/50 mb-5 font-mono">{meta.desc}</motion.p>
        </AnimatePresence>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <div className="relative w-full h-52 rounded-xl border border-white/10 bg-black/50 overflow-hidden select-none">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute rounded-full bg-white/15" style={{ width: 1, height: 1, left: `${(i * 41 + 7) % 100}%`, top: `${(i * 53 + 11) % 70}%` }} />
              ))}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
              {gs.blobs.map(blob => (
                <motion.div key={blob.id} className="absolute rounded-full"
                  style={{ width: 26, height: 26, left: `calc(${blob.x * 100}% - 13px)`, top: `calc(${blob.y * 100}% - 13px)`, background: `radial-gradient(circle at 35% 30%, ${BLOB_COLORS[blob.type]}cc, ${BLOB_COLORS[blob.type]}55)`, boxShadow: `0 0 10px ${BLOB_COLORS[blob.type]}44` }}
                  animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.8 + blob.id * 0.3, repeat: Infinity, ease: "easeInOut" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 3 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(0,0,0,0.5)" }} />
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(0,0,0,0.5)" }} />
                  </div>
                </motion.div>
              ))}
              {gs.bulletActive && (
                <motion.div className="absolute rounded-full"
                  style={{ width: 5, height: 13, left: `calc(${gs.bulletX * 100}% - 2.5px)`, top: `calc(${gs.bulletY * 100}% - 6.5px)`, background: "linear-gradient(to top,#22c55e,#86efac)", boxShadow: "0 0 8px #22c55e" }} />
              )}
              {particles.map(p => (
                <div key={p.id} className="absolute rounded-full pointer-events-none"
                  style={{ width: Math.max(3, 7 * p.life), height: Math.max(3, 7 * p.life), left: `calc(${p.x * 100}% - ${Math.max(1.5, 3.5 * p.life)}px)`, top: `calc(${p.y * 100}% - ${Math.max(1.5, 3.5 * p.life)}px)`, background: p.color, opacity: p.life, boxShadow: `0 0 ${6 * p.life}px ${p.color}` }} />
              ))}
              <motion.div className="absolute bottom-0 flex flex-col items-center" style={{ left: `calc(${gs.cannonX * 100}% - 9px)` }} transition={{ type: "spring", stiffness: 320, damping: 26 }}>
                <div className="w-2 h-5 rounded-sm bg-gradient-to-t from-primary to-primary/70" style={{ boxShadow: "0 0 7px #22c55e55" }} />
                <div className="w-5 h-2 rounded-sm bg-primary/80" />
              </motion.div>
              <div className="absolute top-2 left-2 font-mono text-[9px] text-primary/40">SCORE {gs.score.toLocaleString()}</div>
              <div className="absolute top-2 right-2">
                <span className="font-mono text-[9px] tracking-widest px-1.5 py-0.5 rounded border" style={{ color: ACTION_COLORS[chosen], borderColor: ACTION_COLORS[chosen] + "44", background: ACTION_COLORS[chosen] + "11" }}>{ACTION_LABELS[chosen]}</span>
              </div>
              <div className="absolute bottom-2 left-2 font-mono text-[9px] text-muted-foreground/25">COMBO ×{gs.comboMultiplier.toFixed(1)}</div>
            </div>
          </div>
          <div className="lg:col-span-2 rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] text-primary/50 tracking-widest mb-3">Q-VALUES</p>
            <div className="space-y-2.5">
              {qv.map((q, i) => {
                const isC = i === chosen; const pct = maxQ > 0 ? (q / maxQ) * 100 : 0;
                return (
                  <div key={i} className={`rounded-lg p-2.5 border transition-all duration-300 ${isC ? "border-white/15 bg-white/[0.03]" : "border-white/5"}`}>
                    <div className="flex items-center justify-between mb-1.5 gap-1">
                      <span className="font-mono text-[9px] tracking-widest flex items-center gap-1.5" style={{ color: isC ? ACTION_COLORS[i] : "#ffffff33" }}>
                        {isC && <motion.span className="w-1 h-1 rounded-full" style={{ background: ACTION_COLORS[i] }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />}
                        {ACTION_LABELS[i]}
                      </span>
                      <span className="font-mono text-[9px] text-white/35">{q.toFixed(3)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: isC ? ACTION_COLORS[i] : "#ffffff18" }} animate={{ width: `${pct}%` }} transition={{ duration: 0.3, ease: "easeOut" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/ai-agent" className="mt-4 block text-center font-mono text-[9px] text-primary/40 hover:text-primary/70 transition-colors tracking-widest">VIEW FULL SIMULATOR →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Built With ──────────────────────────────────────────────────────────────
function BuiltWith() {
  const TECHS = [
    { category: "Frontend", color: "127,65%,52%", items: [{ name: "React 18", desc: "UI component engine" }, { name: "TypeScript", desc: "Type-safe codebase" }, { name: "Vite", desc: "Dev server & bundler" }, { name: "Framer Motion", desc: "Animations & transitions" }, { name: "Tailwind CSS", desc: "Utility-first styling" }] },
    { category: "Blockchain", color: "263,68%,60%", items: [{ name: "Solana", desc: "Layer-1 chain for $SQUISH" }, { name: "Anchor", desc: "Smart contract framework" }, { name: "$SQUISH SPL", desc: "In-game token standard" }, { name: "Phantom Wallet", desc: "Web3 wallet integration" }, { name: "Helius RPC", desc: "High-speed Solana node" }] },
    { category: "AI & Python", color: "48,95%,58%", items: [{ name: "Python 3.12", desc: "AI agent runtime" }, { name: "RL-DQN", desc: "Reinforcement learning model" }, { name: "NumPy", desc: "State vector processing" }, { name: "WebSocket", desc: "Real-time agent-game bridge" }, { name: "ONNX Runtime", desc: "On-device model inference" }] },
    { category: "Infrastructure", color: "215,88%,62%", items: [{ name: "Vercel Edge", desc: "Global CDN deployment" }, { name: "PWA / SW", desc: "Offline & installable" }, { name: "GitHub Actions", desc: "CI / auto-changelog" }, { name: "Canvas API", desc: "Game rendering engine" }, { name: "Web Audio API", desc: "8-bit sound synthesis" }] },
  ];
  return (
    <section className="border-t border-white/5 py-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mb-10">
          <p className="font-mono text-xs text-primary/60 tracking-widest mb-2">STACK</p>
          <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight">Built With</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg leading-relaxed">Open, modern tech from browser to blockchain.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TECHS.map((group, gi) => (
            <motion.div key={group.category}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: gi * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-5 hover:border-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: `hsl(${group.color})`, boxShadow: `0 0 6px hsl(${group.color} / 0.5)` }} />
                <span className="font-mono text-[10px] tracking-widest font-bold" style={{ color: `hsl(${group.color})` }}>{group.category.toUpperCase()}</span>
              </div>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-white/85">{item.name}</span>
                    <span className="text-[11px] text-muted-foreground/50 text-right leading-tight">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/25 mt-6 text-center">
          All game logic runs client-side — zero backend latency during gameplay.
        </p>
      </div>
    </section>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function Home() {
  const { muted, setMuted, playShoot, playClick } = useGameSound();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const springY = useSpring(yText, { stiffness: 90, damping: 25 });

  const [bestScore, setBestScore] = useState<number | null>(null);
  const [showScrollCta, setShowScrollCta] = useState(false);

  useEffect(() => {
    const s = parseInt(localStorage.getItem("squish_hi") || "0");
    if (s > 0) setBestScore(s);
    const onScroll = () => setShowScrollCta(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen pt-16 flex flex-col">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.45; } 100% { transform: scale(1.85); opacity: 0; } }
        @keyframes grid-pulse { 0%,100% { opacity: 0.022; } 50% { opacity: 0.055; } }
        @keyframes ca-sweep { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(400%) skewX(-15deg); } }
      `}</style>

      {/* Sound toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        onClick={() => { setMuted(m => !m); playClick(); }}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full border border-primary/40 bg-background/80 backdrop-blur-md flex items-center justify-center text-lg hover:border-primary hover:glow-box-green transition-all group"
        title={muted ? "Unmute" : "Mute"}
      >
        <span className="group-hover:scale-110 transition-transform">{muted ? "🔇" : "🔊"}</span>
      </motion.button>

      {/* Sticky Play CTA */}
      <AnimatePresence>
        {showScrollCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Link href="/play" onClick={playShoot}
              className="flex items-center gap-2 bg-primary/90 hover:bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-display font-bold text-sm tracking-wider glow-box-green backdrop-blur-md transition-all hover:scale-105">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2 h-2 rounded-full bg-primary-foreground inline-block" />
              PLAY NOW
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-background z-0" />
        {/* Cyber grid overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(34,197,94,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.055) 1px, transparent 1px)", backgroundSize: "48px 48px", animation: "grid-pulse 5s ease-in-out infinite" }} />
        <HeroCanvas />

        {/* Reduced orbs — only 2 for performance */}
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 360, height: 360, background: "radial-gradient(circle, hsla(127,65%,52%,0.22), transparent)", left: "6%", top: "15%", filter: "blur(55px)" }}
          animate={{ y: [0, -24, 0], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 300, height: 300, background: "radial-gradient(circle, hsla(263,68%,58%,0.18), transparent)", left: "66%", top: "50%", filter: "blur(55px)" }}
          animate={{ y: [0, -20, 0], opacity: [0.14, 0.22, 0.14] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 220, height: 220, background: "radial-gradient(circle, hsla(180,100%,60%,0.13), transparent)", right: "3%", top: "20%", filter: "blur(48px)" }}
          animate={{ y: [0, 18, 0], opacity: [0.09, 0.17, 0.09] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 180, height: 180, background: "radial-gradient(circle, hsla(127,65%,52%,0.14), transparent)", left: "45%", bottom: "15%", filter: "blur(42px)" }}
          animate={{ x: [0, -14, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 5 }} />

        <div className="absolute inset-0 scanline z-0 opacity-[0.08] pointer-events-none" />
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />

        <motion.div style={{ y: springY, opacity: opacityHero }} className="container relative z-10 mx-auto px-4 text-center">
          <motion.div className="max-w-lg mx-auto flex flex-col items-center">
            {/* ── Live announcement pill ── */}
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-500/35 bg-green-500/[0.07] backdrop-blur-sm select-none cursor-default"
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.45, 1] }}
                transition={{ duration: 1.35, repeat: Infinity }}
              />
              <span className="font-mono text-[10px] tracking-[0.18em] font-bold" style={{ color: "rgba(74,222,128,0.88)" }}>
                ⚡ $SQUISH NOW LIVE ON SOLANA
              </span>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(74,222,128,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
            </motion.div>

            <GlitchTitle />

            <motion.p
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.75, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-muted-foreground mb-8 font-medium"
            >
              Shoot blobs. Chain combos.{" "}
              Earn{" "}
              <span style={{ color: "#14f195", fontWeight: 700, textShadow: "0 0 18px rgba(20,241,149,0.45)" }}>$SQUISH</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-3 w-full"
            >
              {/* Play button */}
              <div className="relative">
                <div className="absolute inset-0 rounded" style={{ background: "hsl(127 49% 60% / 0.3)", animation: "pulse-ring 2.2s ease-out infinite" }} />
                <Link href="/play" onClick={playShoot}
                  className="relative group bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-5 rounded font-display font-bold text-xl tracking-wider glow-box-green transition-all transform hover:-translate-y-0.5 hover:scale-[1.03] inline-block overflow-hidden"
                  data-testid="hero-play-btn">
                  <span className="relative z-10 flex items-center gap-3">
                    <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.85, repeat: Infinity }} className="w-2 h-2 rounded-full bg-primary-foreground inline-block" />
                    START PLAYING
                  </span>
                  <motion.span className="absolute inset-0 bg-white/10" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.4 }} />
                </Link>
              </div>

              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.5 }}
                className="text-xs text-muted-foreground/45 font-mono">
                No install · No login · Runs in browser
              </motion.span>

              {/* ── $SQUISH CA Card ── */}
              <SquishTokenCA />

              <BlobCounter />

              {bestScore !== null && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.95, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 font-mono text-xs text-accent">
                  <span>🏆</span><span>YOUR BEST: {bestScore.toLocaleString()}</span>
                </motion.div>
              )}
            </motion.div>

            {/* Scroll arrow */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.6 }} className="mt-12">
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-5 h-5 mx-auto border-r-2 border-b-2 border-primary/35 rotate-45" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero bottom bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 bg-black/35 border-t border-primary/10 backdrop-blur-md z-10 py-2.5 hidden md:block">
          <div className="container mx-auto px-4 flex justify-between items-center font-mono text-[11px] text-primary/50">
            <span>[ SYS: ONLINE ]</span>
            <div className="flex gap-6 text-primary/35">
              <span>ENEMIES: 07</span>
              <span>POWER-UPS: 06</span>
              <span>LEVELS: ∞</span>
            </div>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>_WAITING_FOR_INPUT</motion.span>
          </div>
        </motion.div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────────── */}
      <MarqueeTicker />

      {/* ── AI Agent Simulator ────────────────────────────────────────────── */}
      <AgentSimulatorSection />

      {/* ── Built With ────────────────────────────────────────────────────── */}
      <BuiltWith />
    </main>
  );
}
