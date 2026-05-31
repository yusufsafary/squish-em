import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Nav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/how-to-play", label: "Guide" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/tech", label: "Tech" },
    { href: "/ai-agent", label: "AI Agent" },
    { href: "/changelog", label: "Changelog" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl text-white flex items-center gap-2 group" data-testid="nav-logo">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-4 h-4 rounded-full bg-primary glow-box-green"
          />
          <span className="group-hover:glow-text-green transition-all">SQUISH 'EM!</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-5">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary glow-text-green" : "text-muted-foreground"}`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(" ", "-")}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/play"
            className="hidden md:inline-flex bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2 rounded font-display font-bold text-sm tracking-wider glow-box-green transition-all"
            data-testid="nav-play-btn"
          >
            PLAY NOW
          </Link>

          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }} transition={{ duration: 0.18 }}
              className="block w-5 h-0.5 bg-primary origin-center" />
            <motion.span animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }} transition={{ duration: 0.18 }}
              className="block w-5 h-0.5 bg-primary" />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }} transition={{ duration: 0.18 }}
              className="block w-5 h-0.5 bg-primary origin-center" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-background/96 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium py-3 border-b border-white/5 transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/play"
                onClick={() => setOpen(false)}
                className="mt-3 bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-3 rounded font-display font-bold text-sm tracking-wider glow-box-green text-center transition-all"
              >
                PLAY NOW
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
