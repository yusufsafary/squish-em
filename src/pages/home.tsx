import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { HeroCanvas } from "@/components/hero-canvas";
import { Link } from "wouter";
import { useState, useCallback, useRef, useEffect } from "react";

function useGameSound() {
  const [muted, setMuted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctxRef.current;
  };

  const playShoot = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }, [muted]);

  const playClick = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, [muted]);

  return { muted, setMuted, playShoot, playClick };
}

function GlitchTitle() {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative mb-6 select-none"
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tight glow-text-green relative z-10">
        SQUISH&nbsp;'EM!
      </h1>
      {glitch && (
        <>
          <h1
            className="text-5xl md:text-8xl font-display font-black tracking-tight absolute inset-0 z-20 pointer-events-none"
            style={{ color: "#0ff", clipPath: "inset(20% 0 60% 0)", transform: "translateX(-4px)", opacity: 0.7 }}
          >
            SQUISH&nbsp;'EM!
          </h1>
          <h1
            className="text-5xl md:text-8xl font-display font-black tracking-tight absolute inset-0 z-20 pointer-events-none"
            style={{ color: "#f0f", clipPath: "inset(60% 0 10% 0)", transform: "translateX(4px)", opacity: 0.7 }}
          >
            SQUISH&nbsp;'EM!
          </h1>
        </>
      )}
    </motion.div>
  );
}

