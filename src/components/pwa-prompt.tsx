import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "squish_notif_asked";

export function PwaPrompt() {
  const [show, setShow] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't show if already asked
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Check notification support
    const notifSupported = "Notification" in window && "serviceWorker" in navigator;
    if (!notifSupported) return;

    // Don't show if already granted or denied
    if (Notification.permission !== "default") {
      localStorage.setItem(STORAGE_KEY, "done");
      return;
    }

    // Show after 8 seconds
    const timer = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Capture install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setShow(false);
  };

  const enable = async () => {
    setInstalling(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm === "granted" && deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      }
    } catch (_) {}
    localStorage.setItem(STORAGE_KEY, "done");
    setShow(false);
    setInstalling(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50"
          role="dialog"
          aria-label="Enable notifications"
        >
          <div className="relative rounded-xl border border-primary/25 bg-[#0d1a0d]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/12 border border-primary/20 flex items-center justify-center text-base mt-0.5">
                  <motion.span
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
                  >
                    🎮
                  </motion.span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-xs tracking-wider text-white mb-0.5">
                    STAY IN THE GAME
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Get notified when new boss waves and features drop. No spam, ever.
                  </p>
                </div>

                {/* Close */}
                <button
                  onClick={dismiss}
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground/50 hover:text-white hover:bg-white/10 transition-all text-xs mt-0.5"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={enable}
                  disabled={installing}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-display font-bold tracking-wider px-3 py-2 rounded-lg transition-all disabled:opacity-60"
                >
                  {installing ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    >
                      ◌
                    </motion.span>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground inline-block" />
                      ENABLE
                    </>
                  )}
                </button>
                <button
                  onClick={dismiss}
                  className="px-3 py-2 text-xs font-mono text-muted-foreground hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
