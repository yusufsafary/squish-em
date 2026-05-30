import { useMiningAgent, type MiningStrategy } from "@/hooks/useMiningAgent";

/**
 * MiningPanel — HUD overlay shown on the Play page.
 * Controls the in-browser AI mining agent.
 */
export function MiningPanel() {
  const { state, start, stop, setStrategy } = useMiningAgent();
  const isRunning = state.status === "running";

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-2xl border border-pink-500/20 bg-[#16213e]/90 p-4 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="font-bold text-white">AI Mining Agent</span>
        </div>
        <StatusBadge isRunning={isRunning} />
      </div>

      {/* Strategy selector */}
      <div className="mb-3">
        <p className="mb-1.5 text-xs text-gray-400">Strategy</p>
        <div className="flex gap-2">
          {(["greedy", "combo"] as MiningStrategy[]).map((s) => (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              className={[
                "flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold capitalize transition",
                state.strategy === s
                  ? "bg-pink-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10",
              ].join(" ")}
            >
              {s === "greedy" ? "⚡ Greedy" : "🔗 Combo"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        <Stat label="Sessions" value={state.sessions.length} />
        <Stat label="Best Score" value={state.bestScore.toLocaleString()} />
        <Stat label="SQUISH Earned" value={state.totalTokensEarned} color="text-purple-400" />
      </div>

      {/* Session history (last 3) */}
      {state.sessions.length > 0 && (
        <div className="mb-3 space-y-1">
          <p className="text-xs text-gray-500">Recent Sessions</p>
          {state.sessions
            .slice(-3)
            .reverse()
            .map((s, i) => (
              <div key={i} className="flex justify-between rounded-lg bg-white/5 px-2 py-1 text-xs">
                <span className="text-white">{s.score.toLocaleString()}</span>
                <span className="text-purple-400">+{s.tokensEarned} SQUISH</span>
              </div>
            ))}
        </div>
      )}

      {/* Control button */}
      <button
        onClick={() => (isRunning ? stop() : start(state.strategy))}
        className={[
          "w-full rounded-xl py-2.5 font-bold text-white transition",
          isRunning
            ? "bg-red-500/80 hover:bg-red-500"
            : "bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90",
        ].join(" ")}
      >
        {isRunning ? "⏹ Stop Mining" : "▶ Start Mining"}
      </button>

      <p className="mt-2 text-center text-[10px] text-gray-600">
        Token rewards require Solana wallet · Q3 2026
      </p>
    </div>
  );
}

function StatusBadge({ isRunning }: { isRunning: boolean }) {
  return (
    <span
      className={[
        "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        isRunning ? "bg-green-500/20 text-green-400" : "bg-white/10 text-gray-500",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isRunning ? "animate-pulse bg-green-400" : "bg-gray-500",
        ].join(" ")}
      />
      {isRunning ? "Mining" : "Idle"}
    </span>
  );
}

function Stat({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-2 text-center">
      <p className={`text-sm font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}
