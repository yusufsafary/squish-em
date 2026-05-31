import { motion } from "framer-motion";

export default function HowToPlay() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black mb-4 text-white">GAME GUIDE</h1>
          <div className="w-20 h-1 bg-primary rounded-full glow-box-green" />
        </motion.div>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-display font-bold mb-6 text-primary flex items-center gap-3">
              <span className="w-6 h-1 bg-primary inline-block" /> CONTROLS
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-card rounded-lg border border-white/10">
                <h3 className="font-bold mb-4">KEYBOARD (Desktop)</h3>
                <ul className="space-y-3 font-mono text-sm">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Move Cannon</span>
                    <span className="text-white bg-white/10 px-2 rounded">← → Arrow Keys</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Auto Fires</span>
                    <span className="text-white bg-white/10 px-2 rounded">Always On</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Pause</span>
                    <span className="text-white bg-white/10 px-2 rounded">P / ESC</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-card rounded-lg border border-white/10">
                <h3 className="font-bold mb-4">TOUCH / MOUSE (Mobile &amp; Desktop)</h3>
                <ul className="space-y-3 font-mono text-sm">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Move Cannon</span>
                    <span className="text-white">Drag anywhere on canvas</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Move Left/Right</span>
                    <span className="text-white">◀ ▶ Buttons at bottom</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Auto Fires</span>
                    <span className="text-white">Always On</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-6 text-accent flex items-center gap-3">
              <span className="w-6 h-1 bg-accent inline-block" /> COMBO SYSTEM
            </h2>
            <p className="text-muted-foreground mb-6">Chain kills quickly to build your multiplier. The timer resets after each kill. Keep shooting!</p>
            <div className="flex flex-col gap-4">
              {[
                { mult: "×1.5", threshold: "2 kills", color: "rgba(255,255,255,0.8)", pct: "25%" },
                { mult: "×2",   threshold: "3 kills", color: "rgba(107,203,119,1)",   pct: "50%" },
                { mult: "×3",   threshold: "4 kills", color: "rgba(255,217,61,1)",    pct: "75%" },
                { mult: "×4",   threshold: "6 kills", color: "rgba(255,107,107,1)",   pct: "100%", max: true },
              ].map(({ mult, threshold, color, pct, max }) => (
                <div key={mult} className="flex items-center gap-4 bg-card/50 p-4 rounded border border-white/5" style={{ borderColor: max ? 'rgba(255,107,107,0.4)' : undefined }}>
                  <div className="font-display font-black text-2xl w-14 text-center" style={{ color }}>{mult}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: pct, backgroundColor: color }} />
                    </div>
                    <span className="text-xs font-mono mt-2 block" style={{ color }}>
                      {threshold}{max ? " (MAX TIER)" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-6 text-primary flex items-center gap-3">
              <span className="w-6 h-1 bg-primary inline-block" /> POWER-UPS
            </h2>
            <p className="font-mono text-sm mb-6 text-muted-foreground">DROP RATE: 15%. Collect by moving your cannon into them.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <PowerUp icon="⚡" name="Rapid Fire" desc="Fire rate 0.5s to 0.14s. Lasts 8s." color="360 100% 71%" />
              <PowerUp icon="✦✦✦" name="Triple Shot" desc="3 spread projectiles per shot. Lasts 8s." color="263 44% 56%" />
              <PowerUp icon="🛡" name="Shield" desc="Absorbs 1 hit (from blobs or boss shots). Lasts 10s." color="180 80% 55%" />
              <PowerUp icon="×2" name="Score Multiplier" desc="Doubles all points earned. Lasts 10s." color="48 100% 62%" />
              <PowerUp icon="💣" name="NUKE" desc="Clears every blob on screen instantly. Rare drop. Massive score burst." color="14 100% 57%" />
              <PowerUp icon="❄" name="FREEZE" desc="Freezes all blobs & boss at 12% speed for 6 seconds. Use it before boss arrives." color="195 100% 50%" />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-6 text-destructive flex items-center gap-3">
              <span className="w-6 h-1 bg-destructive inline-block" /> SURVIVAL TIPS
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { tip: "Every 15 kills advances a level. Speed and blob count increase each level." },
                { tip: "Boss appears every 5 levels. It fires projectiles. Dodge by moving your cannon!" },
                { tip: "Shield blocks boss shots too. Always grab it before a boss fight." },
                { tip: "Gold blobs zigzag and are rare (5%). Worth 100 pts. Prioritize them!" },
                { tip: "Triple Shot + Score×2 stack. Combine them with a combo for massive scores." },
                { tip: "Blue blobs take 2 hits. Lead your shots slightly ahead of them." },
              ].map(({ tip }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3 p-4 bg-card/30 rounded border border-white/5"
                >
                  <span className="text-primary font-bold font-mono shrink-0">0{i + 1}</span>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </motion.div>
              ))}
            </div>
          </section>
          {/* ── Bestiary ── */}
          <section id="bestiary">
            <h2 className="text-2xl font-display font-bold mb-6 text-primary flex items-center gap-3">
              <span className="w-6 h-1 bg-primary inline-block" /> THE BESTIARY
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Green Blob",  icon: "🟢", hp: 1, speed: "Slow",              pts: 10,  desc: "Most common. Easy prey  -  chain them for combos.",                      color: "127 49% 60%",  unlocks: "from start" },
                { name: "Blue Blob",   icon: "🔵", hp: 2, speed: "Very Slow",          pts: 20,  desc: "Tanky. Takes 2 shots. Lead your aim slightly.",                       color: "215 100% 65%", unlocks: "Level 3" },
                { name: "Red Blob",    icon: "🔴", hp: 1, speed: "Fast",               pts: 30,  desc: "Darts downward quickly. Shoot ahead of its path.",                    color: "360 100% 71%", unlocks: "Level 5" },
                { name: "Gold Blob",   icon: "🟡", hp: 1, speed: "Medium (zigzag)",    pts: 100, desc: "5% spawn chance. Zigzag pattern. Worth 10× a green  -  always chase it.", color: "48 100% 62%",  unlocks: "Level 2" },
                { name: "Boss Blob",   icon: "🔥", hp: 20, speed: "Fires projectiles", pts: 500, desc: "Appears every 5 levels. Has 20 HP, fires shots. Use FREEZE + NUKE.",   color: "360 100% 71%", unlocks: "every 5 lvls", isBoss: true },
              ].map(e => (
                <motion.div
                  key={e.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`p-5 rounded-lg border bg-card/40 flex gap-4 ${e.isBoss ? "md:col-span-2" : ""}`}
                  style={{ borderColor: `hsl(${e.color} / 0.3)` }}
                >
                  <div className="text-3xl shrink-0 w-12 h-12 flex items-center justify-center rounded-xl" style={{ backgroundColor: `hsl(${e.color} / 0.12)` }}>{e.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold" style={{ color: `hsl(${e.color})` }}>{e.name}</h3>
                      <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded">{e.unlocks}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{e.desc}</p>
                    <div className="flex gap-4 font-mono text-xs">
                      <span><span className="text-muted-foreground">HP </span><span className="text-white">{e.hp}</span></span>
                      <span><span className="text-muted-foreground">SPD </span><span className="text-white">{e.speed}</span></span>
                      <span><span className="text-muted-foreground">PTS </span><span style={{ color: `hsl(${e.color})` }}>{e.pts}</span></span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

function PowerUp({ icon, name, desc, color }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-card/30 border border-white/5 hover:border-white/20 transition-colors">
      <div className="w-12 h-12 rounded bg-background flex items-center justify-center text-xl font-bold shrink-0" style={{ boxShadow: `0 0 15px hsl(${color} / 0.2)`, color: `hsl(${color})`}}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold font-display" style={{ color: `hsl(${color})` }}>{name}</h4>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
