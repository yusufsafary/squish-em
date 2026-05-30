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
                    <span className="text-muted-foreground">Move</span>
                    <span className="text-white bg-white/10 px-2 rounded">W A S D</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Shoot</span>
                    <span className="text-white bg-white/10 px-2 rounded">Arrows / Mouse Click</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Pause</span>
                    <span className="text-white bg-white/10 px-2 rounded">P / ESC</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-card rounded-lg border border-white/10">
                <h3 className="font-bold mb-4">TOUCH (Mobile)</h3>
                <ul className="space-y-3 font-mono text-sm">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-muted-foreground">Left Side</span>
                    <span className="text-white">Virtual Joystick (Move)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Right Side</span>
                    <span className="text-white">Virtual Joystick (Aim/Shoot)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-6 text-accent flex items-center gap-3">
              <span className="w-6 h-1 bg-accent inline-block" /> COMBO SYSTEM
            </h2>
            <p className="text-muted-foreground mb-6">String kills together rapidly to build your multiplier. Don't take damage or the combo resets!</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-card/50 p-4 rounded border border-white/5">
                <div className="font-display font-black text-2xl w-16 text-center">x2</div>
                <div className="flex-1">
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-white w-1/3" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono mt-2 block">10 KILLS</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-card/50 p-4 rounded border border-accent/20">
                <div className="font-display font-black text-2xl w-16 text-center text-accent">x3</div>
                <div className="flex-1">
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-2/3" />
                  </div>
                  <span className="text-xs text-accent/70 font-mono mt-2 block">25 KILLS</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-card/50 p-4 rounded border border-destructive/30 glow-box-green relative overflow-hidden" style={{ borderColor: 'var(--color-destructive)'}}>
                <div className="absolute inset-0 bg-destructive/10 animate-pulse pointer-events-none" />
                <div className="font-display font-black text-2xl w-16 text-center text-destructive z-10">x5</div>
                <div className="flex-1 z-10">
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-destructive w-full" />
                  </div>
                  <span className="text-xs text-destructive font-mono mt-2 block">50 KILLS MAX TIER</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-6 text-primary flex items-center gap-3">
              <span className="w-6 h-1 bg-primary inline-block" /> POWER-UPS
            </h2>
            <p className="font-mono text-sm mb-6 text-muted-foreground">BASE DROP RATE: 15%</p>
            <div className="grid md:grid-cols-2 gap-4">
              <PowerUp icon="🔥" name="Rapid Fire" desc="0.5s → 0.15s fire rate. Lasts 8s." color="360 100% 71%" />
              <PowerUp icon="✦" name="Triple Shot" desc="3 spread projectiles per shot. Lasts 8s." color="215 100% 65%" />
              <PowerUp icon="🛡" name="Shield" desc="Absorbs next hit entirely. Lasts 10s." color="127 49% 60%" />
              <PowerUp icon="×2" name="Score Multiplier" desc="Doubles all points (Stacks!). Lasts 10s." color="48 100% 62%" />
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
      <div className="w-12 h-12 rounded bg-background flex items-center justify-center text-xl" style={{ boxShadow: `0 0 15px hsl(${color} / 0.2)`, color: `hsl(${color})`}}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold font-display" style={{ color: `hsl(${color})` }}>{name}</h4>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
