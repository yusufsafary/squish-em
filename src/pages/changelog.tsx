import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CommitEntry { sha: string; message: string; timestamp: string; }
interface BuildEntry { date: string; commits: CommitEntry[]; }
interface ChangelogData { generated: string; builds: BuildEntry[]; }

const TYPE_META: Record<string, { label: string; color: string }> = {
  feat:     { label: "FEAT",     color: "text-primary border-primary/30 bg-primary/8" },
  fix:      { label: "FIX",      color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/8" },
  refactor: { label: "REFACTOR", color: "text-purple-400 border-purple-400/30 bg-purple-400/8" },
  perf:     { label: "PERF",     color: "text-blue-400 border-blue-400/30 bg-blue-400/8" },
  style:    { label: "STYLE",    color: "text-pink-400 border-pink-400/30 bg-pink-400/8" },
  docs:     { label: "DOCS",     color: "text-gray-400 border-gray-400/30 bg-gray-400/8" },
  chore:    { label: "CHORE",    color: "text-gray-500 border-gray-500/20 bg-gray-500/5" },
};

function parseCommit(msg: string): { type: string; scope: string; title: string } {
  const m = msg.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/);
  if (m) return { type: m[1].toLowerCase(), scope: m[2] || "", title: m[3] };
  return { type: "", scope: "", title: msg };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function Changelog() {
  const [data, setData] = useState<ChangelogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/changelog.json")
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: ChangelogData) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="mb-14">
          <p className="font-mono text-xs text-primary/60 tracking-widest mb-3">SQUISHEM.FUN</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-4">Changelog</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
            Every push to production, recorded automatically. Newest first.
          </p>
        </motion.div>

        {loading && (
          <div className="space-y-6">
            {[1,2,3].map(n => (
              <div key={n} className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white/10 bg-white/5 animate-pulse" />
                <div className="h-3 w-24 bg-white/8 rounded mb-3 animate-pulse" />
                <div className="h-5 w-32 bg-white/6 rounded mb-3 animate-pulse" />
                <div className="space-y-2">
                  {[1,2].map(k => <div key={k} className="h-3 bg-white/5 rounded animate-pulse" style={{width:`${60+k*15}%`}} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="pl-8 py-6">
            <p className="font-mono text-xs text-muted-foreground/50">Changelog data unavailable. Check back after the next deployment.</p>
          </div>
        )}

        {data && (
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-0 w-px bg-white/6" />
            <div className="space-y-12">
              {data.builds.map((build, bi) => (
                <motion.div
                  key={build.date}
                  initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                  transition={{duration:0.45,delay:bi*0.06}}
                  className="relative pl-8"
                >
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-primary bg-primary/20" />
                  <p className="font-mono text-xs text-muted-foreground/50 mb-3">{formatDate(build.date)}</p>
                  <h2 className="font-display font-bold text-lg text-white mb-4">
                    {formatDate(build.date).split(" ").slice(0,2).join(" ")}
                  </h2>
                  <ul className="space-y-2.5">
                    {build.commits.map((c, ci) => {
                      const { type, scope, title } = parseCommit(c.message);
                      const meta = TYPE_META[type];
                      if (!meta && type === "chore") return null;
                      return (
                        <li key={ci} className="flex items-start gap-2.5">
                          {meta ? (
                            <span className={`flex-shrink-0 font-mono text-[9px] tracking-widest px-1.5 py-0.5 rounded border mt-0.5 ${meta.color}`}>
                              {meta.label}
                            </span>
                          ) : (
                            <span className="flex-shrink-0 text-primary/40 mt-[3px]">—</span>
                          )}
                          <span className="text-xs text-muted-foreground/80 leading-relaxed">
                            {scope && <span className="text-muted-foreground/50 mr-1">({scope})</span>}
                            {title}
                          </span>
                          <span className="flex-shrink-0 font-mono text-[9px] text-muted-foreground/25 ml-auto mt-0.5">{c.sha}</span>
                        </li>
                      );
                    }).filter(Boolean)}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {data && (
          <div className="mt-12 pt-6 border-t border-white/5">
            <p className="font-mono text-[10px] text-muted-foreground/30">
              Last synced: {new Date(data.generated).toLocaleString("en-GB", {day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
