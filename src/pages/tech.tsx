import { motion } from "framer-motion";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs text-primary/60 tracking-widest mb-3">{children}</p>
  );
}

function Tag({ children, color = "primary" }: { children: React.ReactNode; color?: string }) {
  const styles: Record<string, string> = {
    primary:  "text-primary border-primary/30 bg-primary/8",
    yellow:   "text-yellow-400 border-yellow-400/30 bg-yellow-400/8",
    purple:   "text-purple-400 border-purple-400/30 bg-purple-400/8",
    blue:     "text-blue-400 border-blue-400/30 bg-blue-400/8",
    orange:   "text-orange-400 border-orange-400/30 bg-orange-400/8",
  };
  return (
    <span className={`inline-block font-mono text-[10px] tracking-widest px-2 py-0.5 rounded border ${styles[color] ?? styles.primary}`}>
      {children}
    </span>
  );
}

// ── Architecture diagram ───────────────────────────────────────────────────
function ArchDiagram() {
  const nodes = [
    { id: "game",    label: "Game Engine",    sub: "Canvas API · JS",       color: "127,65%,52%", col: 0 },
    { id: "ws",      label: "WebSocket",      sub: "JSON frames · 60 fps",  color: "48,95%,58%",  col: 1 },
    { id: "agent",   label: "Python Agent",   sub: "RL-DQN · NumPy",        color: "263,68%,58%", col: 2 },
    { id: "model",   label: "ONNX Model",     sub: "Inference · <2 ms",     color: "215,88%,62%", col: 3 },
    { id: "solana",  label: "Solana",         sub: "Session proof · SPL",   color: "360,80%,65%", col: 4 },
  ];

  const arrows = [
    { from: 0, to: 1, label: "state vector" },
    { from: 1, to: 2, label: "frame data"   },
    { from: 2, to: 3, label: "forward pass"  },
    { from: 3, to: 2, label: "Q-values"     },
    { from: 2, to: 1, label: "action"       },
    { from: 1, to: 0, label: "input cmd"    },
  ];

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-6 overflow-x-auto">
      <div className="flex items-center gap-3 min-w-[520px]">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-3 flex-1 min-w-0">
            {/* Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="flex-1 rounded-lg border p-3 text-center"
              style={{
                borderColor: `hsl(${node.color} / 0.35)`,
                background: `hsl(${node.color} / 0.06)`,
              }}
            >
              <div
                className="font-mono text-[10px] tracking-widest font-bold mb-1"
                style={{ color: `hsl(${node.color})` }}
              >
                {node.label}
              </div>
              <div className="text-[9px] text-muted-foreground/50 leading-tight">{node.sub}</div>
            </motion.div>
            {/* Arrow */}
            {i < nodes.length - 1 && (
              <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
                <div className="w-6 h-px bg-white/15" />
                <span className="text-white/20" style={{ fontSize: 8 }}>→</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="font-mono text-[9px] text-muted-foreground/30 text-center mt-4">
        Game → WS → Agent → Model → Action → Game (loop at ~60 fps)
      </p>
    </div>
  );
}

// ── DQN diagram ────────────────────────────────────────────────────────────
function DQNDiagram() {
  const layers = [
    { label: "Input",   nodes: 12, desc: "State vector",   color: "127,65%,52%" },
    { label: "Dense 1", nodes: 8,  desc: "128 units · ReLU", color: "48,95%,58%"  },
    { label: "Dense 2", nodes: 8,  desc: "64 units · ReLU",  color: "263,68%,58%" },
    { label: "Output",  nodes: 4,  desc: "Q-values per action", color: "215,88%,62%" },
  ];

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-6 overflow-x-auto">
      <div className="flex items-end justify-center gap-6 min-w-[400px]">
        {layers.map((layer, li) => (
          <div key={layer.label} className="flex flex-col items-center gap-2">
            {/* Nodes */}
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: Math.min(layer.nodes, 6) }).map((_, ni) => (
                <motion.div
                  key={ni}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: li * 0.1 + ni * 0.04 }}
                  className="w-4 h-4 rounded-full border"
                  style={{
                    borderColor: `hsl(${layer.color} / 0.5)`,
                    background: `hsl(${layer.color} / 0.15)`,
                    boxShadow: `0 0 6px hsl(${layer.color} / 0.3)`,
                  }}
                />
              ))}
              {layer.nodes > 6 && (
                <div className="font-mono text-[9px] text-muted-foreground/40 text-center">
                  +{layer.nodes - 6}
                </div>
              )}
            </div>
            {/* Label */}
            <span className="font-mono text-[9px] font-bold tracking-wide" style={{ color: `hsl(${layer.color})` }}>
              {layer.label}
            </span>
            <span className="font-mono text-[8px] text-muted-foreground/40 text-center max-w-[72px] leading-tight">
              {layer.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── State vector table ─────────────────────────────────────────────────────
const STATE_FIELDS = [
  { idx: "0–1",  name: "agent_x, agent_y",       desc: "Cannon position (normalized 0–1)"   },
  { idx: "2",    name: "nearest_enemy_x",         desc: "X of closest blob"                  },
  { idx: "3",    name: "nearest_enemy_y",         desc: "Y of closest blob"                  },
  { idx: "4",    name: "nearest_enemy_hp",        desc: "Hit-points remaining"                },
  { idx: "5",    name: "enemy_count",             desc: "Live blobs on screen"                },
  { idx: "6",    name: "bullet_in_flight",        desc: "Bool — shot already active"          },
  { idx: "7",    name: "combo_multiplier",        desc: "Current chain multiplier"            },
  { idx: "8",    name: "boss_active",             desc: "Bool — boss phase active"            },
  { idx: "9",    name: "powerup_x",              desc: "Nearest power-up X (or -1)"          },
  { idx: "10",   name: "score_delta",             desc: "Score change since last frame"       },
  { idx: "11",   name: "time_remaining",          desc: "Session countdown (normalized)"      },
];

const ACTIONS = [
  { id: 0, label: "MOVE_LEFT",  desc: "Shift cannon left"         },
  { id: 1, label: "MOVE_RIGHT", desc: "Shift cannon right"        },
  { id: 2, label: "SHOOT",      desc: "Fire bullet at target"     },
  { id: 3, label: "WAIT",       desc: "Hold — charge combo timer" },
];

// ── WebSocket protocol ─────────────────────────────────────────────────────
const WS_FRAMES = [
  {
    dir: "Game → Agent",
    color: "127,65%,52%",
    example: `{ "t": "state", "v": [0.42, 0.95, 0.31, 0.58, 2, 3, 0, 4, 1, 0.22, 120, 0.76] }`,
    desc: "Sent every animation frame. 12-element float array = state vector.",
  },
  {
    dir: "Agent → Game",
    color: "263,68%,58%",
    example: `{ "t": "action", "a": 2 }`,
    desc: "Agent replies with action index (0–3). Game executes on next tick.",
  },
  {
    dir: "Game → Agent",
    color: "48,95%,58%",
    example: `{ "t": "reward", "r": 6, "done": false }`,
    desc: "Reward signal + episode-done flag. Used for RL replay buffer update.",
  },
  {
    dir: "Agent → Solana",
    color: "360,80%,65%",
    example: `{ "t": "session_proof", "score": 4820, "sig": "3xK..." }`,
    desc: "Signed session receipt broadcast to Solana program for on-chain anchoring.",
  },
];

// ── Agent strategies ───────────────────────────────────────────────────────
const STRATEGIES = [
  {
    name: "Greedy",
    color: "127,65%,52%",
    badge: "primary",
    desc: "Always targets the highest-HP blob. Fast score ramp, poor combo chain. Best for boss phases.",
    tags: ["ε = 0.05", "γ = 0.90"],
  },
  {
    name: "Combo",
    color: "48,95%,58%",
    badge: "yellow",
    desc: "Waits for multi-blob alignment before shooting. Trades burst score for chained multipliers.",
    tags: ["ε = 0.10", "γ = 0.95"],
  },
  {
    name: "RL-DQN",
    color: "263,68%,58%",
    badge: "purple",
    desc: "Full deep Q-network. Learns from 50k+ replays. Adapts to wave patterns and boss telegraphs.",
    tags: ["ε = 0.01", "γ = 0.99", "replay 50k"],
  },
];

// ── Main page ──────────────────────────────────────────────────────────────
export default function Tech() {
  return (
    <main className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="mb-16"
        >
          <SectionLabel>SQUISHEM.FUN / TECH</SectionLabel>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-4">
            AI Mining Agent
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
            A Python-powered reinforcement learning agent that plays the game autonomously,
            accumulates <span className="text-primary font-mono">$SQUISH</span>, and anchors session proofs on Solana —
            all in real time.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <Tag color="primary">Python 3.12</Tag>
            <Tag color="yellow">RL-DQN</Tag>
            <Tag color="purple">WebSocket</Tag>
            <Tag color="blue">ONNX Runtime</Tag>
            <Tag color="orange">Solana</Tag>
          </div>
        </motion.div>

        {/* System Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45 }}
          className="mb-16"
        >
          <SectionLabel>ARCHITECTURE</SectionLabel>
          <h2 className="font-display font-bold text-2xl text-white mb-2">System Overview</h2>
          <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">
            The game engine and AI agent are fully decoupled. They communicate over a local
            WebSocket connection — no shared memory, no monkey-patching. This means the agent
            can run on a separate device, VM, or even a cloud server.
          </p>
          <ArchDiagram />
        </motion.div>

        {/* WebSocket Protocol */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45 }}
          className="mb-16"
        >
          <SectionLabel>PROTOCOL</SectionLabel>
          <h2 className="font-display font-bold text-2xl text-white mb-2">WebSocket Frame Format</h2>
          <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">
            All messages are compact JSON objects with a <code className="text-primary font-mono text-xs bg-primary/10 px-1 py-0.5 rounded">t</code> (type) field.
            The game sends state at every animation frame (~60 fps); the agent replies within 2 ms.
          </p>
          <div className="space-y-4">
            {WS_FRAMES.map((frame, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.07 }}
                className="rounded-lg border border-white/8 bg-white/[0.02] p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="font-mono text-[10px] tracking-widest font-bold px-2 py-0.5 rounded"
                    style={{ color: `hsl(${frame.color})`, background: `hsl(${frame.color} / 0.1)`, border: `1px solid hsl(${frame.color} / 0.3)` }}
                  >
                    {frame.dir}
                  </span>
                </div>
                <pre className="font-mono text-[11px] text-primary/70 bg-black/30 rounded p-3 overflow-x-auto mb-2 leading-relaxed">
                  {frame.example}
                </pre>
                <p className="text-xs text-muted-foreground/55 leading-relaxed">{frame.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* State Vector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45 }}
          className="mb-16"
        >
          <SectionLabel>INPUT</SectionLabel>
          <h2 className="font-display font-bold text-2xl text-white mb-2">State Vector — 12 floats</h2>
          <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">
            Every frame, the game serializes its world state into a 12-element float array.
            All position values are normalized to [0, 1] relative to canvas dimensions.
          </p>
          <div className="rounded-xl border border-white/8 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.03]">
                  <th className="text-left font-mono text-[10px] text-muted-foreground/50 tracking-widest px-4 py-2.5">IDX</th>
                  <th className="text-left font-mono text-[10px] text-muted-foreground/50 tracking-widest px-4 py-2.5">FIELD</th>
                  <th className="text-left font-mono text-[10px] text-muted-foreground/50 tracking-widest px-4 py-2.5 hidden sm:table-cell">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                {STATE_FIELDS.map((f, i) => (
                  <motion.tr
                    key={f.idx}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/[0.015] transition-colors"
                  >
                    <td className="px-4 py-2.5 font-mono text-primary/50">{f.idx}</td>
                    <td className="px-4 py-2.5 font-mono text-primary/80 text-[11px]">{f.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground/55 hidden sm:table-cell">{f.desc}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Action Space */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45 }}
          className="mb-16"
        >
          <SectionLabel>OUTPUT</SectionLabel>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Action Space — 4 discrete</h2>
          <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">
            The agent outputs a single integer (0–3) each frame. The game maps this to
            one of four control commands. The DQN selects the action with the highest Q-value.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ACTIONS.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.07 }}
                className="rounded-lg border border-white/8 bg-white/[0.02] p-4 text-center"
              >
                <div className="font-mono text-2xl font-black text-primary/30 mb-2">{a.id}</div>
                <div className="font-mono text-[10px] text-primary tracking-widest mb-1">{a.label}</div>
                <div className="text-[11px] text-muted-foreground/50 leading-tight">{a.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* DQN Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45 }}
          className="mb-16"
        >
          <SectionLabel>MODEL</SectionLabel>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Deep Q-Network (DQN)</h2>
          <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">
            A lightweight feedforward network trained in Python with NumPy.
            Exported to ONNX for sub-2ms inference in any runtime. Experience replay
            buffer holds 50,000 transitions; target network updates every 500 steps.
          </p>
          <DQNDiagram />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Input dim",     value: "12"      },
              { label: "Hidden layers", value: "2"       },
              { label: "Output dim",    value: "4"       },
              { label: "Replay buffer", value: "50k"     },
              { label: "Batch size",    value: "64"      },
              { label: "Target sync",   value: "500 steps"},
              { label: "Optimizer",     value: "Adam"    },
              { label: "Loss",          value: "Huber"   },
            ].map((stat, i) => (
              <div key={i} className="rounded-lg border border-white/6 bg-white/[0.015] px-4 py-3">
                <div className="font-mono text-[9px] text-muted-foreground/40 tracking-widest mb-1">{stat.label.toUpperCase()}</div>
                <div className="font-mono text-sm text-white/80 font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Agent Strategies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45 }}
          className="mb-16"
        >
          <SectionLabel>STRATEGIES</SectionLabel>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Agent Archetypes</h2>
          <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">
            Three agent strategies ship with the mining module. Each has different
            exploration–exploitation tradeoffs, making them suitable for different wave types.
          </p>
          <div className="space-y-4">
            {STRATEGIES.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.1 }}
                className="rounded-xl border border-white/8 bg-white/[0.02] p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: `hsl(${s.color})`, boxShadow: `0 0 8px hsl(${s.color} / 0.6)` }}
                  />
                  <h3 className="font-display font-bold text-white text-lg">{s.name}</h3>
                  <div className="flex gap-1.5 ml-auto">
                    {s.tags.map(t => (
                      <span key={t} className="font-mono text-[9px] text-muted-foreground/50 border border-white/10 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground/65 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solana integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <SectionLabel>BLOCKCHAIN</SectionLabel>
          <h2 className="font-display font-bold text-2xl text-white mb-2">Solana Session Proofs</h2>
          <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">
            At session end, the agent signs a proof bundle (score + action hash + timestamp)
            with the user's wallet key. The Anchor program verifies the signature on-chain
            and mints <span className="text-primary font-mono">$SQUISH</span> tokens proportional to the score.
          </p>
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
            {[
              { step: "01", label: "Session ends",        desc: "Agent compiles score, action log hash, and session timestamp into a proof bundle." },
              { step: "02", label: "Wallet signs",        desc: "User's Phantom/Solflare wallet signs the bundle with ed25519. No server involved." },
              { step: "03", label: "Anchor verifies",     desc: "On-chain program checks the signature and confirms the score is within valid range." },
              { step: "04", label: "$SQUISH minted",      desc: "SPL tokens are minted 1:1 with earned score and transferred to the user's wallet." },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex gap-4"
              >
                <span className="font-mono text-xs text-muted-foreground/25 flex-shrink-0 pt-0.5">{step.step}</span>
                <div>
                  <div className="font-mono text-xs text-primary/70 tracking-wide mb-0.5">{step.label}</div>
                  <p className="text-xs text-muted-foreground/55 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}
