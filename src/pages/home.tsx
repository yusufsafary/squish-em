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
          <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight absolute inset-0 z-20 pointer-events-none"
            style={{ color: "#0ff", clipPath: "inset(20% 0 60% 0)", transform: "translateX(-4px)", opacity: 0.7 }}>
            SQUISH&nbsp;'EM!
          </h1>
          <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight absolute inset-0 z-20 pointer-events-none"
            style={{ color: "#f0f", clipPath: "inset(60% 0 10% 0)", transform: "translateX(4px)", opacity: 0.7 }}>
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

function BlobCounter() {
  const [count, setCount] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem("squish_total_blobs") || "0");
    setCount(stored);

    const onKill = (e: Event) => {
      const kills = (e as CustomEvent).detail?.kills ?? 1;
      setCount(prev => {
        const next = prev + kills;
        localStorage.setItem("squish_total_blobs", String(next));
        return next;
      });
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
    };

    window.addEventListener("squish:kill", onKill);
    return () => window.removeEventListener("squish:kill", onKill);
  }, []);

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.5 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/8 backdrop-blur-sm"
    >
      <motion.span
        animate={animating ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}
        transition={{ duration: 0.35 }}
        className="text-base"
      >
        💥
      </motion.span>
      <span className="font-mono text-xs text-primary/80">
        YOU'VE SQUISHED{" "}
        <motion.span
          key={count}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-bold text-primary"
        >
          {count.toLocaleString()}
        </motion.span>
        {" "}BLOB{count !== 1 ? "S" : ""}
      </span>
    </motion.div>
  );
}

const MARQUEE_ITEMS = [
  "SHOOT BLOBS", "CHAIN COMBOS", "SURVIVE BOSSES", "RACK UP POINTS",
  "COLLECT POWER-UPS", "CLIMB THE LEADERBOARD", "SQUISH 'EM ALL",
  "NO INSTALL", "PURE ARCADE", "INFINITE LEVELS",
];

function MarqueeTicker() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden py-3 border-y border-primary/20 bg-primary/5 backdrop-blur-sm">
      <div className="flex gap-8 whitespace-nowrap" style={{ animation: "marquee 28s linear infinite", width: "max-content" }}>
        {items.map((item, i) => (
          <span key={i} className="font-display font-bold text-xs tracking-widest text-primary/70 flex items-center gap-4">
            {item}
            <span className="text-primary/30">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

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
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.9); opacity: 0; } }
      `}</style>

      {/* Sound Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => { setMuted(m => !m); playClick(); }}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full border border-primary/40 bg-background/80 backdrop-blur-md flex items-center justify-center text-lg hover:border-primary hover:glow-box-green transition-all group"
        title={muted ? "Unmute sounds" : "Mute sounds"}
      >
        <span className="group-hover:scale-110 transition-transform">{muted ? "🔇" : "🔊"}</span>
      </motion.button>

      {/* Sticky scroll CTA */}
      <AnimatePresence>
        {showScrollCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Link href="/play" onClick={playShoot}
              className="flex items-center gap-2 bg-primary/90 hover:bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-display font-bold text-sm tracking-wider glow-box-green backdrop-blur-md transition-all hover:scale-105">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-primary-foreground inline-block" />
              PLAY NOW
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-background z-0" />
        <HeroCanvas />

        <FloatingOrb delay={0}   size={320} color="radial-gradient(circle, hsla(127,65%,52%,0.3), transparent)" x="10%"  y="20%" />
        <FloatingOrb delay={1.5} size={260} color="radial-gradient(circle, hsla(263,68%,58%,0.25), transparent)" x="70%"  y="55%" />
        <FloatingOrb delay={3}   size={200} color="radial-gradient(circle, hsla(48,95%,58%,0.2), transparent)"  x="55%"  y="10%" />
        <FloatingOrb delay={2}   size={180} color="radial-gradient(circle, hsla(360,100%,71%,0.15), transparent)" x="85%" y="15%" />

        <div className="absolute inset-0 scanline z-0 opacity-15 pointer-events-none" />
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(hsl(127 49% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(127 49% 60%) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <motion.div style={{ y: springY, opacity: opacityHero }} className="container relative z-10 mx-auto px-4 text-center">
          <motion.div className="max-w-3xl mx-auto flex flex-col items-center">

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
              <div className="relative">
                <div className="absolute inset-0 rounded" style={{ background: "hsl(127 49% 60% / 0.4)", animation: "pulse-ring 2s ease-out infinite" }} />
                <Link href="/play" onClick={playShoot}
                  className="relative group bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-5 rounded font-display font-bold text-xl tracking-wider glow-box-green transition-all transform hover:-translate-y-1 hover:scale-105 inline-block overflow-hidden"
                  data-testid="hero-play-btn"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-primary-foreground inline-block" />
                    START PLAYING
                  </span>
                  <motion.span className="absolute inset-0 bg-white/10" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.4 }} />
                </Link>
              </div>

              <span className="text-xs text-muted-foreground/50 font-mono">No install · No login · Runs in browser</span>

              <BlobCounter />

              {bestScore !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 font-mono text-xs text-accent"
                >
                  <span>🏆</span>
                  <span>YOUR BEST: {bestScore.toLocaleString()}</span>
                </motion.div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="mt-14">
              <motion.div
                animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
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

      {/* ── Marquee Ticker ───────────────────────────────────────────────── */}
      <MarqueeTicker />
    </main>
  );
}
