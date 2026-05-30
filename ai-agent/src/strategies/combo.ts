import type { Strategy } from "./base.js";
import { dist } from "./base.js";
import type { GameState, Action, Blob } from "../types.js";

/**
 * Combo Maximizer Strategy
 *
 * Plans the optimal shot sequence to maximize combo chains.
 * Solves a greedy TSP: order blobs by shortest-path to chain as many as possible
 * within the combo window (~500ms per hit).
 *
 * Significantly outperforms greedy on score in dense waves.
 */
export class ComboStrategy implements Strategy {
  private shotQueue: Blob[] = [];
  private lastShotTime = 0;

  async decide(state: GameState): Promise<Action> {
    if (state.blobs.length === 0) {
      this.shotQueue = [];
      return { type: "idle" };
    }

    // Replan every 10 ticks or when queue is exhausted
    if (this.shotQueue.length === 0 || Date.now() - this.lastShotTime > 800) {
      this.shotQueue = this.planRoute(state.blobs, state.playerPosition);
    }

    const next = this.shotQueue.shift();
    if (!next) return { type: "idle" };

    this.lastShotTime = Date.now();
    return { type: "shoot", target: next.position };
  }

  /**
   * Nearest-neighbor TSP heuristic: start from player position,
   * repeatedly pick the closest remaining blob.
   * Prefers blobs that are close together (chain-friendly).
   */
  private planRoute(blobs: Blob[], start: { x: number; y: number }): Blob[] {
    const remaining = [...blobs];
    const route: Blob[] = [];
    let current = start;

    while (remaining.length > 0) {
      let bestIdx = 0;
      let bestScore = -Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const blob = remaining[i];
        const d = dist(blob.position, current);
        // Favor blobs close to each other (chain bonus) and high points
        const neighborBonus = this.neighborDensity(blob, remaining);
        const score = blob.points * (1 + neighborBonus * 0.5) / (d + 1);
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }

      const chosen = remaining.splice(bestIdx, 1)[0];
      route.push(chosen);
      current = chosen.position;
    }

    return route;
  }

  /** Count blobs within combo-chain radius (~80px) */
  private neighborDensity(blob: Blob, others: Blob[]): number {
    return others.filter(
      (b) => b.id !== blob.id && dist(b.position, blob.position) < 80
    ).length;
  }

  reset() {
    this.shotQueue = [];
  }
}
