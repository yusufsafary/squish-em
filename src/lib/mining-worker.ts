/**
 * In-browser AI Mining Agent WebWorker.
 *
 * Runs in a separate thread so the AI decision loop doesn't block the game.
 * Communicates with the main thread via BroadcastChannel.
 *
 * Usage:
 *   const worker = new Worker(new URL("./mining-worker.ts", import.meta.url), { type: "module" });
 */

import type { GameState } from "./types.js";

const channel = new BroadcastChannel("squish-agent");
const resultChannel = new BroadcastChannel("squish-agent-actions");

let isActive = false;
let strategy: "greedy" | "combo" = "greedy";

// Listen for state updates from the game
channel.addEventListener("message", async (e) => {
  const { type, state } = e.data;

  if (type === "STATE_UPDATE" && isActive) {
    const action = await decide(state as GameState);
    if (action) {
      resultChannel.postMessage({ type: "ACTION", action });
    }
  }

  if (type === "GAME_OVER") {
    const { score } = e.data;
    resultChannel.postMessage({ type: "SESSION_COMPLETE", score });
  }
});

// Listen for control messages from the React hook
self.addEventListener("message", (e) => {
  if (e.data.type === "START") {
    isActive = true;
    strategy = e.data.strategy ?? "greedy";
  }
  if (e.data.type === "STOP") {
    isActive = false;
  }
});

/** Greedy decision: target highest-value blob */
async function decide(state: GameState): Promise<{ type: string; x: number; y: number } | null> {
  if (!state.isAlive || state.blobs.length === 0) return null;

  const player = state.playerPosition;

  const best = state.blobs.reduce((winner, blob) => {
    const wd = Math.hypot(winner.x - player.x, winner.y - player.y);
    const bd = Math.hypot(blob.x - player.x, blob.y - player.y);
    const wScore = winner.points / (wd + 1);
    const bScore = blob.points / (bd + 1);
    return bScore > wScore ? blob : winner;
  });

  // Combo strategy: re-sort by cluster density if combo is active
  if (strategy === "combo" && state.combo.count > 2) {
    const cx = state.blobs.reduce((s, b) => s + b.x, 0) / state.blobs.length;
    const cy = state.blobs.reduce((s, b) => s + b.y, 0) / state.blobs.length;
    const nearest = state.blobs.reduce((a, b) => {
      const ad = Math.hypot(a.x - cx, a.y - cy);
      const bd2 = Math.hypot(b.x - cx, b.y - cy);
      return bd2 < ad ? b : a;
    });
    return { type: "shoot", x: nearest.x, y: nearest.y };
  }

  return { type: "shoot", x: best.x, y: best.y };
}
