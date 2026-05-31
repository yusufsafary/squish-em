import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────
type Strategy = "greedy" | "combo" | "dqn";
type ActionId = 0 | 1 | 2 | 3;

interface Blob {
  id: number;
  x: number;   // 0-1
  y: number;   // 0-1
  vx: number;
  vy: number;
  hp: number;
  type: "green" | "purple" | "yellow" | "blue" | "red";
}

interface GameState {
  cannonX: number;
  blobs: Blob[];
  bulletActive: boolean;
  bulletX: number;
  bulletY: number;
  comboMultiplier: number;
  bossActive: boolean;
  score: number;
  sessionTime: number;  // 0-1
}

interface AgentFrame {
  stateVec: number[];
  qValues: number[];
  chosenAction: ActionId;
  strategy: Strategy;
}

// ─── Constants ────────────────────────────────────────────────────────────
const BLOB_COLORS: Record<string, string> = {
  green:  "#22c55e",
  purple: "#a855f7",
  yellow: "#eab308",
  blue:   "#3b82f6",
  red:    "#ef4444",
};

const BLOB_YIELD: Record<string, number> = { green: 3, purple: 5, yellow: 2, blue: 4, red: 6 };

const ACTION_LABELS = ["MOVE_LEFT", "MOVE_RIGHT", "SHOOT", "WAIT"];
const ACTION_DESC   = [
  "Shift cannon left",
  "Shift cannon right",
  "Fire at target",
  "Hold — charge combo",
];
const ACTION_COLORS = ["#3b82f6", "#a855f7", "#22c55e", "#f59e0b"];

const STRATEGY_META: Record<Strategy, { label: string; color: string; tagline: string }> = {
  greedy: { label: "Greedy",  color: "#22c55e", tagline: "Shoots first, asks questions later. Max burst, low combo." },
  combo:  { label: "Combo",   color: "#eab308", tagline: "Waits for alignment, then unloads. Chains for multipliers." },
  dqn:    { label: "RL-DQN",  color: "#a855f7", tagline: "Learned from 50k replays. Adapts dynamically to every wave." },
};

// ─── Simulation helpers ───────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function makeBlobs(): Blob[] {
  const types: Blob["type"][] = ["green", "purple", "yellow", "blue", "red"];
  return Array.from({ length: 4 }, (_, i) => ({
    id: i,
    x: 0.15 + (i / 4) * 0.7,
    y: 0.1 + Math.random() * 0.35,
    vx: (Math.random() - 0.5) * 0.003,
    vy: Math.random() * 0.002 + 0.001,
    hp: Math.floor(Math.random() * 3) + 1,
    type: types[i % types.length],
  }));
}

function buildStateVec(gs: GameState): number[] {
  const nearest = gs.blobs.reduce((a, b) =>
    Math.abs(b.x - gs.cannonX) < Math.abs(a.x - gs.cannonX) ? b : a,
    gs.blobs[0] ?? { x: 0.5, y: 0.5, hp: 0 } as Blob
  );
  const nearPU = -1;
  const sd = gs.score > 0 ? clamp(gs.score / 500, 0, 1) : 0;
  return [
    +gs.cannonX.toFixed(3),
    +0.95,
    +(nearest?.x ?? 0.5).toFixed(3),
    +(nearest?.y ?? 0.5).toFixed(3),
    +(nearest?.hp ?? 0) / 5,
    +(gs.blobs.length / 6).toFixed(2),
    gs.bulletActive ? 1 : 0,
    +Math.min(gs.comboMultiplier / 8, 1).toFixed(2),
    gs.bossActive ? 1 : 0,
    nearPU,
    +sd.toFixed(3),
    +gs.sessionTime.toFixed(3),
  ];
}

