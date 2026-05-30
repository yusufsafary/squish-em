import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export function Nav() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/how-to-play", label: "Guide" },
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
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary glow-text-green" : "text-muted-foreground"}`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="/play" className="bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2 rounded font-display font-bold text-sm tracking-wider glow-box-green transition-all" data-testid="nav-play-btn">
            PLAY NOW
          </Link>
        </div>
      </div>
    </nav>
  );
}
