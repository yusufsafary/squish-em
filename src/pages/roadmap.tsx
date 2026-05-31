import { motion } from "framer-motion";

export default function Roadmap() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <p className="font-mono text-xs text-primary/60 tracking-widest mb-3">MASTER PLAN</p>
          <h1 className="text-4xl md:text-5xl font-display font-black mb-4 text-white tracking-tight">THE ROADMAP</h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            From browser blob shooter to mobile app, AI mining agent, and fully on-chain Solana arcade.
          </p>
        </motion.div>

        <div className="relative pl-6 md:pl-10 border-l border-white/8 space-y-10">
          <PhaseNode
            phase="PHASE 1"
            title="BETA LAUNCH"
            date="MAY 2026"
            status="LIVE NOW"
            color="127 49% 60%"
            items={[
              "Web version deployment",
              "Core gameplay loop & scaling difficulty",
              "4 enemy types + Boss system",
              "Power-ups system",
              "Local Leaderboard & Hall of Fame",
              "PWA Support - installable offline",
              "2P Local Multiplayer (same device)",
              "AI Mining Agent: Greedy, Combo & RL-DQN strategies",
            ]}
          />

          <PhaseNode
            phase="PHASE 2"
            title="MOBILE LAUNCH"
            date="JUNE 2026"
            status="IN PROGRESS"
            color="48 100% 62%"
            items={[
              "Android (Play Store) release",
              "iOS (App Store) release",
              "Touch joystick optimizations",
              "Haptic feedback integration",
              "AI Mining Agent mobile tab (WebView + injected agent)",
              "Daily challenges",
              "Push notifications",
              "Online multiplayer (2–4 players)",
            ]}
          />

          <PhaseNode
            phase="PHASE 3"
            title="SOLANA WEB3"
            date="Q3 2026"
            status="PLANNED"
            color="263 44% 56%"
            glow
            items={[
              "Phantom / Solflare wallet connect",
              "On-chain global leaderboard",
              "$SQUISH SPL token integration",
              "NFT Blob Skins - mint unique avatars",
              "Squish-Mining program with anti-cheat session proofs",
              "Weekend SOL tournament prize pools",
              "Verifiable high scores",
            ]}
          />
        </div>
      </div>
    </main>
  );
}

function PhaseNode({ phase, title, date, status, items, color, glow = false }: {
  phase: string; title: string; date: string; status: string;
  items: string[]; color: string; glow?: boolean;
}) {
  const statusColor = status === "LIVE NOW"
    ? `hsl(${color})`
    : status === "IN PROGRESS"
      ? `hsl(${color})`
      : "#666";
  const statusBg = status === "LIVE NOW" || status === "IN PROGRESS"
    ? `hsl(${color} / 0.12)`
    : "rgba(255,255,255,0.04)";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Timeline dot */}
      <div
        className={`absolute w-5 h-5 rounded-full -left-[2.85rem] md:-left-[3.35rem] top-5 border-[3px] border-background ${glow ? "animate-pulse" : ""}`}
        style={{
          backgroundColor: `hsl(${color})`,
          boxShadow: glow ? `0 0 18px hsl(${color} / 0.7)` : `0 0 8px hsl(${color} / 0.4)`,
        }}
      />

      <div className="bg-card/40 backdrop-blur-md border border-white/6 rounded-2xl p-6 md:p-8 hover:border-white/14 transition-all duration-300 group">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] tracking-widest font-bold" style={{ color: `hsl(${color})` }}>
                {phase}
              </span>
              <span className="text-white/15 text-xs">·</span>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground/60">{date}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">{title}</h3>
          </div>
          <span
            className="mt-1 text-[10px] font-mono font-bold px-3 py-1 rounded-full tracking-widest shrink-0"
            style={{ backgroundColor: statusBg, color: statusColor }}
          >
            {status}
          </span>
        </div>

        {/* Items */}
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
              <span
                className="mt-[7px] w-1 h-1 rounded-full shrink-0"
                style={{ backgroundColor: `hsl(${color} / 0.6)` }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
