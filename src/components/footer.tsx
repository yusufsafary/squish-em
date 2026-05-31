import { Link } from "wouter";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-background/50 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.022] select-none">
        <span className="font-display font-black text-[18vw] whitespace-nowrap text-white">SQUISH 'EM!</span>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-primary glow-box-green shrink-0" />
              <span className="font-display font-bold text-lg tracking-wide">SQUISH 'EM!</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              AI-powered arcade shooter on Solana. Squish blobs, chain combos, and let the RL agent mine{" "}
              <span className="text-primary/80 font-mono">$SQUISH</span> for you - no install, runs in the browser.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-mono text-muted-foreground/40">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
              <span>SERVERS ONLINE</span>
            </div>
          </div>

          {/* Play */}
          <div>
            <h4 className="font-display font-bold text-[10px] tracking-widest text-muted-foreground/50 mb-4 uppercase">Play</h4>
            <ul className="space-y-3">
              <FooterLink href="/play">🎮 Start Game</FooterLink>
              <FooterLink href="/how-to-play">📖 Game Guide</FooterLink>
              <FooterLink href="/how-to-play#bestiary">🐛 Bestiary</FooterLink>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-display font-bold text-[10px] tracking-widest text-muted-foreground/50 mb-4 uppercase">Discover</h4>
            <ul className="space-y-3">
              <FooterLink href="/about">📄 About</FooterLink>
              <FooterLink href="/roadmap">🗺 Web3 Roadmap</FooterLink>
              <FooterLink href="/tech">🧠 AI Architecture</FooterLink>
              <FooterLink href="/ai-agent">⚡ Live Simulator</FooterLink>
              <li>
                <motion.a
                  href="https://orynth.dev/projects/squishem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                  whileHover={{ x: 2 }}
                >
                  ✨ Orynth Profile
                </motion.a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-xs text-muted-foreground/40 font-mono">© 2026 SQUISH 'EM! - HTML5 Canvas Arcade</span>
            <span className="hidden sm:block text-white/10">|</span>
            <Link href="/cookies" className="text-xs text-muted-foreground/40 hover:text-primary font-mono transition-colors">
              Cookie Policy
            </Link>
            <span className="hidden sm:block text-white/10">|</span>
            <Link href="/legal" className="text-xs text-muted-foreground/40 hover:text-primary font-mono transition-colors">
              Terms of Service
            </Link>
            <span className="hidden sm:block text-white/10">|</span>
            <Link href="/about" className="text-xs text-muted-foreground/40 hover:text-primary font-mono transition-colors">
              About
            </Link>
          </div>
          <motion.a
            href="https://orynth.dev/projects/squishem"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -1 }}
            className="inline-block transition-all"
          >
            <img
              src="https://orynth.dev/api/badge/squishem?theme=light&style=default"
              alt="Featured on Orynth"
              width={140}
              height={44}
              className="rounded-lg opacity-50 hover:opacity-90 transition-opacity"
            />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
        {children}
      </Link>
    </li>
  );
}
