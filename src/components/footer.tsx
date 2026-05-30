import { Link } from "wouter";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-background/50 overflow-hidden py-12 mt-20">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
        <span className="font-display font-black text-[15vw] whitespace-nowrap text-white">SQUISH 'EM!</span>
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary glow-box-green" />
          <span className="font-display font-bold text-lg">SQUISH 'EM!</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <Link href="/" className="text-muted-foreground hover:text-primary text-sm transition-colors" data-testid="footer-home">Home</Link>
            <Link href="/how-to-play" className="text-muted-foreground hover:text-primary text-sm transition-colors" data-testid="footer-guide">Guide</Link>
            <Link href="/roadmap" className="text-muted-foreground hover:text-primary text-sm transition-colors" data-testid="footer-roadmap">Web3 Roadmap</Link>
          </div>

          {/* Orynth badge */}
          <motion.a
            href="https://orynth.dev/projects/squishem"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            className="transition-all"
          >
            <img
              src="https://orynth.dev/api/badge/squishem?theme=light&style=default"
              alt="Featured on Orynth"
              width={180}
              height={56}
              className="rounded-lg opacity-80 hover:opacity-100 transition-opacity"
            />
          </motion.a>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Powered by</span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded">HTML5 Canvas</span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded">Vanilla JS</span>
        </div>
      </div>
    </footer>
  );
}
