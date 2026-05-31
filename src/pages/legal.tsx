import { motion } from "framer-motion";

const LAST_UPDATED = "May 2026";

const TERMS = [
  {
    heading: "1. Acceptance of Terms",
    body: `By accessing or using SQUISH 'EM! at squishem.fun (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. These terms apply to all visitors, users, and others who access the Service.`,
  },
  {
    heading: "2. Description of Service",
    body: `SQUISH 'EM! is a browser-based arcade game featuring an embedded AI agent and optional Solana-based token mechanics. The Service is provided free of charge for personal, non-commercial use. Features may change, be added, or be removed at any time without prior notice.`,
  },
  {
    heading: "3. User Conduct",
    body: `You agree not to use the Service for any unlawful purpose or in any way that could harm, disable, or impair the Service or interfere with any other party's use. You agree not to attempt to gain unauthorized access to any part of the Service, its servers, or any systems connected to it.`,
  },
  {
    heading: "4. Intellectual Property",
    body: `All content on the Service, including but not limited to graphics, game logic, audio, and text, is the property of the Service's creator (@oroimho) and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any part of the Service without express written permission.`,
  },
  {
    heading: "5. Token and Blockchain Features",
    body: `The $SQUISH token and any associated Solana blockchain features are experimental and provided for entertainment purposes only. Nothing on this Service constitutes financial advice, investment advice, or a solicitation to buy or sell any asset. Participation in any token-related feature is entirely at your own risk. Token values may be zero and participation may result in a complete loss of any associated value.`,
  },
  {
    heading: "6. Disclaimer of Warranties",
    body: `The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. The creator does not warrant that the Service will be uninterrupted, error-free, or free of harmful components.`,
  },
  {
    heading: "7. Limitation of Liability",
    body: `To the fullest extent permitted by law, the creator of SQUISH 'EM! shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service, even if advised of the possibility of such damages.`,
  },
  {
    heading: "8. Privacy",
    body: `Your use of the Service is also governed by our Cookie Policy available at squishem.fun/cookies. We do not collect personal data beyond what is described in that policy. We do not sell, rent, or share your data with third parties for marketing purposes.`,
  },
  {
    heading: "9. Third-Party Links",
    body: `The Service may contain links to third-party websites including X (Twitter), Orynth, and Solana ecosystem services. These links are provided for convenience only. We have no control over the content or practices of those sites and accept no responsibility for them.`,
  },
  {
    heading: "10. Modifications to Terms",
    body: `We reserve the right to modify these terms at any time. Changes take effect immediately upon posting to the Service. Continued use of the Service after changes are posted constitutes your acceptance of the revised terms. The date of the most recent revision is shown at the top of this page.`,
  },
  {
    heading: "11. Governing Law",
    body: `These terms shall be governed by and construed in accordance with applicable law. Any disputes arising under these terms shall be resolved through good-faith negotiation before any formal proceeding is initiated. You may contact the creator via x.com/oroimho for any concerns.`,
  },
  {
    heading: "12. Contact",
    body: `For any questions or concerns regarding these Terms of Service, please contact the creator at x.com/oroimho. We will make reasonable efforts to respond in a timely manner, which is to say, eventually.`,
  },
];

export default function Legal() {
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
              Terms of Service
            </h1>
            <p className="text-white/50 font-mono text-sm">
              Last updated: {LAST_UPDATED}. Please read these terms carefully before using the Service.
            </p>
          </div>

          <div className="space-y-10">
            {TERMS.map((s, i) => (
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
              href="/cookies"
              className="font-mono text-xs text-white/40 hover:text-primary transition-colors"
            >
              Cookie Policy
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