function computeQValues(sv: number[], strategy: Strategy): number[] {
  const [cx, , nx, ny, nhp, ec, bif, cm, ba] = sv;
  const dist = Math.abs(nx - cx);

  if (strategy === "greedy") {
    const shouldShoot = bif === 0 && dist < 0.15;
    const moveLeft  = nx < cx - 0.1 ? 0.6 + Math.random() * 0.3 : 0.15 + Math.random() * 0.15;
    const moveRight = nx > cx + 0.1 ? 0.6 + Math.random() * 0.3 : 0.15 + Math.random() * 0.15;
    const shoot = shouldShoot ? 0.75 + nhp * 0.15 + Math.random() * 0.1 : 0.2 + Math.random() * 0.1;
    const wait  = 0.05 + Math.random() * 0.08;
    return [moveLeft, moveRight, shoot, wait].map(v => +v.toFixed(3));
  }

  if (strategy === "combo") {
    const aligned = dist < 0.08;
    const comboReady = cm > 0.4;
    const moveLeft  = nx < cx - 0.06 ? 0.55 + Math.random() * 0.2 : 0.1 + Math.random() * 0.1;
    const moveRight = nx > cx + 0.06 ? 0.55 + Math.random() * 0.2 : 0.1 + Math.random() * 0.1;
    const shoot = aligned && comboReady ? 0.8 + Math.random() * 0.15 : 0.15 + Math.random() * 0.1;
    const wait  = !comboReady ? 0.6 + Math.random() * 0.25 : 0.1 + Math.random() * 0.1;
    return [moveLeft, moveRight, shoot, wait].map(v => +v.toFixed(3));
  }

  // dqn — richer, more varied
  const aggression = ba ? 0.3 : ec * 0.4;
  const moveLeft  = (nx < cx - 0.05 ? 0.5 : 0.1) + aggression * 0.2 + Math.random() * 0.12;
  const moveRight = (nx > cx + 0.05 ? 0.5 : 0.1) + aggression * 0.2 + Math.random() * 0.12;
  const shoot = bif === 0 && dist < 0.12
    ? 0.6 + nhp * 0.2 + ba * 0.15 + Math.random() * 0.08
    : 0.12 + Math.random() * 0.08;
  const wait = cm < 0.35 && !ba ? 0.45 + Math.random() * 0.2 : 0.08 + Math.random() * 0.07;
  return [moveLeft, moveRight, shoot, wait].map(v => +Math.min(+v.toFixed(3), 0.99));
}

function chooseAction(qv: number[]): ActionId {
  return qv.indexOf(Math.max(...qv)) as ActionId;
}

// ─── Mini game board ───────────────────────────────────────────────────────
function GameBoard({ gs, agentFrame }: { gs: GameState; agentFrame: AgentFrame | null }) {
  const nearest = gs.blobs.length
    ? gs.blobs.reduce((a, b) => Math.abs(b.x - gs.cannonX) < Math.abs(a.x - gs.cannonX) ? b : a)
    : null;

  return (
    <div className="relative w-full h-44 rounded-xl border border-white/10 bg-black/40 overflow-hidden select-none">
      {/* Stars */}
      {[...Array(18)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white/20"
          style={{ width: 1, height: 1, left: `${(i * 37 + 7) % 100}%`, top: `${(i * 53 + 11) % 70}%` }} />
      ))}

      {/* Blobs */}
      {gs.blobs.map(blob => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: 28, height: 28,
            left: `calc(${blob.x * 100}% - 14px)`,
            top: `calc(${blob.y * 100}% - 14px)`,
            background: `radial-gradient(circle at 35% 30%, ${BLOB_COLORS[blob.type]}cc, ${BLOB_COLORS[blob.type]}66)`,
            boxShadow: `0 0 10px ${BLOB_COLORS[blob.type]}55`,
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.8 + blob.id * 0.3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-black/50 mr-1" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/50" />
        </motion.div>
      ))}

      {/* Target line to nearest blob */}
      {nearest && agentFrame?.chosenAction === 2 && (
        <motion.div
          className="absolute origin-bottom"
          style={{
            left: `${gs.cannonX * 100}%`,
            bottom: 20,
            width: 1,
            height: `${(1 - nearest.y) * 100 + 20}%`,
            background: "linear-gradient(to top, #22c55e88, transparent)",
            transformOrigin: "bottom center",
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: [0, 0.7, 0] }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Bullet */}
      {gs.bulletActive && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 6, height: 14,
            left: `calc(${gs.bulletX * 100}% - 3px)`,
            top: `calc(${gs.bulletY * 100}% - 7px)`,
            background: "linear-gradient(to top, #22c55e, #86efac)",
            boxShadow: "0 0 8px #22c55e",
          }}
        />
      )}

      {/* Cannon */}
      <motion.div
        className="absolute bottom-0 flex flex-col items-center"
        style={{ left: `calc(${gs.cannonX * 100}% - 10px)` }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div className="w-2.5 h-6 rounded-sm bg-gradient-to-t from-primary to-primary/70"
          style={{ boxShadow: "0 0 8px #22c55e66" }} />
        <div className="w-6 h-2 rounded-sm bg-primary/80" />
      </motion.div>

      {/* Action label */}
      {agentFrame && (
        <div className="absolute top-2 right-2">
          <span
            className="font-mono text-[9px] tracking-widest px-2 py-0.5 rounded border"
            style={{
              color: ACTION_COLORS[agentFrame.chosenAction],
              borderColor: ACTION_COLORS[agentFrame.chosenAction] + "44",
              background: ACTION_COLORS[agentFrame.chosenAction] + "11",
            }}
          >
            {ACTION_LABELS[agentFrame.chosenAction]}
          </span>
        </div>
      )}

      {/* Score */}
      <div className="absolute top-2 left-2 font-mono text-[10px] text-primary/50">
        SCORE {gs.score.toLocaleString()}
      </div>
    </div>
  );
}

