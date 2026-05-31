import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CommitEntry { sha: string; message: string; timestamp: string; }
interface BuildEntry { date: string; commits: CommitEntry[]; }
interface ChangelogData { generated: string; builds: BuildEntry[]; }

type Category = "all" | "gameplay" | "ui" | "blockchain" | "fixes";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all",        label: "Semua"      },
  { id: "gameplay",   label: "Gameplay"   },
  { id: "ui",         label: "UI / Design"},
  { id: "blockchain", label: "Blockchain" },
  { id: "fixes",      label: "Bug Fixes"  },
];

const GAMEPLAY_KW   = /blob|boss|enemy|power.?up|squish|game|level|combo|shoot|leaderboard|difficulty|cannon|score|wave|nuke|freeze|crit|frenzy|mining.?agent|2p|multiplayer|powerup|kill|bullet|projectile|spawn|health/i;
const UI_KW         = /nav|footer|hero|homepage|home.?page|landing|animation|visual|design|layout|banner|marquee|badge|font|style|icon|button|dark|ui|ux|responsive|mobile.?menu|hamburger|scroll|glassmorphic|ticker|card/i;
const BLOCKCHAIN_KW = /solana|blockchain|token|wallet|nft|on.?chain|\$squish|spl|mining|crypto|web3|defi|smart.?contract/i;

function categorize(msg: string): Category[] {
  const cats: Category[] = [];
  const lower = msg.toLowerCase();
  if (/^fix/.test(lower)) cats.push("fixes");
  if (GAMEPLAY_KW.test(lower))   cats.push("gameplay");
  if (UI_KW.test(lower))         cats.push("ui");
  if (BLOCKCHAIN_KW.test(lower)) cats.push("blockchain");
  if (cats.length === 0) cats.push("ui");
  return cats;
}

function parseCommit(msg: string) {
  const m = msg.match(/^(\w+)(?:\([^)]+\))?:\s*(.+)$/);
  if (m) return { type: m[1].toLowerCase(), title: m[2] };
  return { type: "", title: msg };
}

function toSentence(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] + ".";
  return items.slice(0, -1).join(", ") + ", dan " + items[items.length - 1] + ".";
}

function buildSummary(commits: CommitEntry[], activeFilter: Category) {
  const feats: string[] = [];
  const fixes: string[] = [];

  commits.forEach(c => {
    const { type, title } = parseCommit(c.message);
    const cats = categorize(c.message);
    if (activeFilter !== "all" && !cats.includes(activeFilter)) return;
    if (type === "feat" || type === "ci" || type === "refactor" || type === "perf") feats.push(title);
    else if (type === "fix") fixes.push(title);
    else if (!type) feats.push(title);
  });

  return { feats, fixes };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function Changelog() {
  const [data, setData]       = useState<ChangelogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [active, setActive]   = useState<Category>("all");

  useEffect(() => {
    fetch("/changelog.json", { cache: "no-store" })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: ChangelogData) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const hasContent = (build: BuildEntry) => {
    const { feats, fixes } = buildSummary(build.commits, active);
    return feats.length > 0 || fixes.length > 0;
  };

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="mb-10"
        >
          <p className="font-mono text-xs text-primary/60 tracking-widest mb-3">SQUISHEM.FUN</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-4">Changelog</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
            Ringkasan update terbaru. Kami terus improve setiap hari.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-3 py-1.5 rounded-full font-mono text-[11px] tracking-wide border transition-all duration-200 ${
                active === cat.id
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "bg-white/4 border-white/10 text-muted-foreground/60 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* States */}
        {loading && (
          <div className="space-y-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white/8 animate-pulse" />
                <div className="h-3 w-28 bg-white/8 rounded mb-3 animate-pulse" />
                <div className="h-4 w-48 bg-white/6 rounded mb-3 animate-pulse" />
                <div className="space-y-1.5">
                  {[1, 2].map(k => <div key={k} className="h-3 bg-white/5 rounded animate-pulse" style={{ width: `${65 + k * 10}%` }} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="font-mono text-xs text-muted-foreground/40 pl-8">
            Changelog tidak tersedia. Coba lagi nanti.
          </p>
        )}

        {data && (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              className="relative"
            >
              <div className="absolute left-[5px] top-2 bottom-0 w-px bg-white/6" />
              <div className="space-y-12">
                {data.builds.map((build, bi) => {
                  if (!hasContent(build)) return null;
                  const { feats, fixes } = buildSummary(build.commits, active);
                  return (
                    <motion.div
                      key={build.date + active}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: bi * 0.05 }}
                      className="relative pl-8"
                    >
                      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-primary bg-primary/20" />
                      <p className="font-mono text-[11px] text-primary/50 tracking-widest mb-2">
                        {formatDate(build.date)}
                      </p>
                      {feats.length > 0 && (
                        <p className="text-sm text-white/80 leading-relaxed mb-2">
                          {toSentence(feats)}
                        </p>
                      )}
                      {fixes.length > 0 && (
                        <p className="text-xs text-muted-foreground/50 leading-relaxed">
                          <span className="text-yellow-400/60 font-mono text-[10px] mr-1.5">FIXED</span>
                          {toSentence(fixes)}
                        </p>
                      )}
                    </motion.div>
                  );
                }).filter(Boolean)}

                {data.builds.every(b => !hasContent(b)) && (
                  <p className="pl-8 font-mono text-xs text-muted-foreground/35">
                    Belum ada update di kategori ini.
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {data && (
          <div className="mt-14 pt-5 border-t border-white/5">
            <p className="font-mono text-[10px] text-muted-foreground/25">
              Diperbarui:{" "}
              {new Date(data.generated).toLocaleString("id-ID", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
