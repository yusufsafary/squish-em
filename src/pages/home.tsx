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

export default function Home() {
  const { muted, setMuted, playShoot, playClick } = useGameSound();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const springY = useSpring(yText, { stiffness: 80, damping: 20 });

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

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-background z-0" />
        <HeroCanvas />

        {/* Ambient orbs */}
        <FloatingOrb delay={0}   size={320} color="radial-gradient(circle, hsla(127,65%,52%,0.3), transparent)" x="10%"  y="20%" />
        <FloatingOrb delay={1.5} size={260} color="radial-gradient(circle, hsla(263,68%,58%,0.25), transparent)" x="70%"  y="55%" />
        <FloatingOrb delay={3}   size={200} color="radial-gradient(circle, hsla(48,95%,58%,0.2), transparent)"  x="55%"  y="10%" />

        {/* Scanline overlay */}
        <div className="absolute inset-0 scanline z-0 opacity-15 pointer-events-none" />

        {/* Vignette */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />

        <motion.div style={{ y: springY, opacity: opacityHero }} className="container relative z-10 mx-auto px-4 text-center">
          <motion.div className="max-w-3xl mx-auto flex flex-col items-center">

            {/* Pre-title badge */}
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
            </motion.div>

            {/* Down arrow hint */}
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

        {/* HUD Stats */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 border-t border-primary/20 backdrop-blur-md z-10 py-3 hidden md:block">
          <div className="container mx-auto px-4 flex justify-between items-center font-mono text-xs text-primary">
            <span>[ SYS: ONLINE ]</span>
            <div className="flex gap-8">
              <span>ENEMIES: 04</span>
              <span>POWER-UPS: 04</span>
              <span>LEVELS: ∞</span>
              <span>DEP: 00</span>
            </div>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.1, repeat: Infinity }}>
              _WAITING_FOR_INPUT
            </motion.span>
          </div>
        </div>
      </section>

      {/* Roster Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl font-display font-bold mb-4">THE BESTIARY</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full glow-box-green" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Green Blob",  hp: "1",  speed: "Slow",             pts: "10",  desc: "Common",              color: "127 49% 60%",  delay: 0 },
              { name: "Blue Blob",   hp: "2",  speed: "Very Slow",        pts: "20",  desc: "Unlocks Lv 3",        color: "215 100% 65%", delay: 0.08 },
              { name: "Red Blob",    hp: "1",  speed: "Fast",             pts: "30",  desc: "Unlocks Lv 5",        color: "360 100% 71%", delay: 0.16 },
              { name: "Golden Blob", hp: "1",  speed: "Medium",           pts: "100", desc: "5% Spawn Rate (zigzag)", color: "48 100% 62%",  delay: 0.24 },
              { name: "Boss Blob",   hp: "20", speed: "Fires Projectiles",pts: "500", desc: "Every 5 Levels",      color: "360 100% 71%", delay: 0.32, isBoss: true },
            ].map(e => (
              <EnemyCard key={e.name} {...e} />
            ))}
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section className="py-24 bg-card border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl font-display font-bold mb-4">PURE PERFORMANCE</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built from the ground up with zero bloat. No massive engines, just pure math and pixels.</p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          >
            {["HTML5 Canvas 2D", "Web Audio API", "requestAnimationFrame", "localStorage", "Touch + Pointer Events", "Fixed 400x700 Logical Canvas"].map(t => (
              <TechPill key={t}>{t}</TechPill>
            ))}
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