// ─── State vector panel ────────────────────────────────────────────────────
const SV_NAMES = [
  "cannon_x", "cannon_y", "enemy_x", "enemy_y", "enemy_hp",
  "enemy_cnt", "bullet_on", "combo_mul", "boss_on", "powerup_x",
  "score_d", "time",
];

function StateVectorPanel({ sv }: { sv: number[] }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 h-full">
      <p className="font-mono text-[10px] text-primary/50 tracking-widest mb-3">STATE VECTOR [12]</p>
      <div className="space-y-1.5">
        {sv.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-muted-foreground/40 w-16 flex-shrink-0">{SV_NAMES[i]}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: v > 0.6 ? "#22c55e" : v > 0.3 ? "#eab308" : "#3b82f6" }}
                animate={{ width: `${Math.max(v, 0) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <span className="font-mono text-[9px] text-white/50 w-8 text-right flex-shrink-0">
              {v.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Q-value panel ─────────────────────────────────────────────────────────
function QValuePanel({ qv, chosen }: { qv: number[]; chosen: ActionId }) {
  const maxQ = Math.max(...qv);

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 h-full">
      <p className="font-mono text-[10px] text-primary/50 tracking-widest mb-3">Q-VALUES</p>
      <div className="space-y-3">
        {qv.map((q, i) => {
          const isChosen = i === chosen;
          const pct = maxQ > 0 ? (q / maxQ) * 100 : 0;
          return (
            <div key={i}
              className={`rounded-lg p-3 border transition-all duration-300 ${isChosen ? "border-white/20 bg-white/[0.04]" : "border-white/5 bg-transparent"}`}
            >
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <div className="flex items-center gap-2">
                  {isChosen && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: ACTION_COLORS[i] }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                  <span className="font-mono text-[10px] tracking-widest"
                    style={{ color: isChosen ? ACTION_COLORS[i] : "#ffffff44" }}>
                    {ACTION_LABELS[i]}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-white/40">{q.toFixed(3)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: isChosen ? ACTION_COLORS[i] : "#ffffff22" }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>
              {isChosen && (
                <p className="text-[9px] text-muted-foreground/40 mt-1">{ACTION_DESC[i]}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Strategy selector ─────────────────────────────────────────────────────
function StrategySelector({ active, onChange }: { active: Strategy; onChange: (s: Strategy) => void }) {
  const strategies: Strategy[] = ["greedy", "combo", "dqn"];
  return (
    <div className="flex gap-2 flex-wrap">
      {strategies.map(s => {
        const meta = STRATEGY_META[s];
        const isActive = s === active;
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`px-4 py-2 rounded-lg border font-mono text-xs tracking-wider transition-all duration-200 ${
              isActive ? "border-opacity-60 text-white" : "border-white/10 text-muted-foreground/50 hover:border-white/20 hover:text-white/70"
            }`}
            style={isActive ? { borderColor: meta.color + "88", background: meta.color + "14", color: meta.color } : {}}
          >
            <span className="flex items-center gap-2">
              {isActive && (
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: meta.color }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
              {meta.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Inference trace ───────────────────────────────────────────────────────
function InferenceTrace({ frames }: { frames: AgentFrame[] }) {
  const recent = frames.slice(-6).reverse();
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <p className="font-mono text-[10px] text-primary/50 tracking-widest mb-3">DECISION LOG</p>
      <div className="space-y-1.5">
        <AnimatePresence initial={false}>
          {recent.map((f, i) => (
            <motion.div
              key={frames.length - i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1 - i * 0.15, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <span className="font-mono text-[9px] text-muted-foreground/25 w-4 flex-shrink-0">
                {i === 0 ? "NOW" : `-${i}`}
              </span>
              <span
                className="font-mono text-[9px] tracking-widest px-1.5 py-0.5 rounded border flex-shrink-0"
                style={{
                  color: ACTION_COLORS[f.chosenAction],
                  borderColor: ACTION_COLORS[f.chosenAction] + "33",
                  background: ACTION_COLORS[f.chosenAction] + "0d",
                }}
              >
                {ACTION_LABELS[f.chosenAction]}
              </span>
              <div className="flex gap-1 flex-wrap">
                {f.qValues.map((q, qi) => (
                  <span key={qi} className="font-mono text-[8px]"
                    style={{ color: qi === f.chosenAction ? ACTION_COLORS[qi] + "cc" : "#ffffff18" }}>
                    {q.toFixed(2)}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function AiAgent() {
  const [strategy, setStrategy] = useState<Strategy>("dqn");
  const [running, setRunning]   = useState(true);
  const [gs, setGs]             = useState<GameState>({
    cannonX: 0.5,
    blobs: makeBlobs(),
    bulletActive: false,
    bulletX: 0.5,
    bulletY: 0.9,
    comboMultiplier: 1,
    bossActive: false,
    score: 0,
    sessionTime: 0.5,
  });
  const [agentFrame, setAgentFrame] = useState<AgentFrame | null>(null);
  const [history, setHistory]       = useState<AgentFrame[]>([]);
  const [frameCount, setFrameCount] = useState(0);

  const strategyRef = useRef(strategy);
  const runningRef  = useRef(running);
  strategyRef.current = strategy;
  runningRef.current  = running;

  const tick = useCallback(() => {
    if (!runningRef.current) return;

    setGs(prev => {
      // Move blobs
      let blobs = prev.blobs.map(b => ({
        ...b,
        x: ((b.x + b.vx + 1) % 1),
        y: clamp(b.y + b.vy * 0.5, 0.05, 0.55),
        vx: Math.abs(b.x + b.vx) > 1 || b.x + b.vx < 0 ? -b.vx : b.vx,
      }));

      // Move bullet
      let { bulletActive, bulletX, bulletY, score, comboMultiplier } = prev;
      if (bulletActive) {
        bulletY -= 0.06;
        // Check hit
        const hit = blobs.find(b => Math.abs(b.x - bulletX) < 0.08 && Math.abs(b.y - bulletY) < 0.1);
        if (hit) {
          const yield_ = BLOB_YIELD[hit.type] * comboMultiplier;
          score += yield_;
          comboMultiplier = Math.min(comboMultiplier + 0.5, 8);
          blobs = blobs.map(b => b.id === hit.id ? { ...b, hp: b.hp - 1 } : b).filter(b => b.hp > 0);
          if (blobs.length === 0) blobs = makeBlobs();
          bulletActive = false;
        } else if (bulletY < -0.1) {
          bulletActive = false;
          comboMultiplier = Math.max(1, comboMultiplier - 1);
        }
      }

      // Respawn blobs
      if (blobs.length < 2) {
        blobs = [...blobs, ...makeBlobs().slice(0, 3)];
      }

      // Compute agent decision
      const nextGs = { ...prev, blobs, bulletActive, bulletX, bulletY, score, comboMultiplier };
      const sv = buildStateVec(nextGs);
      const qv = computeQValues(sv, strategyRef.current);
      const action = chooseAction(qv);

      let newCannonX = prev.cannonX;
      let newBulletActive = bulletActive;
      let newBulletX = bulletX;
      let newBulletY = bulletY;

      if (action === 0) newCannonX = clamp(prev.cannonX - 0.04, 0.05, 0.95);
      if (action === 1) newCannonX = clamp(prev.cannonX + 0.04, 0.05, 0.95);
      if (action === 2 && !bulletActive) {
        newBulletActive = true;
        newBulletX = newCannonX;
        newBulletY = 0.88;
      }

      const frame: AgentFrame = { stateVec: sv, qValues: qv, chosenAction: action, strategy: strategyRef.current };
      setAgentFrame(frame);
      setHistory(h => [...h.slice(-30), frame]);
      setFrameCount(c => c + 1);

      return {
        ...nextGs,
        cannonX: newCannonX,
        bulletActive: newBulletActive,
        bulletX: newBulletX,
        bulletY: newBulletY,
        blobs,
        score,
        comboMultiplier,
        sessionTime: clamp(prev.sessionTime + 0.002, 0, 1),
      };
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 120);
    return () => clearInterval(id);
  }, [running, tick]);

  const handleStrategyChange = (s: Strategy) => {
    setStrategy(s);
    setHistory([]);
    setFrameCount(0);
  };

  const meta = STRATEGY_META[strategy];

  return (
    <main className="min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="mb-10"
        >
          <p className="font-mono text-xs text-primary/60 tracking-widest mb-3">SQUISHEM.FUN / AI AGENT</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight mb-4">
            Agent Simulator
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
            Watch a live AI agent decide its next move every 120 ms. Each frame: game state
            → 12-float vector → Q-network → action. Switch strategy to compare decision patterns.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <StrategySelector active={strategy} onChange={handleStrategyChange} />
          <button
            onClick={() => setRunning(r => !r)}
            className={`ml-auto px-3 py-2 rounded-lg border font-mono text-[10px] tracking-widest transition-all ${
              running
                ? "border-primary/30 text-primary bg-primary/8 hover:bg-primary/15"
                : "border-white/15 text-muted-foreground/60 hover:border-white/25"
            }`}
          >
            {running ? "⏸ PAUSE" : "▶ RESUME"}
          </button>
        </motion.div>

        {/* Strategy tagline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={strategy}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-6 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}88` }} />
            <p className="text-sm text-muted-foreground/60 leading-relaxed">{meta.tagline}</p>
          </motion.div>
        </AnimatePresence>

        {/* Game board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mb-4"
        >
          <GameBoard gs={gs} agentFrame={agentFrame} />
        </motion.div>

        {/* Frame counter */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[10px] text-muted-foreground/30">
            FRAME {frameCount.toLocaleString()}
          </span>
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: running ? meta.color : "#ffffff22" }}
            animate={running ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <span className="font-mono text-[10px] text-muted-foreground/30">
            {running ? "RUNNING" : "PAUSED"} · 120ms/frame
          </span>
        </div>

        {/* State vector + Q-values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <StateVectorPanel sv={agentFrame?.stateVec ?? Array(12).fill(0)} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <QValuePanel qv={agentFrame?.qValues ?? [0.25, 0.25, 0.25, 0.25]} chosen={(agentFrame?.chosenAction ?? 2) as ActionId} />
          </motion.div>
        </div>

        {/* Decision log */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <InferenceTrace frames={history} />
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-mono text-[10px] text-muted-foreground/25 mt-8 leading-relaxed"
        >
          Simulation runs entirely in-browser. Q-values are heuristic approximations of the trained model behaviour.
          Production agent uses ONNX Runtime with weights exported from the Python training loop.
        </motion.p>
      </div>
    </main>
  );
}
