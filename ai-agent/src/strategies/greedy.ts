import type { Strategy } from "./base.js";
import { blobValue } from "./base.js";
import type { GameState, Action, Blob } from "../types.js";

/**
 * Greedy Strategy
 *
 * Always targets the blob with the highest (points / distance) ratio.
 * Prioritizes: boss > armored > fast > normal at equal distance.
 * Fast, deterministic, good baseline.
 */
export class GreedyStrategy implements Strategy {
  async decide(state: GameState): Promise<Action> {
    if (state.blobs.length === 0) {
      return { type: "idle" };
    }

    const player = state.playerPosition;

    // Score each blob
    const best = state.blobs.reduce<Blob | null>((winner, blob) => {
      if (!winner) return blob;
      const wScore = blobValue(winner, player) * this.typeMultiplier(winner.type);
      const bScore = blobValue(blob, player) * this.typeMultiplier(blob.type);
      return bScore > wScore ? blob : winner;
    }, null);

    if (!best) return { type: "idle" };

    // If combo is active, try to chain by targeting the blob closest to our last shot
    if (state.combo.count > 2 && state.combo.timeLeftMs > 200) {
      const chainTarget = this.findChainTarget(state);
      if (chainTarget) {
        return { type: "shoot", target: chainTarget.position };
      }
    }

    return { type: "shoot", target: best.position };
  }

  private typeMultiplier(type: Blob["type"]): number {
    switch (type) {
      case "boss":    return 5;
      case "armored": return 2;
      case "fast":    return 1.5;
      default:        return 1;
    }
  }

  private findChainTarget(state: GameState) {
    // Find the blob closest to the center of all blobs (likely to chain combos)
    if (state.blobs.length < 2) return null;
    const cx = state.blobs.reduce((s, b) => s + b.position.x, 0) / state.blobs.length;
    const cy = state.blobs.reduce((s, b) => s + b.position.y, 0) / state.blobs.length;
    return state.blobs.reduce((best, blob) => {
      const bd = Math.hypot(blob.position.x - cx, blob.position.y - cy);
      const wd = Math.hypot(best.position.x - cx, best.position.y - cy);
      return bd < wd ? blob : best;
    });
  }
}
