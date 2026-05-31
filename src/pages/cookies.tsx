import { motion } from "framer-motion";

const SECTIONS = [
  {
    heading: "1. What This Policy Covers",
    body: `This Cookie and Legal Policy applies to the SQUISH 'EM! web application available at squishem.fun and any associated subdomains. By accessing or using this site, you acknowledge that you have read and understood this policy. If you do not agree with any part of it, you are advised to close the tab, which is a legally valid response and entirely your right.`,
  },
  {
    heading: "2. Cookies and Local Storage",
    body: `This site uses browser-local storage and cookies for the following purposes: storing your high score and game progress locally on your device; remembering your sound and display preferences; and delivering a consistent experience across sessions. No persistent tracking cookies, advertising cookies, or third-party analytics cookies are used. No data from cookies or local storage is transmitted to external servers for the purpose of profiling or advertising.`,
  },
  {
    heading: "3. Data We Collect",
    body: `We collect minimal data. When you submit feedback via the /feedback page, the content of your message, your selected category, and basic device information (browser name, operating system, screen resolution, and language) are included in the submission, which is sent directly to the developer via X DM or public tweet as chosen by you. No database stores your feedback on our servers. We do not collect your name, email address, IP address, or location beyond what your browser exposes by default during normal web requests.`,
  },
  {
    heading: "4. Third-Party Services",
    body: `This site references or links to the following third-party services: Solana blockchain infrastructure for future token-related features; X (formerly Twitter) for the feedback and sharing flow; Orynth (orynth.dev) for project profile and badge display. Each of these services operates under its own privacy policy and terms of service. We are not responsible for data practices of third-party platforms once you navigate away from squishem.fun.`,
  },
  {
    heading: "5. PWA and Offline Usage",
    body: `SQUISH 'EM! is a Progressive Web App and may be installed on your device. When installed, a service worker caches game assets locally to enable offline play. Cached files remain on your device until you uninstall the app or clear your browser cache. No network requests are made during offline gameplay. The service worker does not collect, log, or transmit any usage data.`,
  },
  {
    heading: "6. Your Rights and Controls",
    body: `You may clear all locally stored data at any time through your browser settings under "Clear site data" or equivalent. Doing so will reset your game progress and preferences. You may also decline cookie usage by disabling JavaScript storage in your browser, though this will prevent the game from functioning correctly. If you have questions or concerns about this policy, contact the developer at x.com/oroimho.`,
  },
  {
    heading: "7. Changes to This Policy",
    body: `This policy may be updated periodically as the application evolves. The date of the most recent revision is noted below. Continued use of the site after a policy update constitutes acceptance of the revised terms. We will not attempt to notify you personally, because we do not have your contact information, which is, as noted above, intentional.`,
  },
];

export default function Cookies() {
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
              Legal
            </p>
            <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-white/50 font-mono text-sm">
              Last revised: May 2026. Effective immediately and until further notice.
            </p>
          </div>

          <div className="space-y-10">
            {SECTIONS.map((s, i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              >
                <h2 className="font-display font-bold text-base text-white mb-2">
                  {s.heading}
                </h2>
                <p className="text-white/65 leading-relaxed text-sm">
                  {s.body}
                </p>
              </motion.section>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-8 border-t border-white/8"
          >
            <p className="text-white/30 font-mono text-xs">
              SQUISH 'EM! is an independent project by Yusuf Safary (@oroimho), Bandung, Indonesia.
              For legal inquiries contact via x.com/oroimho.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
