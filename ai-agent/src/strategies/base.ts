import type { GameState, Action } from "../types.js";

/** All AI strategies implement this interface */
export interface Strategy {
  /** Given the current game state, return the best action */
  decide(state: GameState): Promise<Action>;

  /** Optional: reset strategy state between sessions */
  reset?(): void;
}

/** Utility: distance between two points */
export function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Utility: score a blob's value (points / distance) */
export function blobValue(
  blob: { position: { x: number; y: number }; points: number },
  from: { x: number; y: number }
): number {
  const d = dist(blob.position, from);
  return blob.points / (d + 1); // +1 to avoid div/0
}
