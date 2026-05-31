import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";

const APK_URL =
  "https://github.com/yusufsafary/squish-em/releases/download/beta-latest/squish-em-beta.apk";

const TWEET_TEMPLATES = [
  `just found SQUISH 'EM and i can't stop squishing blobs 🟥\n\n@oroimho built this whole thing solo and it goes hard\n\n$SQUISH on @orynth let's gooo 🐛\n\nsquishem.fun/beta`,
  `ok @oroimho really cooked with SQUISH 'EM\n\nfree android beta, no play store, just pure blob-squishing chaos\n\nanyone in $SQUISH on @orynth needs to play this NOW\n\nsquishem.fun/beta`,
  `SQUISH 'EM android beta is actually addictive??\n\ncute blobs falling from the sky and you gotta squish em all\n\nbig respect to @oroimho for building this solo 👑\n\n$SQUISH on @orynth is the move\n\nsquishem.fun/beta`,
  `testing SQUISH 'EM android beta and having way too much fun with this\n\nshoutout @oroimho for the solo build, genuinely impressive\n\nif you're in $SQUISH on @orynth — this one's for you 💚\n\nsquishem.fun/beta`,
  `can't believe @oroimho made this from scratch with zero frameworks\n\nSQUISH 'EM android beta is live and it slaps\n\n$SQUISH on @orynth support the builder 🙏\n\nget the apk: squishem.fun/beta`,
];

const STORAGE_KEY = "squish_beta_tweeted";
const NS = "squishem.fun";

async function getCount(key: string): Promise<number> {
  try {
    const r = await fetch(`https://api.countapi.xyz/get/${NS}/${key}`);
    if (!r.ok) return 0;
    const data: { value: number } = await r.json();
    return data.value ?? 0;
  } catch {
    return 0;
  }
}

