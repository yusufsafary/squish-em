import { motion } from "framer-motion";

const BUILDS = [
  {
    id: 3,
    date: "May 31, 2026",
    status: "scheduled",
    label: "Later today",
    summary: "Third update of the day. Details pending deployment.",
    changes: [],
  },
  {
    id: 2,
    date: "May 31, 2026",
    status: "live",
    label: "Shipped",
    summary:
      "Progressive Web App support added. The site is now installable on Android and iOS, with full offline capability via a registered service worker. Asset caching is handled at the SW layer; push notification infrastructure is in place. The hero background animation was extended — the boss enemy now fires projectiles back at the cannon, with a pre-fire warning pulse and dodge response. A non-intrusive PWA install prompt was introduced, shown once per device. Redundant UI sections were removed from the homepage and footer.",
    changes: [
      "PWA manifest and service worker (offline, installable)",
      "Boss fires projectiles at cannon — warning ring, trail, impact flash",
      "PWA install prompt — Android native + iOS manual instruction",
      "Removed duplicate CTA, Core Features, and How To Play sections",
    ],
  },
  {
    id: 1,
    date: "May 31, 2026",
    status: "live",
    label: "Shipped",
    summary:
      "First production build. Replaced the abstract background animation on the homepage with a live game-character scene: autonomous cannon, falling blob enemies with boss mechanics, laser bullets, explosions, power-up drops, combo text, and a star field. Vercel edge caching was configured — HTML served with no-cache, static assets as immutable. A GitHub Actions workflow was added to purge the Vercel edge cache on every push to main.",
    changes: [
      "Hero canvas — cannon, blob enemies, boss, bullets, particles, power-ups",
      "Vercel cache headers — HTML no-cache, /assets/* immutable",
      "GitHub Actions cache purge workflow on push to main",
      "Initial site structure, routing, and design system",
    ],
  },
];

const STATUS_STYLES: Record<string, string> = {
  live: "text-primary border-primary/30 bg-primary/8",
  scheduled: "text-yellow-400 border-yellow-400/30 bg-yellow-400/8",
};

export default function Changelog() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="font-mono text-xs text-primary/60 tracking-widest mb-3">
            SQUISHEM.FUN
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-4">
            Changelog
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
            A running record of every build shipped to production.
            Entries are listed in reverse chronological order.
          </p>
        </motion.div>

        {/* Entries */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-0 w-px bg-white/6" />

          <div className="space-y-12">
            {BUILDS.map((build, i) => (
              <motion.div
                key={build.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="relative pl-8"
              >
                {/* Dot */}
                <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                  build.status === "live"
                    ? "border-primary bg-primary/20"
                    : "border-yellow-400/60 bg-yellow-400/10"
                }`} />

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span className="font-mono text-xs text-muted-foreground/50">
                    {build.date}
                  </span>
                  <span className={`font-mono text-[10px] tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLES[build.status]}`}>
                    {build.label.toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-display font-bold text-lg text-white mb-3">
                  Build #{build.id}
                </h2>

                {/* Summary */}
                {build.summary && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {build.summary}
                  </p>
                )}

                {/* Change list */}
                {build.changes.length > 0 && (
                  <ul className="space-y-1.5">
                    {build.changes.map((c, ci) => (
                      <li key={ci} className="flex items-start gap-2.5 text-xs text-muted-foreground/70 font-mono">
                        <span className="text-primary/50 mt-[1px] flex-shrink-0">—</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
