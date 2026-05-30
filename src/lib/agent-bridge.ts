/**
 * Agent Bridge — exposes game state to the AI Mining Agent.
 *
 * This module patches the game loop to publish state to:
 * 1. window.__SQUISH_STATE__  → read by Puppeteer (headless mining agent)
 * 2. BroadcastChannel         → read by in-browser WebWorker agent
 * 3. window.__SQUISH_START__  → called by agent to start/restart game
 *
 * Import and call initAgentBridge() once in your game bootstrap.
 */

import type { GameState } from "./types.js";

const CHANNEL_NAME = "squish-agent";

let channel: BroadcastChannel | null = null;

export function initAgentBridge(): void {
  if (typeof window === "undefined") return;

  // BroadcastChannel for in-browser WebWorker agent
  channel = new BroadcastChannel(CHANNEL_NAME);

  // Expose start hook for Puppeteer agent
  (window as any).__SQUISH_START__ = () => {
    const startBtn =
      document.querySelector<HTMLElement>("[data-action='start']") ??
      document.querySelector<HTMLElement>(".start-button") ??
      document.querySelector<HTMLElement>("#start-btn");
    startBtn?.click();
  };
}

/**
 * Called every game tick by the game loop.
 * Publishes current state for any listening agents.
 */
export function publishGameState(state: GameState): void {
  if (typeof window === "undefined") return;

  // For Puppeteer agent (reads via page.evaluate)
  (window as any).__SQUISH_STATE__ = state;

  // For WebWorker agent (in-browser)
  channel?.postMessage({ type: "STATE_UPDATE", state });
}

/**
 * Signal game over to all listening agents.
 */
export function publishGameOver(finalScore: number): void {
  if (typeof window === "undefined") return;

  const state = (window as any).__SQUISH_STATE__;
  if (state) {
    (window as any).__SQUISH_STATE__ = { ...state, isAlive: false, score: finalScore };
  }
  channel?.postMessage({ type: "GAME_OVER", score: finalScore });
}
