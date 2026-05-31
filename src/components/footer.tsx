import { Link } from "wouter";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-background/50 overflow-hidden mt-0">
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