async function hitCount(key: string): Promise<number> {
  try {
    const r = await fetch(`https://api.countapi.xyz/hit/${NS}/${key}`);
    if (!r.ok) return 0;
    const data: { value: number } = await r.json();
    return data.value ?? 0;
  } catch {
    return 0;
  }
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function PulseDot() {
  return (
    <motion.span
      animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"
      style={{ boxShadow: "0 0 8px #f59e0b" }}
    />
  );
}

export default function Beta() {
  const [tweeted, setTweeted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [tweetCount, setTweetCount] = useState<number | null>(null);
  const [dlCount, setDlCount] = useState<number | null>(null);

  const tweetCopy = useMemo(
    () => TWEET_TEMPLATES[Math.floor(Math.random() * TWEET_TEMPLATES.length)],
    []
  );
  const tweetUrl =
    "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweetCopy);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setTweeted(true);
    getCount("beta-tweets").then(setTweetCount);
    getCount("beta-downloads").then(setDlCount);
  }, []);

  const handleTweet = () => {
    window.open(tweetUrl, "_blank", "width=560,height=420,noopener,noreferrer");
    setTimeout(() => {
      setTweeted(true);
      localStorage.setItem(STORAGE_KEY, "1");
      hitCount("beta-tweets").then(setTweetCount);
    }, 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    hitCount("beta-downloads").then(setDlCount);
    const a = document.createElement("a");
    a.href = APK_URL;
    a.download = "squish-em-beta.apk";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 4000);
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
          style={{
            background:
              "radial-gradient(ellipse at center top, hsl(48 100% 62% / 0.05) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(127 49% 60% / 0.04) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/8 text-amber-300 px-4 py-2 rounded-full font-mono text-[11px] tracking-widest">
            <PulseDot />
            ANDROID TESTING PHASE
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight mb-3">
            SQUISH{" "}
            <span
              className="text-amber-400"
              style={{
                textShadow:
                  "0 0 20px rgba(245,158,11,0.55), 0 0 40px rgba(245,158,11,0.25)",
              }}
            >
              'EM
            </span>
          </h1>
          <p className="font-display font-bold text-muted-foreground text-sm tracking-widest">
            BETA APK FOR ANDROID
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-4 gap-2 mb-8"
        >
          {[
            { label: "SIZE", value: "~4.5 MB" },
            { label: "ANDROID", value: "8.0+" },
            { label: "PRICE", value: "FREE" },
            {
              label: "TESTERS",
              value:
                dlCount !== null
                  ? dlCount > 0
                    ? dlCount.toLocaleString()
                    : "0"
                  : "...",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="border border-white/8 rounded-xl bg-card/40 p-3 text-center"
            >
              <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest mb-1">
                {label}
              </p>
              <p className="font-display font-bold text-white text-xs">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Main action card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl mb-5"
          style={{
            background:
              "linear-gradient(135deg, hsl(232 28% 16%) 0%, hsl(232 30% 19%) 100%)",
            border: tweeted
              ? "1px solid hsl(127 49% 60% / 0.28)"
              : "1px solid hsl(48 100% 62% / 0.18)",
            transition: "border 0.5s ease",
          }}
        >
          <AnimatePresence mode="wait">
            {!tweeted ? (
              <motion.div
                key="gate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl border border-amber-500/20 bg-amber-500/8 flex items-center justify-center mx-auto mb-5">
                  <XLogo className="w-8 h-8 text-amber-400" />
                </div>

                <h2 className="font-display font-black text-xl text-white mb-2">
                  POST ON X TO UNLOCK
                </h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                  Share with your followers and unlock the free APK. Every post
                  helps support @oroimho and the $SQUISH community on @orynth.
                </p>

                <div className="border border-white/8 rounded-xl bg-white/3 p-4 mb-6 text-left">
                  <p className="font-mono text-[10px] text-muted-foreground/50 tracking-widest mb-2">
                    YOUR POST WILL SAY
                  </p>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed whitespace-pre-line">
                    {tweetCopy}
                  </p>
                </div>

                <button
                  onClick={handleTweet}
                  className="inline-flex items-center gap-2.5 text-white px-7 py-3.5 rounded-xl font-display font-bold text-sm tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 w-full justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #1d9bf0 0%, #0d8de3 100%)",
                    boxShadow: "0 4px 20px rgba(29,155,240,0.35)",
                  }}
                >
                  <XLogo className="w-4 h-4" />
                  POST ON X AND UNLOCK DOWNLOAD
                </button>

                <p className="mt-3 font-mono text-[10px] text-muted-foreground/35 tracking-wide">
                  X will open in a new window — return here after posting
                </p>

                {tweetCount !== null && tweetCount > 0 && (
                  <p className="mt-2 font-mono text-[10px] text-amber-400/50 tracking-wide">
                    {tweetCount.toLocaleString()} people already shared this
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="w-16 h-16 rounded-2xl border border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-5"
                  style={{ boxShadow: "0 0 28px hsl(127 49% 60% / 0.18)" }}
                >
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </motion.div>

                <h2 className="font-display font-black text-xl text-white mb-2">
                  DOWNLOAD UNLOCKED
                </h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                  Thanks for supporting $SQUISH. Your APK is ready.
                </p>

                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-display font-bold text-sm tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 w-full justify-center text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "hsl(127 49% 55%)",
                    boxShadow: "0 4px 20px hsl(127 49% 60% / 0.35)",
                  }}
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                      DOWNLOAD APK — squish-em-beta.apk
                    </>
                  )}
                </motion.button>

                <p className="mt-3 font-mono text-[10px] text-muted-foreground/35 tracking-wide">
                  ~4.5 MB · Android 8.0 and above
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6"
        >
          {/* Testing phase notice */}
          <div className="border border-amber-500/15 rounded-xl bg-amber-500/4 p-5">
            <p className="font-mono text-[9px] text-amber-400/60 tracking-widest mb-3">
              TESTING PHASE
            </p>
            <ul className="space-y-2">
              {[
                "Pre-release build — bugs may occur",
                "Your feedback shapes the game",
                <>
                  DM or mention{" "}
                  <a
                    href="https://x.com/oroimho"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    @oroimho
                  </a>{" "}
                  to report issues
                </>,
                <>
                  Follow{" "}
                  <a
                    href="https://x.com/oroimho"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    @oroimho
                  </a>{" "}
                  for updates
                </>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-amber-400/70 mt-0.5 flex-shrink-0">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Install guide */}
          <div className="border border-white/8 rounded-xl bg-card/30 p-5">
            <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest mb-3">
              HOW TO INSTALL
            </p>
            <ol className="space-y-2">
              {[
                "Download the APK file above",
                "Open Settings on your Android device",
                "Go to Security and allow unknown apps",
                "Open the APK file and tap Install",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <span className="font-mono text-[9px] text-primary/60 bg-primary/10 rounded px-1.5 py-0.5 flex-shrink-0 font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* What is in the build */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="border border-white/8 rounded-xl bg-card/20 p-5 mb-6"
        >
          <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest mb-3">
            WHAT IS IN THIS BUILD
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              "Full offline gameplay",
              "All 6 blob types",
              "7 upgrade paths",
              "Infinite levels",
              "Combo multiplier system",
              "Screen shake and effects",
            ].map((item, i) => (
              <p key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-primary text-[10px]">+</span>
                {item}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Feedback CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="border border-white/8 rounded-xl bg-card/20 p-5 mb-6 text-center"
        >
          <p className="font-mono text-[9px] text-muted-foreground/50 tracking-widest mb-2">
            SEND FEEDBACK
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Found a bug? Got a feature idea? Reach out directly to the founder —
            your device info is attached automatically.
          </p>
          <Link
            href="/feedback"
            className="inline-flex items-center gap-2.5 text-white px-6 py-2.5 rounded-xl font-display font-bold text-xs tracking-wider transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "#000",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            <XLogo className="w-3.5 h-3.5" />
            REPORT TO @oroimho
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-center font-mono text-[10px] text-muted-foreground/30 tracking-wide"
        >
          SQUISH 'EM BETA · ANDROID TESTING PHASE · NOT FOR REDISTRIBUTION
        </motion.p>
      </div>
    </main>
  );
}