function FloatingOrb({ delay, size, color, x, y }: { delay: number; size: number; color: string; x: string; y: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: color, left: x, top: y, filter: "blur(40px)" }}
      animate={{ y: [0, -30, 0], scale: [1, 1.12, 1], opacity: [0.18, 0.32, 0.18] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function useAnimatedCounter(target: number, duration = 1.8) {
  const [val, setVal] = useState(0);
  const inViewRef = useRef(false);

  return { val, setVal, inViewRef };
}

const FEATURES = [
  {
    icon: "∞",
    iconColor: "hsl(127 49% 60%)",
    title: "Infinite Levels",
    desc: "Every 15 kills advances a level. Speed and blob count scale endlessly. No ceiling, no escape.",
    border: "127 49% 60%",
    delay: 0,
  },
  {
    icon: "×4",
    iconColor: "hsl(360 100% 71%)",
    title: "Combo System",
    desc: "Chain kills to multiply your score up to ×4. Keep the streak alive or reset to zero.",
    border: "360 100% 71%",
    delay: 0.1,
  },
  {
    icon: "⚡",
    iconColor: "hsl(48 95% 58%)",
    title: "6 Power-Ups",
    desc: "Rapid Fire, Triple Shot, Shield, ×2 Score, NUKE, and FREEZE. Drops from enemies — use them wisely.",
    border: "48 95% 58%",
    delay: 0.2,
  },
  {
    icon: "⚠",
    iconColor: "hsl(0 100% 67%)",
    title: "Boss Waves",
    desc: "Every 5 levels a Boss erupts: 20 HP, projectile attacks, and triple the reward.",
    border: "0 100% 67%",
    delay: 0.3,
  },
  {
    icon: "🏆",
    iconColor: "hsl(48 100% 62%)",
    title: "Hall of Fame",
    desc: "Top 5 scores saved locally. Claim your spot on the title screen leaderboard.",
    border: "48 100% 62%",
    delay: 0.4,
  },
  {
    icon: "💥",
    iconColor: "hsl(263 44% 56%)",
    title: "Splash Kills",
    desc: "When a blob dies, nearby blobs take splash damage. Chain explosions for massive combos.",
    border: "263 44% 56%",
    delay: 0.5,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Move Your Cannon",
    desc: "Drag anywhere on the canvas, tap ◀ ▶ buttons, or use Arrow keys on desktop.",
    color: "127 49% 60%",
  },
  {
    n: "02",
    title: "Auto-Fire & Combo",
    desc: "Your cannon fires automatically. Chain kills fast to stack ×1.5 → ×4 score multipliers.",
    color: "263 44% 56%",
  },
  {
    n: "03",
    title: "Survive the Onslaught",
    desc: "3 lives. Collect power-ups. Dodge boss shots. How far can you go?",
    color: "48 95% 58%",
  },
];

export default function Home() {
  const { muted, setMuted, playShoot, playClick } = useGameSound();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const springY = useSpring(yText, { stiffness: 80, damping: 20 });

  const [bestScore, setBestScore] = useState<number | null>(null);
  const [showScrollCta, setShowScrollCta] = useState(false);

  useEffect(() => {
    const s = parseInt(localStorage.getItem("squish_hi") || "0");
    if (s > 0) setBestScore(s);
    const onScroll = () => setShowScrollCta(window.scrollY > 320);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen pt-16 flex flex-col">
      {/* Sound Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => { setMuted(m => !m); playClick(); }}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full border border-primary/40 bg-background/80 backdrop-blur-md flex items-center justify-center text-lg hover:border-primary hover:glow-box-green transition-all group"
        title={muted ? "Unmute sounds" : "Mute sounds"}
      >
        <span className="group-hover:scale-110 transition-transform">
          {muted ? "🔇" : "🔊"}
        </span>
      </motion.button>

      {/* Sticky scroll CTA */}
      <AnimatePresence>
        {showScrollCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Link
              href="/play"
              onClick={playShoot}
              className="flex items-center gap-2 bg-primary/90 hover:bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-display font-bold text-sm tracking-wider glow-box-green backdrop-blur-md transition-all hover:scale-105"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary-foreground inline-block"
              />
              PLAY NOW
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-background z-0" />
        <HeroCanvas />

        <FloatingOrb delay={0}   size={320} color="radial-gradient(circle, hsla(127,65%,52%,0.3), transparent)" x="10%"  y="20%" />
        <FloatingOrb delay={1.5} size={260} color="radial-gradient(circle, hsla(263,68%,58%,0.25), transparent)" x="70%"  y="55%" />
        <FloatingOrb delay={3}   size={200} color="radial-gradient(circle, hsla(48,95%,58%,0.2), transparent)"  x="55%"  y="10%" />

        <div className="absolute inset-0 scanline z-0 opacity-15 pointer-events-none" />
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />

        <motion.div style={{ y: springY, opacity: opacityHero }} className="container relative z-10 mx-auto px-4 text-center">
          <motion.div className="max-w-3xl mx-auto flex flex-col items-center">

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono tracking-widest uppercase backdrop-blur-sm"
            >
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-2 align-middle"
              />
              HTML5 Canvas Arcade
            </motion.div>

            <GlitchTitle />

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 font-medium"
            >
              Shoot blobs. Chain combos. Survive the boss waves.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-4"
            >
              <Link
                href="/play"
                onClick={playShoot}
                className="relative group bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-5 rounded font-display font-bold text-xl tracking-wider glow-box-green transition-all transform hover:-translate-y-1 hover:scale-105 inline-block overflow-hidden"
                data-testid="hero-play-btn"
              >
                <span className="relative z-10">START PLAYING</span>
                <motion.span
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </Link>

              {bestScore !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 font-mono text-xs text-accent"
                >
                  <span>🏆</span>
                  <span>YOUR BEST: {bestScore.toLocaleString()}</span>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="mt-14"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-6 mx-auto border-r-2 border-b-2 border-primary/50 rotate-45"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 bg-black/50 border-t border-primary/20 backdrop-blur-md z-10 py-3 hidden md:block">
          <div className="container mx-auto px-4 flex justify-between items-center font-mono text-xs text-primary">
            <span>[ SYS: ONLINE ]</span>
            <div className="flex gap-8">
              <span>ENEMIES: 05</span>
              <span>POWER-UPS: 06</span>
              <span>LEVELS: ∞</span>
              <span>DEP: 00</span>
            </div>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.1, repeat: Infinity }}>
              _WAITING_FOR_INPUT
            </motion.span>
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section className="py-20 bg-card border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, hsla(127,49%,60%,0.05), transparent)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl font-display font-bold mb-4">CORE FEATURES</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full glow-box-green" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          >
            {FEATURES.map(f => (
              <motion.div
                key={f.title}
                variants={{ hidden: { opacity: 0, y: 28, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative p-6 rounded-xl border bg-background/60 backdrop-blur-sm overflow-hidden group"
                style={{ borderColor: `hsl(${f.border} / 0.25)` }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, hsl(${f.border} / 0.07), transparent 70%)` }}
                />
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-display font-black mb-4"
                  style={{ backgroundColor: `hsl(${f.border} / 0.12)`, color: f.iconColor, boxShadow: `0 0 20px hsl(${f.border} / 0.2)` }}
                >
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: f.iconColor }}>{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Explore More (compact nav to other pages) ─────────────────────── */}
      <section className="py-14 bg-background border-b border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            {[
              { href: "/how-to-play",            icon: "📖", label: "Game Guide",  desc: "Controls, power-ups & pro tips",     color: "127 49% 60%"  },
              { href: "/how-to-play#bestiary",   icon: "🐛", label: "Bestiary",    desc: "All enemies, HP & strategies",       color: "215 100% 65%" },
              { href: "/roadmap",                icon: "🗺", label: "Roadmap",     desc: "Mobile, Web3 & Multiplayer plans",   color: "263 44% 56%"  },
            ].map(item => (
              <motion.div
                key={item.href}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } } }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-4 p-5 rounded-xl border bg-card/60 backdrop-blur-sm hover:border-opacity-60 transition-all group block"
                  style={{ borderColor: `hsl(${item.color} / 0.22)` }}
                >
                  <div className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `hsl(${item.color} / 0.1)`, boxShadow: `0 0 14px hsl(${item.color} / 0.18)` }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-display font-bold text-sm block mb-0.5" style={{ color: `hsl(${item.color})` }}>{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                  <span className="text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all shrink-0">→</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Compact Roadmap Strip ─────────────────────────────────────────── */}
      <section className="py-14 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 90% 100% at 50% 50%, hsla(263,44%,56%,0.06), transparent)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-2xl mx-auto flex flex-col items-center gap-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/40 bg-secondary/10 text-secondary text-xs font-mono tracking-widest uppercase">
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              Coming Soon
            </div>
            <h2 className="text-2xl font-display font-bold text-white text-center">MOBILE + WEB3 + MULTIPLAYER</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "PHASE 1", status: "LIVE NOW",                          color: "127 49% 60%" },
                { label: "PHASE 2", status: "MOBILE / JUNE 2026",                color: "48 100% 62%" },
                { label: "PHASE 3", status: "SOLANA + MULTIPLAYER / Q3 2026",    color: "263 44% 56%" },
              ].map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background/50 backdrop-blur-sm"
                  style={{ borderColor: `hsl(${p.color} / 0.3)` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${p.color})`, boxShadow: `0 0 6px hsl(${p.color} / 0.6)` }} />
                  <span className="font-mono text-xs" style={{ color: `hsl(${p.color})` }}>{p.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{p.status}</span>
                </motion.div>
              ))}
            </div>
            <Link
              href="/roadmap"
              className="text-sm font-mono text-secondary/60 hover:text-secondary transition-colors flex items-center gap-1"
            >
              VIEW MASTER PLAN →
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function EnemyCard({ name, hp, speed, pts, desc, color, isBoss = false, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.03 }}
      className={`relative p-6 rounded-lg border bg-background/50 backdrop-blur-sm overflow-hidden flex flex-col group ${isBoss ? 'md:col-span-2 lg:col-span-3 lg:w-2/3 lg:mx-auto' : ''}`}
      style={{ borderColor: `hsl(${color} / 0.3)` }}
      data-testid={`enemy-card-${name.toLowerCase().replace(' ', '-')}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" style={{ backgroundColor: `hsl(${color})` }} />

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `hsl(${color} / 0.2)`, boxShadow: `0 0 20px hsl(${color} / 0.3)` }}>
          <motion.div
            className="w-10 h-10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]"
            animate={{ scale: [1, 1.08, 1], borderRadius: ["40%_60%_70%_30%/40%_50%_60%_50%", "60%_40%_30%_70%/50%_60%_50%_40%", "40%_60%_70%_30%/40%_50%_60%_50%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundColor: `hsl(${color})` }}
          />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg" style={{ color: `hsl(${color})` }}>{name}</h3>
          <span className="text-xs font-mono text-muted-foreground">{desc}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto font-mono text-sm bg-black/40 p-3 rounded">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">HP</span>
          <span className="text-white">{hp}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">SPD</span>
          <span className="text-white truncate">{speed}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">PTS</span>
          <span className="text-white">{pts}</span>
        </div>
      </div>
    </motion.div>
  );
}

function TechPill({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16, scale: 0.92 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
      whileHover={{ scale: 1.06, y: -2 }}
      className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono tracking-tight hover:bg-primary/20 hover:glow-box-green transition-colors cursor-default"
    >
      {children}
    </motion.div>
  );
}
