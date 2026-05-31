import { motion } from "framer-motion";

export default function Roadmap() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-background relative overflow-hidden">
      {/* Background glow for web3 section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-black mb-4 text-white">THE MASTER PLAN</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">From browser blob shooter to mobile app, AI mining agent, and fully on-chain Solana arcade.</p>
        </div>

        <div className="relative border-l-2 border-white/10 ml-4 md:ml-12 space-y-16 py-8">
          
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
              "PWA Support (Installable)",
              "2P Local Multiplayer (same device)",
              "AI Mining Agent: 3 autonomous strategies (Greedy / Combo / RL-DQN)"
            ]}
          />

          <PhaseNode 
            phase="PHASE 2" 
            title="MOBILE LAUNCH" 
            date="JUNE 2026" 
            status="IN PROGRESS" 
            color="48 100% 62%"
            items={[
              "Android (Play Store) Release",
              "iOS (App Store) Release",
              "Touch joystick optimizations",
              "Haptic feedback integration",
              "AI Mining Agent mobile tab (WebView + injected agent)",
              "Daily challenges",
              "Push notifications",
              "Online multiplayer (2–4 players)"
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
              "Phantom/Solflare wallet connect",
              "On-chain global leaderboard",
              "$SQUISH SPL token integration",
              "NFT Blob Skins (Mint unique avatars)",
              "Squish-Mining program: anti-cheat session proofs",
              "Weekend SOL tournament prize pools",
              "Verifiable high scores"
            ]}
          />

        </div>
      </div>
    </main>
  );
}

function PhaseNode({ phase, title, date, status, items, color, glow = false }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative pl-8 md:pl-12"
    >
      {/* Node Dot */}
      <div 
        className={`absolute w-6 h-6 rounded-full top-1 -left-[13px] border-4 border-background ${glow ? 'animate-pulse' : ''}`}
        style={{ 
          backgroundColor: `hsl(${color})`,
          boxShadow: glow ? `0 0 20px hsl(${color} / 0.8)` : `0 0 10px hsl(${color} / 0.4)`
        }}
      />

      <div className="bg-card/50 backdrop-blur-md border border-white/5 rounded-xl p-6 md:p-8 hover:border-white/20 transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <span className="text-xs font-mono px-3 py-1 rounded-full font-bold" 
                style={{ 
                  backgroundColor: status === "LIVE NOW" ? `hsl(${color} / 0.2)` : 'rgba(255,255,255,0.05)',
                  color: status === "LIVE NOW" ? `hsl(${color})` : '#888'
                }}>
            {status}
          </span>
        </div>

        <div className="mb-6">
          <span className="text-sm font-mono tracking-widest" style={{ color: `hsl(${color})` }}>{phase} // {date}</span>
          <h3 className="text-2xl md:text-3xl font-display font-bold mt-1 text-white">{title}</h3>
        </div>

        <ul className="space-y-3">
          {items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground group-hover:text-white/90 transition-colors">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(${color} / 0.5)` }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
