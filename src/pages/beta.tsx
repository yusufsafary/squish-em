import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const APK_URL = "https://github.com/yusufsafary/squish-em/releases/download/beta-latest/squish-em-beta.apk";
const TWEET_TEXT = encodeURIComponent(
  `I'm downloading the SQUISH 'EM Beta APK! 🟥👑\n\nFree blob-squishing arcade game — browser + Android.\n\nhttps://squishem.fun/beta\n\n#SquishEm #GameDev #IndieGame`
);
const TWEET_URL = `https://twitter.com/intent/tweet?text=${TWEET_TEXT}`;
const STORAGE_KEY = "squish_beta_tweeted";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Beta() {
  const [tweeted, setTweeted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setTweeted(true);
  }, []);

  const handleTweet = () => {
    window.open(TWEET_URL, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      setTweeted(true);
      localStorage.setItem(STORAGE_KEY, "1");
    }, 1500);
  };

  const handleDownload = () => {
    setDownloading(true);
    const a = document.createElement("a");
    a.href = APK_URL;
    a.download = "squish-em-beta.apk";
    a.click();
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, hsl(48 100% 62% / 0.08) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, hsl(127 49% 60% / 0.07) 0%, transparent 65%)" }}
        />
      </div>

      <div className="w-full max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/8 text-amber-400 px-4 py-1.5 rounded-full font-mono text-[11px] tracking-widest mb-5"
          >
            <motion.span
              animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"
              style={{ boxShadow: "0 0 8px #f59e0b" }}
            />
            EARLY ACCESS · BETA
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-4 tracking-tight">
            SQUISH<span className="text-amber-400" style={{ textShadow: "0 0 20px rgba(245,158,11,0.6), 0 0 40px rgba(245,158,11,0.3)" }}> 'EM</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-display font-bold text-muted-foreground mb-4 tracking-widest">
            ANDROID BETA APK
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            Play the full game on Android — no Play Store, no wait. Install directly and squish blobs offline.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { label: "SIZE", value: "~4.5 MB", icon: "📦" },
            { label: "ANDROID", value: "8.0+", icon: "🤖" },
            { label: "PRICE", value: "FREE", icon: "✨" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="border border-white/8 rounded-xl bg-card/40 backdrop-blur-sm p-4 text-center"
            >
              <div className="text-xl mb-1">{icon}</div>
              <p className="font-mono text-[9px] text-muted-foreground/60 tracking-widest mb-0.5">{label}</p>
              <p className="font-display font-bold text-white text-xs">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Main action card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden mb-5"
          style={{
            background: "linear-gradient(135deg, hsl(232 28% 16%) 0%, hsl(232 30% 19%) 100%)",
            border: tweeted ? "1px solid hsl(127 49% 60% / 0.3)" : "1px solid hsl(48 100% 62% / 0.2)",
            boxShadow: tweeted
              ? "0 0 40px hsl(127 49% 60% / 0.12), inset 0 1px 0 hsl(127 49% 60% / 0.08)"
              : "0 0 40px hsl(48 100% 62% / 0.08), inset 0 1px 0 hsl(48 100% 62% / 0.06)",
            transition: "border 0.5s ease, box-shadow 0.5s ease",
          }}
        >
          <AnimatePresence mode="wait">
            {!tweeted ? (
              <motion.div
                key="gate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="p-8 md:p-10 text-center"
              >
                <div className="w-20 h-20 rounded-2xl border border-amber-500/25 bg-amber-500/8 flex items-center justify-center mx-auto mb-6">
                  <XIcon className="w-9 h-9 text-amber-400" />
                </div>

                <h3 className="font-display font-black text-2xl text-white mb-2">TWEET TO UNLOCK</h3>
                <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto leading-relaxed">
                  Help spread the word about SQUISH 'EM, then unlock your free Beta APK instantly.
                </p>

                <button
                  onClick={handleTweet}
                  className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-xl font-display font-bold text-sm tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 mb-4"
                  style={{
                    background: "linear-gradient(135deg, #1d9bf0 0%, #0d8de3 100%)",
                    boxShadow: "0 4px 24px rgba(29,155,240,0.4), 0 0 0 1px rgba(29,155,240,0.2)",
                  }}
                >
                  <XIcon className="w-4 h-4" />
                  POST ON X TO DOWNLOAD
                </button>

                <p className="font-mono text-[10px] text-muted-foreground/40 tracking-wide">
                  X (Twitter) will open in a new tab — come back after posting
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 md:p-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.1 }}
                  className="w-20 h-20 rounded-2xl border border-primary/35 bg-primary/12 flex items-center justify-center mx-auto mb-6"
                  style={{ boxShadow: "0 0 30px hsl(127 49% 60% / 0.2)" }}
                >
                  <svg className="w-9 h-9 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h3 className="font-display font-black text-2xl text-white mb-2">DOWNLOAD UNLOCKED!</h3>
                  <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
                    Thanks for sharing! Tap below to get your Beta APK.
                  </p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-sm tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mb-4 text-primary-foreground bg-primary"
                  style={{ boxShadow: "0 4px 24px hsl(127 49% 60% / 0.4), 0 0 0 1px hsl(127 49% 60% / 0.2)" }}
                >
                  {downloading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      />
                      STARTING DOWNLOAD...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      DOWNLOAD APK
                    </>
                  )}
                </motion.button>

                <p className="font-mono text-[10px] text-muted-foreground/40 tracking-wide">
                  squish-em-beta.apk · ~4.5 MB · Android 8.0+
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5"
        >
          <div className="border border-white/8 rounded-xl bg-card/30 p-5">
            <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest mb-3">WHAT'S INSIDE</p>
            <ul className="space-y-2">
              {[
                "Full offline gameplay — no internet needed",
                "All blob types: green, blue, red, gold, phantom, boss",
                "7 upgrade types with progression",
                "Smooth animations & screen shake",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <span className="text-primary mt-0.5 flex-shrink-0">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-white/8 rounded-xl bg-card/30 p-5">
            <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest mb-3">INSTALL GUIDE</p>
            <ol className="space-y-2">
              {[
                "Download the APK file",
                "Settings → Security → Unknown apps",
                "Enable installs from your browser",
                "Tap the APK file and install",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <span className="font-mono text-[9px] text-primary/60 bg-primary/10 rounded px-1.5 py-0.5 flex-shrink-0 font-bold mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center font-mono text-[10px] text-muted-foreground/35 tracking-wide"
        >
          PRE-RELEASE BUILD · BUGS WELCOME · REPORT @squishem_fun
        </motion.p>
      </div>
    </main>
  );
}
