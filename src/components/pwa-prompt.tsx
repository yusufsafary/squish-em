import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "squish_pwa_asked";

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
}
function isInStandaloneMode() {
  return (window.navigator as any).standalone === true
    || window.matchMedia("(display-mode: standalone)").matches;
}

export function PwaPrompt() {
  const [show, setShow] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (isInStandaloneMode()) return; // already installed

    const ios = isIos();
    setIsIosDevice(ios);

    if (ios) {
      // iOS: show manual install hint after delay
      const t = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(t);
    }

    // Android / Chrome: wait for browser install event
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShow(true), 4000);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setShow(false);
  };

  const install = async () => {
    if (isIosDevice) { dismiss(); return; }
    if (!deferredPrompt) { dismiss(); return; }
    setInstalling(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") localStorage.setItem(STORAGE_KEY, "installed");
      else localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch (_) {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    }
    setShow(false);
    setInstalling(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-72 z-50"
          role="dialog"
          aria-label="Install app"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0c160c]/96 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Accent line */}
            <div className="h-[1.5px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

            <div className="p-4 flex items-start gap-3">
              {/* App icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-xl">
                🎮
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-display font-bold text-[11px] tracking-widest text-white/90 mb-0.5">
                  INSTALL APP
                </p>
                {isIosDevice ? (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Tap <span className="inline-block text-white">⬆</span> Share, lalu{" "}
                    <span className="text-primary font-semibold">Add to Home Screen</span>{" "}
                    untuk main offline.
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Main offline, layar penuh,{" "}
                    <span className="text-primary font-semibold">tanpa browser</span>.
                    Simpan ke home screen.
                  </p>
                )}
              </div>

              {/* Close */}
              <button
                onClick={dismiss}
                className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground/40 hover:text-white/70 transition-colors text-xs mt-0.5"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Buttons */}
            {!isIosDevice && (
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={install}
                  disabled={installing}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground text-[11px] font-display font-bold tracking-wider py-2 rounded-lg transition-all"
                >
                  {installing ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      ○
                    </motion.span>
                  ) : (
                    "INSTALL"
                  )}
                </button>
                <button
                  onClick={dismiss}
                  className="px-3 py-2 text-[11px] font-mono text-muted-foreground/60 hover:text-white/80 border border-white/8 hover:border-white/18 rounded-lg transition-all"
                >
                  Nanti
                </button>
              </div>
            )}

            {isIosDevice && (
              <div className="px-4 pb-4">
                <button
                  onClick={dismiss}
                  className="w-full py-2 text-[11px] font-mono text-muted-foreground/50 hover:text-white/70 border border-white/8 hover:border-white/15 rounded-lg transition-all"
                >
                  Mengerti
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
