import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PHASES = [
  {
    id: "genesis",
    label: "PHASE 0",
    title: "Genesis Mining",
    status: "LIVE" as const,
    date: "May 2026",
    hsl: "127,65%,52%",
    description:
      "The foundation. Every enemy type defeated in the hero animation generates $SQUISH coins with a unique yield. Balance persists locally and broadcasts cross-component.",
    items: [
      "Unique coin yield per blob type — Green: 3, Purple: 5, Yellow: 2, Blue: 4, Red: 6, Cyan: 3",
      "Boss encounters drop 50 $SQUISH",
      "Spinning 3D coin with collection physics and proximity auto-collect",
      "Persistent balance via localStorage + squish:coins event dispatch",
      "Per-enemy coin badge displayed on each character during animation",
    ],
  },
  {
    id: "arcade",
    label: "PHASE 1",
    title: "Squish Arcade",
    status: "BUILDING" as const,
    date: "Q3 2026",
    hsl: "48,95%,58%",
    description:
      "The hero animation evolves into a full playable game. $SQUISH earned per session is scored, signed, and prepared for on-chain anchoring.",
    items: [
      "Full playable game — difficulty waves, combo system, lives",
      "Session-based $SQUISH ledger with global leaderboard",
      "Boss-tier multipliers: 2× standard through 10× elite",
      "Power-up economy: spend $SQUISH to unlock upgrades mid-session",
      "Off-chain signed session receipts ready for on-chain bridge",
    ],
  },
  {
    id: "agent-mining",
    label: "PHASE 2",
    title: "AI Agent Mining",
    status: "PLANNED" as const,
    date: "Q4 2026",
    hsl: "263,68%,58%",
    description:
      "AI agents are deployed into the Squish universe. Each agent autonomously hunts enemies, accumulates $SQUISH, and reports yields — mining while you sleep.",
    items: [
      "Agent archetypes: Aggressive, Sniper, Tank, Collector — each with distinct yield curves",
      "Mining rate dynamically determined by agent precision and session score",
      "Multi-agent parallel deployment — scale your mining fleet",
      "Agent upgrade system funded by earned $SQUISH",
      "Real-time per-agent yield dashboard with historical chart",
    ],
  },
  {
    id: "token",
    label: "PHASE 3",
    title: "$SQUISH Token",
    status: "PLANNED" as const,
    date: "2027",
    hsl: "215,88%,62%",
    description:
      "$SQUISH transitions from in-game currency to a live token. All accumulated balances are fully claimable. Agent mining becomes real-yield DeFi.",
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
  LIVE:     { label: "LIVE",     bg: "bg-primary/15",    border: "border-primary/40",    text: "text-primary",     dot: "bg-primary"     },
  BUILDING: { label: "BUILDING", bg: "bg-yellow-400/10", border: "border-yellow-400/30", text: "text-yellow-400",  dot: "bg-yellow-400"  },
  PLANNED:  { label: "PLANNED",  bg: "bg-white/5",       border: "border-white/15",      text: "text-muted-foreground", dot: "bg-white/30" },
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
          {/* Spine */}
          <div className="absolute left-[11px] top-2 bottom-0 w-px bg-white/8" />

          <div className="space-y-14">
            {PHASES.map((phase, i) => {
              const cfg = STATUS_CONFIG[phase.status];
              const isLive = phase.status === "LIVE";
              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="relative pl-9"
                >
                  {/* Node */}
                  <div className="absolute left-0 top-1">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isLive ? "border-primary bg-primary/20" : "border-white/15 bg-white/5"}`}>
                      {isLive && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`rounded-xl border p-5 transition-all ${isLive ? "border-primary/20 bg-primary/5" : "border-white/8 bg-white/3"}`}>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="font-mono text-[10px] tracking-widest text-muted-foreground/50 block mb-1">{phase.label}</span>
                        <h2 className="font-display font-bold text-lg text-white leading-tight">{phase.title}</h2>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono tracking-wide ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isLive ? "animate-pulse" : ""}`} />
                          {cfg.label}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground/40">{phase.date}</span>
                      </div>
                    </div>

                    {/* Accent line */}
                    <div className="h-px mb-4" style={{ background: `linear-gradient(to right, hsl(${phase.hsl},0.3), transparent)` }} />

                    <p className="text-xs text-muted-foreground/70 leading-relaxed mb-4">{phase.description}</p>

                    <ul className="space-y-2">
                      {phase.items.map((item, k) => (
                        <li key={k} className="flex items-start gap-2.5">
                          <span className="flex-shrink-0 mt-[3px]" style={{ color: `hsl(${phase.hsl})`, opacity: 0.7 }}>▸</span>
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

        {/* Footer note */}
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
