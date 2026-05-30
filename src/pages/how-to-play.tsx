import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function HowToPlay() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-primary glow-text-green mb-4">
            Game Guide
          </h1>
          <p className="text-xl text-muted-foreground">
            Master the arena. Everything you need to know to hit high scores.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Controls */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-orbitron font-bold mb-6 border-b border-border pb-2">1. Controls</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-orbitron">Movement</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 border rounded bg-background flex items-center justify-center font-mono">W</div>
                    <div className="flex gap-1">
                      <div className="w-10 h-10 border rounded bg-background flex items-center justify-center font-mono">A</div>
                      <div className="w-10 h-10 border rounded bg-background flex items-center justify-center font-mono">S</div>
                      <div className="w-10 h-10 border rounded bg-background flex items-center justify-center font-mono">D</div>
                    </div>
                  </div>
                  <div className="text-muted-foreground">or Arrow Keys to move</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-orbitron">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <kbd className="px-3 py-1 bg-background border rounded font-mono text-sm">Click</kbd>
                    <span className="text-muted-foreground">or</span>
                    <kbd className="px-3 py-1 bg-background border rounded font-mono text-sm">Space</kbd>
                    <span className="text-muted-foreground">Shoot</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <kbd className="px-3 py-1 bg-background border rounded font-mono text-sm">P</kbd>
                    <span className="text-muted-foreground">Pause</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <kbd className="px-3 py-1 bg-background border rounded font-mono text-sm">R</kbd>
                    <span className="text-muted-foreground">Restart (Game Over)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Combo System */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-orbitron font-bold mb-6 border-b border-border pb-2">2. Combo System</h2>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <p className="mb-6 text-muted-foreground">
                  Chaining kills quickly is the key to massive scores. Kill 3 or more enemies within 2 seconds of each other to build your combo multiplier. The multiplier resets if you go 2 seconds without a kill.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { mult: "x2", kills: "3+ Kills", color: "text-blue-400" },
                    { mult: "x3", kills: "10+ Kills", color: "text-green-400" },
                    { mult: "x5", kills: "25+ Kills", color: "text-yellow-400" },
                    { mult: "x10", kills: "50+ Kills", color: "text-red-400 animate-pulse" },
                  ].map((level, i) => (
                    <div key={i} className="text-center p-4 rounded-lg bg-background border border-border">
                      <div className={`text-3xl font-black font-orbitron mb-1 ${level.color}`}>{level.mult}</div>
                      <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{level.kills}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Power-ups */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-orbitron font-bold mb-6 border-b border-border pb-2">3. Power-ups</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: "⚡", name: "Speed Boost", desc: "Doubles movement speed", dur: "8 seconds" },
                { icon: "🔫", name: "Rapid Fire", desc: "3× fire rate", dur: "6 seconds" },
                { icon: "🛡️", name: "Shield", desc: "Absorbs next hit", dur: "Until hit" },
                { icon: "💣", name: "Nuke", desc: "Clears all enemies instantly", dur: "One-time use" },
              ].map((p, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-4 flex gap-4 items-start">
                    <div className="text-3xl p-3 bg-background rounded-xl border border-border">
                      <span aria-hidden="true">{p.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-lg">{p.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">{p.desc}</p>
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                        Duration: {p.dur}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Pro Tips */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-orbitron font-bold mb-6 border-b border-border pb-2">4. Pro Tips</h2>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {[
                    "Keep moving in circles. Never stop in the center of the arena.",
                    "Save Nukes for Boss Waves (every 5 levels) if possible.",
                    "Prioritize Red Blobs — their speed makes them the deadliest normal enemy.",
                    "Don't get greedy for Golden Blobs if it means breaking your combo multiplier.",
                    "Use the screen edges. Enemies wrap around, so shooting off-screen can hit enemies behind you."
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="font-orbitron font-bold text-primary shrink-0">0{i + 1}</span>
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
