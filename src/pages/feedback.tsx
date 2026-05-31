import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "wouter";

function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type Category = "bug" | "crash" | "suggestion" | "other";

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "bug", label: "Bug", icon: "🐛" },
  { id: "crash", label: "Crash", icon: "💥" },
  { id: "suggestion", label: "Suggestion", icon: "💡" },
  { id: "other", label: "Other", icon: "💬" },
];

function getDeviceInfo() {
  const ua = navigator.userAgent;
  const android = ua.match(/Android\s([0-9.]+)/)?.[1];
  const screen = `${window.screen.width}×${window.screen.height}`;
  const browser = ua.includes("Chrome") ? "Chrome" : ua.includes("Firefox") ? "Firefox" : ua.includes("Safari") ? "Safari" : "Browser";
  return {
    android: android ? `Android ${android}` : null,
    screen,
    browser,
  };
}

function buildTweet(category: Category, message: string, score: string, device: ReturnType<typeof getDeviceInfo>) {
  const catIcon = CATEGORIES.find(c => c.id === category)?.icon ?? "💬";
  const catLabel = CATEGORIES.find(c => c.id === category)?.label ?? "Feedback";
  const deviceLine = [device.android, device.browser, device.screen].filter(Boolean).join(" · ");
  const scoreLine = score ? `Score: ${score}` : null;

  const parts = [
    `@oroimho [${catLabel.toUpperCase()}] ${catIcon}`,
    message.trim(),
    scoreLine,
    deviceLine ? `Device: ${deviceLine}` : null,
    "",
    "$SQUISH @orynth",
    "#SquishEm",
  ].filter(Boolean);

  return parts.join("\n");
}

export default function Feedback() {
  const [category, setCategory] = useState<Category>("bug");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState("");
  const [device, setDevice] = useState<ReturnType<typeof getDeviceInfo> | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setDevice(getDeviceInfo());
  }, []);

  const tweet = device ? buildTweet(category, message, score, device) : "";
  const tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet);
  const dmUrl = "https://x.com/messages/compose?recipient_id=oroimho&text=" + encodeURIComponent(tweet);

  const canSend = message.trim().length >= 5;

  const handleTweet = () => {
    window.open(tweetUrl, "_blank", "width=560,height=420,noopener,noreferrer");
    setSent(true);
  };

  const handleDm = () => {
    window.open(dmUrl, "_blank", "width=560,height=500,noopener,noreferrer");
    setSent(true);
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]"
          style={{
            background:
              "radial-gradient(ellipse at center top, hsl(127 49% 60% / 0.04) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <Link
            href="/beta"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/50 hover:text-primary transition-colors tracking-widest"
          >
            ← BACK TO BETA
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <p className="font-mono text-[10px] text-primary/60 tracking-widest mb-3">
            SEND FEEDBACK
          </p>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white mb-3">
            Tell @oroimho
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Found a bug, got a crash, or have an idea? Your report goes directly
            to the founder — device info is attached automatically.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-6 mb-4"
          style={{
            background: "linear-gradient(135deg, hsl(232 28% 16%) 0%, hsl(232 30% 19%) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Category */}
          <div className="mb-6">
            <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest mb-3">
              CATEGORY
            </p>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-display font-bold tracking-wide transition-all duration-200 ${
                    category === c.id
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-white/8 bg-white/3 text-muted-foreground hover:border-white/15 hover:text-white"
                  }`}
                >
                  <span className="text-base leading-none">{c.icon}</span>
                  <span className="text-[9px]">{c.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-5">
            <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest mb-3">
              DESCRIBE THE ISSUE
            </p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="What happened? Be as specific as possible — level reached, what you tapped, what went wrong..."
              rows={4}
              maxLength={240}
              className="w-full rounded-xl border border-white/8 bg-white/4 text-sm text-white placeholder:text-muted-foreground/30 px-4 py-3 resize-none focus:outline-none focus:border-primary/40 transition-colors leading-relaxed"
            />
            <p className="mt-1 text-right font-mono text-[9px] text-muted-foreground/30">
              {message.length}/240
            </p>
          </div>

          {/* Score (optional) */}
          <div className="mb-6">
            <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest mb-3">
              YOUR SCORE <span className="text-muted-foreground/30">(optional)</span>
            </p>
            <input
              type="number"
              value={score}
              onChange={e => setScore(e.target.value)}
              placeholder="e.g. 12400"
              className="w-full rounded-xl border border-white/8 bg-white/4 text-sm text-white placeholder:text-muted-foreground/30 px-4 py-3 focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          {/* Device info preview */}
          {device && (
            <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3 mb-6">
              <p className="font-mono text-[9px] text-muted-foreground/40 tracking-widest mb-1.5">
                AUTO-ATTACHED DEVICE INFO
              </p>
              <p className="text-xs text-muted-foreground/60">
                {[device.android, device.browser, device.screen].filter(Boolean).join(" · ")}
              </p>
            </div>
          )}

          {/* Tweet preview */}
          {message.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl border border-white/8 bg-white/3 p-4 mb-6 overflow-hidden"
            >
              <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest mb-2">
                PREVIEW
              </p>
              <p className="text-xs text-muted-foreground/80 leading-relaxed whitespace-pre-line">
                {tweet}
              </p>
            </motion.div>
          )}

          {/* Send buttons */}
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <p className="text-primary font-display font-bold text-sm tracking-wide mb-1">
                ✓ Thanks for the report!
              </p>
              <p className="text-xs text-muted-foreground">
                @oroimho will see it and get back to you.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleTweet}
                disabled={!canSend}
                className="inline-flex items-center justify-center gap-2.5 text-white px-6 py-3.5 rounded-xl font-display font-bold text-sm tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: canSend
                    ? "linear-gradient(135deg, #1d9bf0 0%, #0d8de3 100%)"
                    : "rgba(255,255,255,0.05)",
                  boxShadow: canSend ? "0 4px 20px rgba(29,155,240,0.3)" : "none",
                }}
              >
                <XLogo className="w-4 h-4" />
                TWEET @oroimho
              </button>

              <button
                onClick={handleDm}
                disabled={!canSend}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-sm tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: canSend ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)",
                }}
              >
                <XLogo className="w-4 h-4" />
                SEND AS DM INSTEAD
              </button>

              {!canSend && (
                <p className="text-center font-mono text-[9px] text-muted-foreground/30 tracking-wide">
                  Describe the issue first (at least 5 characters)
                </p>
              )}
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center font-mono text-[10px] text-muted-foreground/25 tracking-wide"
        >
          SQUISH 'EM · ANDROID TESTING PHASE · FEEDBACK DIRECT TO FOUNDER
        </motion.p>
      </div>
    </main>
  );
}
