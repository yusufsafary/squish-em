import { useState, useEffect, useRef, useCallback } from "react";

export type MiningStrategy = "greedy" | "combo";
export type AgentStatus = "idle" | "running" | "paused";

export interface MiningSession {
  score: number;
  tokensEarned: number;
  durationMs: number;
  timestamp: number;
}

export interface MiningAgentState {
  status: AgentStatus;
  sessions: MiningSession[];
  totalTokensEarned: number;
  currentScore: number;
  bestScore: number;
  strategy: MiningStrategy;
}

/**
 * React hook that manages the in-browser AI Mining Agent WebWorker.
 *
 * The agent runs in a WebWorker to avoid blocking the game thread.
 * It reads game state via BroadcastChannel and sends click coordinates
 * back to a canvas overlay that simulates user input.
 */
export function useMiningAgent() {
  const workerRef = useRef<Worker | null>(null);
  const actionChannelRef = useRef<BroadcastChannel | null>(null);

  const [state, setState] = useState<MiningAgentState>({
    status: "idle",
    sessions: [],
    totalTokensEarned: 0,
    currentScore: 0,
    bestScore: 0,
    strategy: "greedy",
  });

  useEffect(() => {
    // Listen for action messages from worker
    const actionChannel = new BroadcastChannel("squish-agent-actions");
    actionChannelRef.current = actionChannel;

    actionChannel.addEventListener("message", (e) => {
      if (e.data.type === "ACTION") {
        // Dispatch synthetic click on the canvas at the given coordinates
        dispatchCanvasClick(e.data.action.x, e.data.action.y);
      }
      if (e.data.type === "SESSION_COMPLETE") {
        const score = e.data.score as number;
        const tokensEarned = Math.min(Math.floor(score / 100), 1000);
        setState((prev) => {
          const session: MiningSession = {
            score,
            tokensEarned,
            durationMs: Date.now(),
            timestamp: Date.now(),
          };
          return {
            ...prev,
            sessions: [...prev.sessions, session],
            totalTokensEarned: prev.totalTokensEarned + tokensEarned,
            bestScore: Math.max(prev.bestScore, score),
            currentScore: 0,
          };
        });
      }
    });

    return () => {
      actionChannel.close();
      workerRef.current?.terminate();
    };
  }, []);

  const start = useCallback((strategy: MiningStrategy = "greedy") => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../lib/mining-worker.ts", import.meta.url),
        { type: "module" }
      );
    }
    workerRef.current.postMessage({ type: "START", strategy });
    setState((prev) => ({ ...prev, status: "running", strategy }));
  }, []);

  const stop = useCallback(() => {
    workerRef.current?.postMessage({ type: "STOP" });
    setState((prev) => ({ ...prev, status: "idle" }));
  }, []);

  const setStrategy = useCallback((strategy: MiningStrategy) => {
    setState((prev) => ({ ...prev, strategy }));
    if (state.status === "running") {
      workerRef.current?.postMessage({ type: "START", strategy });
    }
  }, [state.status]);

  return { state, start, stop, setStrategy };
}

/** Dispatch a synthetic MouseEvent at canvas-relative coordinates */
function dispatchCanvasClick(x: number, y: number): void {
  const canvas = document.querySelector<HTMLCanvasElement>("canvas");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const event = new MouseEvent("click", {
    clientX: rect.left + x,
    clientY: rect.top + y,
    bubbles: true,
  });
  canvas.dispatchEvent(event);
}
