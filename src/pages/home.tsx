import { motion } from "framer-motion";
import { HeroCanvas } from "@/components/hero-canvas";
import { Link } from "wouter";
import { useState, useCallback, useRef } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

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

export default function Home() {
  const { muted, setMuted, playShoot, playClick } = useGameSound();

  return (
    <main className="min-h-screen pt-16 flex flex-col">
      {/* Sound Toggle — fixed bottom-right */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => { setMuted(m => !m); playClick(); }}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full border border-primary/40 bg-background/80 backdrop-blur-md flex items-center justify-center text-lg hover:border-primary hover:glow-box-green transition-all group"
        title={muted ? "Unmute sounds" : "Mute sounds"}
      >
        <span className="group-hover:scale-110 transition-transform">
          {muted ? "🔇" : "🔊"}
        </span>
      </motion.button>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-background z-0" />
        <HeroCanvas />
        <div className="absolute inset-0 scanline z-0 opacity-20 pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="show" variants={container} className="max-w-3xl mx-auto flex flex-col items-center">
            <motion.h1 variants={item} className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight glow-text-green">
              SQUISH 'EM!
            </motion.h1>
            <motion.p variants={item} className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">
              Shoot blobs. Chain combos. Survive the boss waves.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link
                href="/play"
                onClick={playShoot}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded font-display font-bold text-lg tracking-wider glow-box-green transition-all transform hover:-translate-y-1 inline-block"
                data-testid="hero-play-btn"
              >
                START PLAYING
              </Link>

              {/* Web3 Roadmap button + Orvyn badge */}
              <div className="flex flex-col items-center gap-1.5">
                <Link
                  href="/roadmap"
                  onClick={playClick}
                  className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 px-8 py-4 rounded font-display font-bold text-lg tracking-wider transition-all transform hover:-translate-y-1 inline-block w-full text-center"
                  data-testid="hero-roadmap-btn"
                >
                  WEB3 ROADMAP
                </Link>
                {/* Orynth badge */}
                <motion.a
                  href="https://orynth.dev/projects/squishem"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  className="transition-all"
                >
                  <img
                    src="https://orynth.dev/api/badge/squishem?theme=light&style=default"
                    alt="Featured on Orynth"
                    width={200}
                    height={62}
                    className="rounded-lg"
                  />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>

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
            <span className="animate-pulse">_WAITING_FOR_INPUT</span>
          </div>
        </div>
      </section>

      {/* Roster Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">THE BESTIARY</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full glow-box-green" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <EnemyCard name="Green Blob" hp="1" speed="Slow" pts="10" desc="Common" color="127 49% 60%" />
            <EnemyCard name="Blue Blob" hp="2" speed="Very Slow" pts="20" desc="Unlocks Lv 3" color="215 100% 65%" />
            <EnemyCard name="Red Blob" hp="1" speed="Fast" pts="30" desc="Unlocks Lv 5" color="360 100% 71%" />
            <EnemyCard name="Golden Blob" hp="1" speed="Medium" pts="100" desc="5% Spawn Rate (zigzag)" color="48 100% 62%" />
            <EnemyCard name="Boss Blob" hp="20" speed="Fires Projectiles" pts="500" desc="Every 5 Levels" color="360 100% 71%" isBoss />
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section className="py-24 bg-card border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">PURE PERFORMANCE</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built from the ground up with zero bloat. No massive engines, just pure math and pixels.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            <TechPill>HTML5 Canvas 2D</TechPill>
            <TechPill>Web Audio API</TechPill>
            <TechPill>requestAnimationFrame</TechPill>
            <TechPill>localStorage</TechPill>
            <TechPill>Touch + Pointer Events</TechPill>
            <TechPill>Fixed 400x700 Logical Canvas</TechPill>
          </div>
        </div>
      </section>
    </main>
  );
}

function EnemyCard({ name, hp, speed, pts, desc, color, isBoss = false }: any) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative p-6 rounded-lg border bg-background/50 backdrop-blur-sm overflow-hidden flex flex-col group ${isBoss ? 'md:col-span-2 lg:col-span-3 lg:w-2/3 lg:mx-auto' : ''}`}
      style={{ borderColor: `hsl(${color} / 0.3)` }}
      data-testid={`enemy-card-${name.toLowerCase().replace(' ', '-')}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" style={{ backgroundColor: `hsl(${color})` }} />

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `hsl(${color} / 0.2)`, boxShadow: `0 0 20px hsl(${color} / 0.3)` }}>
          <div className="w-10 h-10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-pulse" style={{ backgroundColor: `hsl(${color})` }} />
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
    <div className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono tracking-tight hover:bg-primary/20 transition-colors cursor-default">
      {children}
    </div>
  );
}
