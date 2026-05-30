import { useMiningAgent } from "@/hooks/useMiningAgent";
import type { MiningStrategy } from "@/hooks/useMiningAgent";

export default function MiningPage() {
  const { state, start, stop, setStrategy } = useMiningAgent();
  const isRunning = state.status === "running";

  const totalTime = state.sessions.reduce((s, r) => s + r.durationMs, 0);
  const avgScore =
    state.sessions.length > 0
      ? Math.round(state.sessions.reduce((s, r) => s + r.score, 0) / state.sessions.length)
      : 0;

  return (
    <div className="min-h-screen bg-[#1a1a2e] px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight">
            🤖 AI Mining Agent
          </h1>
          <p className="mt-2 text-gray-400">
            Autonomous bot plays Squish Em! and earns SQUISH tokens on Solana
          </p>
          <span className="mt-2 inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-400">
            On-chain rewards active Q3 2026
          </span>
        </div>

        {/* Stats grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Sessions", value: state.sessions.length },
            { label: "Best Score", value: state.bestScore.toLocaleString() },
            { label: "Avg Score", value: avgScore.toLocaleString() },
            {
              label: "SQUISH Earned",
              value: state.totalTokensEarned,
              highlight: true,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/5 bg-[#16213e] p-4 text-center"
            >
              <p
                className={`text-2xl font-black ${
                  s.highlight ? "text-purple-400" : "text-white"
                }`}
              >
                {s.value}
              </p>
              <p className="mt-1 text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Strategy + Control */}
        <div className="mb-6 rounded-2xl border border-white/5 bg-[#16213e] p-6">
          <h2 className="mb-4 font-bold text-white">Strategy</h2>
          <div className="mb-4 grid grid-cols-2 gap-3">
            {(
              [
                {
                  id: "greedy",
                  title: "⚡ Greedy",
                  desc: "Targets highest-value blob each frame. Fast & reliable.",
                },
                {
                  id: "combo",
                  title: "🔗 Combo Chain",
                  desc: "Plans shot sequences to maximize combo multipliers.",
                },
              ] as { id: MiningStrategy; title: string; desc: string }[]
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setStrategy(s.id)}
                className={[
                  "rounded-xl border p-3 text-left transition",
                  state.strategy === s.id
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-white/5 hover:border-white/20",
                ].join(" ")}
              >
                <p className="font-bold text-white">{s.title}</p>
                <p className="mt-1 text-xs text-gray-400">{s.desc}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => (isRunning ? stop() : start(state.strategy))}
            className={[
              "w-full rounded-xl py-3 font-bold text-white text-lg transition",
              isRunning
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90",
            ].join(" ")}
          >
            {isRunning ? "⏹ Stop Agent" : "▶ Start Mining"}
          </button>
        </div>

        {/* Session log */}
        {state.sessions.length > 0 && (
          <div className="rounded-2xl border border-white/5 bg-[#16213e] p-6">
            <h2 className="mb-4 font-bold">Session Log</h2>
            <div className="space-y-2">
              {[...state.sessions].reverse().map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                >
                  <div>
                    <span className="font-bold">{s.score.toLocaleString()}</span>
                    <span className="ml-2 text-xs text-gray-500">pts</span>
                  </div>
                  <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
                    +{s.tokensEarned} SQUISH
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
