import { HeroCanvas } from "@/components/hero-canvas";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { motion } from "framer-motion";

export default function Home() {
  const { ref: featuresRef, visible: featuresVisible } = useScrollReveal();
  const { ref: rosterRef, visible: rosterVisible } = useScrollReveal();
  const { ref: roadmapRef, visible: roadmapVisible } = useScrollReveal();

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[90vh] text-center px-4 py-20">
        <HeroCanvas />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium text-sm mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            HTML5 CANVAS GAME
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-black leading-none tracking-tighter flex flex-col"
          >
            <span className="text-primary glow-text-green">SQUISH</span>
            <span className="text-white">'EM!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-4"
          >
            Shoot blobs. Chain combos. Survive the boss waves. Zero installs —
            runs in any browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Link href="/play">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg font-orbitron bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
                data-testid="hero-play-btn"
              >
                Play Now — It's Free
              </Button>
            </Link>
            <Link href="/how-to-play">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 text-lg font-orbitron border-primary/50 text-primary hover:bg-primary/10"
              >
                How to Play
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex gap-4 mt-16 flex-wrap justify-center"
          >
            {[
              { color: "text-[#6BCB77]", bg: "bg-[#6BCB77]/20", label: "Common", delay: "delay-100" },
              { color: "text-[#4D96FF]", bg: "bg-[#4D96FF]/20", label: "Slow", delay: "delay-200" },
              { color: "text-[#FF6B6B]", bg: "bg-[#FF6B6B]/20", label: "Fast", delay: "delay-300" },
              { color: "text-[#FFD93D]", bg: "bg-[#FFD93D]/20", label: "Rare", delay: "delay-400" },
            ].map((blob, i) => (
              <div
                key={i}
                className={`blob-float ${blob.delay} flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border border-border bg-card`}
              >
                <div className={`w-10 h-10 rounded-full ${blob.bg} flex items-center justify-center`}>
                  <div className={`w-6 h-6 rounded-full ${blob.color.replace('text', 'bg')}`} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${blob.color}`}>
                  {blob.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card py-12 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "4", label: "ENEMY TYPES" },
              { val: "4", label: "POWER-UPS" },
              { val: "∞", label: "LEVELS" },
              { val: "0", label: "DEPENDENCIES" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl font-orbitron font-bold text-primary glow-text-green">
                  {stat.val}
                </span>
                <span className="text-sm font-medium text-muted-foreground tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 container mx-auto px-4" ref={featuresRef}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-4">Core Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need for an addictive arcade experience, built straight into the browser.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "⚡",
              title: "Combo Multiplier",
              desc: "Kill 3+ blobs quickly for 2x-10x score multipliers",
            },
            {
              icon: "💀",
              title: "Boss Waves",
              desc: "Every 5 levels a mega boss spawns with unique patterns",
            },
            {
              icon: "🎵",
              title: "Procedural Audio",
              desc: "Web Audio API generates all sounds dynamically",
            },
            {
              icon: "🎮",
              title: "Zero Install",
              desc: "Pure HTML5 Canvas. No framework, no deps, runs everywhere",
            },
            {
              icon: "⚡",
              title: "Instant Play",
              desc: "Click and play in under 2 seconds. No loading screen.",
            },
            {
              icon: "📱",
              title: "Mobile Ready",
              desc: "Touch controls fully supported for on-the-go squishing",
            },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={featuresVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full bg-card/50 border-border/50 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(107,203,119,0.15)] group">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-2xl border border-border group-hover:border-primary/50 transition-colors">
                    <span aria-hidden="true">{feat.icon}</span>
                  </div>
                  <h3 className="text-xl font-orbitron font-bold">{feat.title}</h3>
                  <p className="text-muted-foreground">{feat.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enemy Roster */}
      <section className="py-24 bg-card/30 border-y border-border" ref={rosterRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-4">Know Your Enemy</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Different blobs require different tactics. Learn their patterns.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                emoji: "🟢",
                name: "Green Blob",
                hp: "1",
                speed: "Slow",
                pts: "10",
                badge: "Common",
                border: "border-[#6BCB77]",
                bg: "bg-[#6BCB77]/10",
              },
              {
                emoji: "🔵",
                name: "Blue Blob",
                hp: "2",
                speed: "Very Slow",
                pts: "20",
                badge: "Unlocks Lv 3",
                border: "border-[#4D96FF]",
                bg: "bg-[#4D96FF]/10",
              },
              {
                emoji: "🔴",
                name: "Red Blob",
                hp: "1",
                speed: "Fast",
                pts: "30",
                badge: "Unlocks Lv 5",
                border: "border-[#FF6B6B]",
                bg: "bg-[#FF6B6B]/10",
              },
              {
                emoji: "⭐",
                name: "Golden Blob",
                hp: "1",
                speed: "Medium",
                pts: "100",
                badge: "Rare",
                border: "border-[#FFD93D]",
                bg: "bg-[#FFD93D]/10",
              },
              {
                emoji: "💀",
                name: "Boss Blob",
                hp: "10",
                speed: "Variable",
                pts: "500",
                badge: "Every 5 Levels",
                border: "border-[#845EC2]",
                bg: "bg-[#845EC2]/10",
              },
            ].map((enemy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={rosterVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border ${enemy.border} ${enemy.bg} p-6 flex flex-col items-center text-center gap-4`}
              >
                <Badge variant="outline" className={`absolute top-3 right-3 bg-background/50 ${enemy.border} whitespace-nowrap`}>
                  {enemy.badge}
                </Badge>
                <div className="text-6xl mt-4 blob-float" style={{ animationDelay: `${i * 200}ms` }}>
                  <span aria-hidden="true">{enemy.emoji}</span>
                </div>
                <h3 className="font-orbitron font-bold text-lg">{enemy.name}</h3>
                <div className="w-full space-y-2 mt-auto pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">HP</span>
                    <span className="font-bold">{enemy.hp}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Speed</span>
                    <span className="font-bold">{enemy.speed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pts</span>
                    <span className="font-bold">{enemy.pts}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 container mx-auto px-4" ref={roadmapRef} data-testid="roadmap-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-4">Development Roadmap</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The journey from pure HTML5 canvas to the future of Web3 gaming.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[20px] md:left-[28px] top-0 bottom-0 w-1 bg-border rounded-full overflow-hidden">
            <motion.div 
              className="w-full bg-primary"
              initial={{ height: 0 }}
              animate={roadmapVisible ? { height: '100%' } : {}}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <div className="space-y-16">
            {[
              {
                id: "roadmap-phase-1",
                color: "bg-primary shadow-[0_0_15px_rgba(107,203,119,0.6)]",
                textColor: "text-primary",
                title: "Phase 1 — Beta Launch",
                date: "May 2026",
                badge: "LIVE NOW",
                badgeStyle: "bg-primary/20 text-primary border-primary animate-pulse",
                items: [
                  "Web version live",
                  "Core gameplay (blobs, combos, bosses, power-ups)",
                  "Leaderboard system",
                  "Browser PWA support"
                ]
              },
              {
                id: "roadmap-phase-2",
                color: "bg-[#FFD93D] shadow-[0_0_15px_rgba(255,217,61,0.6)]",
                textColor: "text-[#FFD93D]",
                title: "Phase 2 — Mobile Launch",
                date: "June 2026",
                badge: "COMING SOON",
                badgeStyle: "bg-[#FFD93D]/20 text-[#FFD93D] border-[#FFD93D]",
                items: [
                  "Android APK on Google Play Store",
                  "iOS app on Apple App Store",
                  "Touch-optimized mobile controls",
                  "Push notifications for daily challenges"
                ]
              },
              {
                id: "roadmap-phase-3",
                color: "bg-[#845EC2] shadow-[0_0_15px_rgba(132,94,194,0.6)]",
                textColor: "text-[#845EC2]",
                title: "Phase 3 — Solana Blockchain",
                date: "Q3 2026",
                badge: "ROADMAP",
                badgeStyle: "bg-[#845EC2]/20 text-[#845EC2] border-[#845EC2]",
                items: [
                  "On-chain leaderboard powered by Solana",
                  "SQUISH token (SPL token) — earn by playing",
                  "NFT Blob skins — mint your unique blob",
                  "Wallet connect (Phantom, Solflare)",
                  "Tournament system with SOL prize pools"
                ]
              }
            ].map((phase, i) => (
              <motion.div
                key={i}
                data-testid={phase.id}
                initial={{ opacity: 0, x: 20 }}
                animate={roadmapVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.3 }}
                className="relative pl-16 md:pl-24"
              >
                <div className={`absolute left-0 top-1 w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-background flex items-center justify-center font-orbitron font-bold text-background ${phase.color}`}>
                  {i + 1}
                </div>
                
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border/50 pb-4">
                      <div>
                        <h3 className={`font-orbitron font-bold text-xl md:text-2xl ${phase.textColor}`}>
                          {phase.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">{phase.date}</p>
                      </div>
                      <Badge variant="outline" className={`px-3 py-1 font-bold tracking-wider ${phase.badgeStyle}`}>
                        {phase.badge}
                      </Badge>
                    </div>
                    
                    <ul className="space-y-3">
                      {phase.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className={`mt-0.5 ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                            {i === 0 ? '✓' : '○'}
                          </span>
                          <span className={i === 0 ? 'text-foreground' : 'text-muted-foreground'}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center pl-16 md:pl-24">
            <Link href="/roadmap" className="text-primary hover:underline font-orbitron font-medium inline-flex items-center gap-2">
              View Full Roadmap →
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-orbitron font-bold mb-6">Powered By</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {["HTML5 Canvas", "Web Audio API", "Vanilla JavaScript", "Zero Dependencies", "Mobile Touch", "PWA Ready", "Solana Web3 (coming)"].map((tech, i) => (
              <Badge key={i} variant="secondary" className="px-4 py-2 text-sm bg-background border-border text-foreground hover:bg-background/80">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden flex justify-center items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(107,203,119,0.15)_0%,transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-4">Ready to Squish?</h2>
          <p className="text-xl text-muted-foreground mb-8">Join thousands of players — no account required.</p>
          <Link href="/play">
            <Button size="lg" className="h-16 px-12 text-xl font-orbitron bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(107,203,119,0.3)]">
              Play Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
