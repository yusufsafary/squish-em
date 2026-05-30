import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4">
            The Roadmap
          </h1>
          <p className="text-xl text-muted-foreground">
            Our vision for the future of SQUISH 'EM!
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Phase 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card border-primary/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
              <CardContent className="p-8 md:p-10 pl-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-orbitron font-bold text-primary mb-2">Phase 1: Beta Launch</h2>
                    <p className="text-muted-foreground">May 2026 — Establishing the foundation</p>
                  </div>
                  <Badge className="w-fit bg-primary/20 text-primary border border-primary animate-pulse text-sm px-4 py-1">
                    LIVE NOW
                  </Badge>
                </div>
                
                <p className="mb-6 text-foreground">
                  The initial release focuses on perfect, frictionless gameplay. We built a custom engine on the HTML5 Canvas to ensure it runs instantly on any device without frameworks or loading screens weighing it down.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Web version live on main domain",
                    "Core gameplay loop optimized",
                    "4 enemy types + procedural boss system",
                    "Power-up system fully integrated",
                    "Global leaderboard database",
                    "PWA support for mobile home screens"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs shrink-0">✓</div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Phase 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card border-[#FFD93D]/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#FFD93D]" />
              <CardContent className="p-8 md:p-10 pl-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-orbitron font-bold text-[#FFD93D] mb-2">Phase 2: Mobile Launch</h2>
                    <p className="text-muted-foreground">June 2026 — Native app experiences</p>
                  </div>
                  <Badge variant="outline" className="w-fit text-[#FFD93D] border-[#FFD93D] text-sm px-4 py-1">
                    COMING SOON
                  </Badge>
                </div>
                
                <p className="mb-6 text-foreground">
                  While the web version works on mobile, a native app allows us to push hardware acceleration further and tap into native push notifications for daily challenges.
                </p>

                <div className="flex gap-4 mb-8">
                  <div className="px-4 py-2 bg-background border border-border rounded-lg font-bold text-sm">Google Play</div>
                  <div className="px-4 py-2 bg-background border border-border rounded-lg font-bold text-sm">App Store</div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Android APK production",
                    "iOS native wrapper",
                    "Virtual joystick controls",
                    "Haptic feedback integration",
                    "Daily challenge system",
                    "Offline play mode sync"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border border-muted-foreground flex items-center justify-center text-muted-foreground text-xs shrink-0">○</div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Phase 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card border-[#845EC2]/50 relative overflow-hidden shadow-[0_0_30px_rgba(132,94,194,0.1)]">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#845EC2]" />
              <CardContent className="p-8 md:p-10 pl-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-orbitron font-bold text-[#845EC2] mb-2">Phase 3: Web3 Integration</h2>
                    <p className="text-muted-foreground">Q3 2026 — The economy update</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#9945FF] uppercase tracking-wider">Powered by Solana</span>
                    <Badge variant="outline" className="w-fit text-[#845EC2] border-[#845EC2] text-sm px-4 py-1">
                      IN DESIGN
                    </Badge>
                  </div>
                </div>
                
                <p className="mb-6 text-foreground">
                  Transforming high scores into real value. By integrating with the Solana blockchain, we're building a blazing fast micro-economy without sacrificing the instant-play nature of the game.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Solana wallet connect (Phantom, Solflare)",
                    "On-chain immutable leaderboards",
                    "$SQUISH SPL Token launch",
                    "Play-to-earn token emissions",
                    "NFT Blob skins (Mint your unique avatar)",
                    "Weekend tournaments with SOL prize pools"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border border-[#845EC2]/50 flex items-center justify-center text-[#845EC2]/50 text-xs shrink-0">○</div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
