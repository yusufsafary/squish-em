import { motion } from "framer-motion";
import { Link } from "wouter";

const PARAGRAPHS = [
  {
    heading: "What Is SQUISH 'EM!",
    body: `SQUISH 'EM! is an HTML5 canvas arcade game in which the player eliminates waves of procedurally animated blobs in exchange for score multipliers and, eventually, on-chain rewards denominated in $SQUISH on the Solana network. It runs entirely in the browser, requires no installation, and was built by a single developer who appears to have significantly underestimated how long the project would take. This is, we are told, how most good things happen.`,
  },
  {
    heading: "The Creator",
    body: `The individual responsible for all of the above is Yusuf Safary, known online as @oroimho. He is a solo developer who derives satisfaction from building systems that are simultaneously technically interesting and playable by people who have never heard the words "reinforcement learning" and do not particularly need to. His X profile at x.com/oroimho documents the development process with the candor of someone who has long since stopped pretending that shipping software is a dignified activity. It is recommended reading.`,
  },
  {
    heading: "Platform: Orynth",
    body: `SQUISH 'EM! is published under Orynth, a developer portfolio and project showcase platform found at orynth.dev. The project's canonical profile lives at orynth.dev/projects/squishem, where metadata, status updates, and version history are maintained with somewhat more discipline than the development changelog would suggest. Orynth serves as the public record of what was built, while the game itself serves as evidence that it works. Both are, in the considered judgment of the author, preferable to a slide deck.`,
  },
  {
    heading: "How It Works",
    body: `At its core the game embeds a reinforcement learning agent trained to play autonomously, which does so every 130 milliseconds using a Q-network over a compact state vector. The RL agent also mines $SQUISH tokens on behalf of idle users, which is either a novel monetization mechanism or a very small robot doing chores depending on your philosophical orientation. All game logic runs client-side with zero backend latency during gameplay. The Android build is a packaged PWA, which means it is still the same game, just wearing a slightly different hat.`,
  },
  {
    heading: "A Note on Scope",
    body: `This project was not built by a team, a studio, a startup, or a committee. It was built by one person using freely available tools, documented APIs, and what can only be described as an unreasonable commitment to the bit. If you enjoy it, the appropriate response is to share it. If you encounter a bug, the /feedback page exists for exactly that purpose. If you wish to discuss any of the above, @oroimho is on X and does respond, eventually, once he finishes squishing blobs.`,
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12">
            <p className="font-mono text-xs text-primary/70 tracking-widest mb-3 uppercase">
              About
            </p>
            <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
              SQUISH 'EM!
            </h1>
            <p className="text-white/50 font-mono text-sm">
              A brief and mostly accurate account of what this is and who made it.
            </p>
          </div>

          <div className="space-y-12">
            {PARAGRAPHS.map((p, i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
                className="border-l-2 border-primary/20 pl-6"
              >
                <h2 className="font-display font-bold text-lg text-white mb-3">
                  {p.heading}
                </h2>
                <p className="text-white/65 leading-relaxed text-sm md:text-base">
                  {p.body}
                </p>
              </motion.section>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-16 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          >
            <a
              href="https://x.com/oroimho"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-white/45 hover:text-primary transition-colors"
            >
              @oroimho on X
            </a>
            <span className="hidden sm:block text-white/15">|</span>
            <a
              href="https://www.orynth.dev/projects/squishem"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-white/45 hover:text-primary transition-colors"
            >
              orynth.dev/projects/squishem
            </a>
            <span className="hidden sm:block text-white/15">|</span>
            <Link
              href="/feedback"
              className="font-mono text-xs text-white/45 hover:text-primary transition-colors"
            >
              Submit Feedback
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
