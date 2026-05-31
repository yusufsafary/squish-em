import { motion } from "framer-motion";

const LAST_UPDATED = "May 2026";

const SECTIONS = [
  {
    heading: "1. What Are Cookies",
    body: `Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site owner. This policy also covers similar technologies such as browser local storage and session storage, which serve comparable purposes.`,
  },
  {
    heading: "2. How We Use Cookies and Local Storage",
    body: `SQUISH 'EM! uses browser-local storage and session cookies strictly for functional purposes: storing your high score and game progress locally on your device; remembering your sound and display preferences between sessions; tracking whether you have dismissed in-app prompts (such as the PWA install banner); and maintaining basic session state during gameplay. These are essential to the core functionality of the Service.`,
  },
  {
    heading: "3. Types of Cookies We Use",
    body: `We use only first-party, functional cookies and local storage entries. We do not use advertising cookies, tracking pixels, cross-site cookies, fingerprinting techniques, or any persistent third-party analytics cookies. No cookie or storage entry created by this Service is accessible to or shared with any advertising network or data broker.`,
  },
  {
    heading: "4. Cookies We Do Not Use",
    body: `We do not use: Google Analytics, Facebook Pixel, or similar behavioral tracking tools; retargeting or remarketing cookies; social media tracking cookies; or any cookie whose primary purpose is to build a profile of your browsing behavior across websites. If this changes in the future, this policy will be updated before any such cookie is set.`,
  },
  {
    heading: "5. Data Collection via Feedback",
    body: `When you voluntarily submit feedback via /feedback, the following device information is automatically included in your submission: browser name and version, operating system, screen resolution, and browser language. This data is sent directly to the developer via X (Twitter) as chosen by you. It is not stored on our servers, not linked to your identity, and not retained beyond the content of the message itself.`,
  },
  {
    heading: "6. Third-Party Services",
    body: `The Service loads external resources from the following third parties, which may set their own cookies: Orynth (orynth.dev) for the project badge displayed in the footer. Each third-party service operates under its own cookie and privacy policy. We recommend reviewing their respective policies for full details. We do not control third-party cookie behavior.`,
  },
  {
    heading: "7. Progressive Web App and Service Worker",
    body: `If you install SQUISH 'EM! as a PWA, a service worker will cache game assets locally on your device to enable offline play. These cached files are not cookies and contain no personal data. They remain on your device until you uninstall the app or clear your browser cache. The service worker makes no outbound network requests during offline gameplay.`,
  },
  {
    heading: "8. Your Choices and Controls",
    body: `You can manage, restrict, or delete cookies and local storage at any time through your browser settings. Most browsers allow you to block cookies entirely or on a per-site basis. Clearing site data will reset your game progress and preferences. Note that disabling JavaScript storage may prevent the game from functioning correctly, as score saving and settings are stored locally.`,
  },
  {
    heading: "9. Data Retention",
    body: `All data stored by the Service lives exclusively on your device. We do not operate a database of user data. Game progress and preferences persist until you clear your browser data or uninstall the PWA. Feedback submissions are retained only as long as the corresponding message exists on the developer's X account.`,
  },
  {
    heading: "10. Children's Privacy",
    body: `The Service is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided personal information through the feedback form, please contact us at x.com/oroimho so the message can be deleted.`,
  },
  {
    heading: "11. Changes to This Policy",
    body: `We may update this Cookie Policy from time to time. Changes will be reflected on this page with an updated revision date at the top. Continued use of the Service after a policy change constitutes acceptance of the updated terms. We will not notify you individually of changes, as we do not hold your contact information.`,
  },
  {
    heading: "12. Contact",
    body: `If you have questions about this Cookie Policy or how your data is handled, contact the developer at x.com/oroimho. For full terms of use, see the Terms of Service at squishem.fun/legal.`,
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
              Last updated: {LAST_UPDATED}. This policy explains what data we store and why.
            </p>
          </div>

          <div className="space-y-10">
            {SECTIONS.map((s, i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.04, duration: 0.4 }}
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
            transition={{ delay: 0.7 }}
            className="mt-16 pt-8 border-t border-white/8 flex flex-col sm:flex-row gap-5"
          >
            <a
              href="https://x.com/oroimho"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-white/40 hover:text-primary transition-colors"
            >
              Contact: @oroimho on X
            </a>
            <span className="hidden sm:block text-white/15">|</span>
            <a
              href="/legal"
              className="font-mono text-xs text-white/40 hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
