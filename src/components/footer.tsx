import { Link } from "wouter";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: "∞",  iconColor: "hsl(127 49% 60%)",  title: "Infinite Levels",  desc: "Every 15 kills advances a level. Speed and blob count scale endlessly.", border: "127 49% 60%" },
  { icon: "×4", iconColor: "hsl(360 100% 71%)", title: "Combo System",     desc: "Chain kills to multiply your score up to ×4. Keep the streak or reset.", border: "360 100% 71%" },
  { icon: "⚡", iconColor: "hsl(48 95% 58%)",   title: "6 Power-Ups",      desc: "Rapid Fire, Triple Shot, Shield, ×2 Score, NUKE, FREEZE.", border: "48 95% 58%" },
  { icon: "⚠",  iconColor: "hsl(0 100% 67%)",   title: "Boss Waves",       desc: "Every 5 levels a Boss erupts: 20 HP, projectile attacks, triple reward.", border: "0 100% 67%" },
  { icon: "🏆", iconColor: "hsl(48 100% 62%)",  title: "Hall of Fame",     desc: "Top 5 scores saved locally. Claim your spot on the leaderboard.", border: "48 100% 62%" },
  { icon: "💥", iconColor: "hsl(263 44% 56%)",  title: "Splash Kills",     desc: "Blob deaths deal splash damage to nearby enemies. Chain explosions.", border: "263 44% 56%" },
];

const HOW_TO_PLAY = [
  { n: "01", title: "Move Your Cannon",      desc: "Drag anywhere on the canvas, tap ◀ ▶ buttons, or use Arrow keys on desktop.", color: "127 49% 60%" },
  { n: "02", title: "Auto-Fire & Combo",     desc: "Your cannon fires automatically. Chain kills fast to stack ×1.5 → ×4 multipliers.", color: "263 44% 56%" },
  { n: "03", title: "Survive the Onslaught", desc: "3 lives. Collect power-ups. Dodge boss shots. How far can you go?", color: "48 95% 58%" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-background/50 overflow-hidden mt-0">

      {/* ── Core Features ──────────────────────────────────────────────── */}
      <div className="border-b border-white/5 py-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, hsla(127,49%,60%,0.05), transparent)" }} />
        <div className="absolute top-0 left-0 w-28 h-28 border-l border-t border-primary/8 rounded-tl-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-28 h-28 border-r border-b border-primary/8 rounded-br-xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-xs text-muted-foreground/40 tracking-widest uppercase mb-2 block">— What you get —</span>
            <h3 className="text-2xl font-display font-bold mb-3">CORE FEATURES</h3>
            <div className="w-16 h-0.5 bg-primary mx-auto rounded-full glow-box-green" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          >
            {FEATURES.map(f => (
              <motion.div
                key={f.title}
                variants={{ hidden: { opacity: 0, y: 20, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative p-5 rounded-xl border bg-background/60 backdrop-blur-sm overflow-hidden group"
                style={{ borderColor: `hsl(${f.border} / 0.22)` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, hsl(${f.border} / 0.07), transparent 70%)` }} />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-full"
                  style={{ backgroundColor: `hsl(${f.border} / 0.45)` }} />
                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl font-display font-black mb-3 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `hsl(${f.border} / 0.12)`, color: f.iconColor, boxShadow: `0 0 16px hsl(${f.border} / 0.18)` }}>
                  {f.icon}
                </div>
                <h4 className="font-display font-bold text-sm mb-1.5" style={{ color: f.iconColor }}>{f.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── How To Play ─────────────────────────────────────────────────── */}
      <div className="border-b border-white/5 py-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 80% at 50% 50%, hsla(263,44%,56%,0.04), transparent)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-xs text-muted-foreground/40 tracking-widest uppercase mb-2 block">— Get started in seconds —</span>
            <h3 className="text-2xl font-display font-bold mb-3">HOW TO PLAY</h3>
            <div className="w-16 h-0.5 bg-secondary mx-auto rounded-full" style={{ boxShadow: "0 0 12px hsl(263 44% 56% / 0.4)" }} />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            {HOW_TO_PLAY.map((step, i) => (
              <motion.div
                key={step.n}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -3 }}
                className="relative p-5 rounded-xl border bg-background/50 backdrop-blur-sm"
                style={{ borderColor: `hsl(${step.color} / 0.2)` }}
              >
                <div className="font-display font-black text-4xl mb-3 leading-none select-none" style={{ color: `hsl(${step.color} / 0.12)` }}>{step.n}</div>
                <div className="absolute top-4 left-4 font-mono text-xs font-bold" style={{ color: `hsl(${step.color})` }}>{step.n}</div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-[2px] z-10" style={{ backgroundColor: `hsl(${step.color} / 0.3)` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(${step.color})` }} />
                  </div>
                )}
                <h4 className="font-display font-bold text-xs mb-1.5" style={{ color: `hsl(${step.color})` }}>{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Link href="/how-to-play" className="inline-flex items-center gap-1.5 text-xs font-mono text-secondary/50 hover:text-secondary transition-colors">
              READ FULL GUIDE →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Footer ─────────────────────────────────────────────────── */}
      <div className="py-10 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] select-none">
          <span className="font-display font-black text-[18vw] whitespace-nowrap text-white">SQUISH 'EM!</span>
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-primary glow-box-green" />
                <span className="font-display font-bold text-lg">SQUISH 'EM!</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
                HTML5 Canvas arcade shooter. No download, no login. Pure blobs.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-xs tracking-widest text-muted-foreground mb-4 uppercase">Play</h4>
              <ul className="space-y-2.5">
                <li><Link href="/play" className="text-sm text-muted-foreground hover:text-primary transition-colors">🎮 Start Game</Link></li>
                <li><Link href="/how-to-play" className="text-sm text-muted-foreground hover:text-primary transition-colors">📖 Game Guide</Link></li>
                <li><Link href="/how-to-play#bestiary" className="text-sm text-muted-foreground hover:text-primary transition-colors">🐛 Bestiary</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-xs tracking-widest text-muted-foreground mb-4 uppercase">Discover</h4>
              <ul className="space-y-2.5">
                <li><Link href="/roadmap" className="text-sm text-muted-foreground hover:text-secondary transition-colors">🗺 Web3 Roadmap</Link></li>
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">🏠 Home</Link></li>
                <li>
                  <motion.a href="https://orynth.dev/projects/squishem" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block" whileHover={{ x: 2 }}>
                    ✨ Orynth Profile
                  </motion.a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-xs tracking-widest text-muted-foreground mb-4 uppercase">Built With</h4>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["Canvas 2D", "Web Audio", "rAF", "localStorage", "Touch Events"].map(t => (
                  <span key={t} className="text-xs bg-white/5 border border-white/8 px-2 py-0.5 rounded text-muted-foreground">{t}</span>
                ))}
              </div>
              <motion.a href="https://orynth.dev/projects/squishem" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -1 }} className="inline-block transition-all">
                <img src="https://orynth.dev/api/badge/squishem?theme=light&style=default" alt="Featured on Orynth"
                  width={160} height={50} className="rounded-lg opacity-70 hover:opacity-100 transition-opacity" />
              </motion.a>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground/50">© 2026 SQUISH 'EM! — HTML5 Canvas Arcade</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground/40 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              <span>ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
