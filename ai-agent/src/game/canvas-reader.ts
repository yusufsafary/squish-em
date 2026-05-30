import type { Page } from "puppeteer";
import type { GameState, Blob, Vec2 } from "../types.js";

/**
 * Reads the game state by evaluating JavaScript in the browser context.
 * The game exposes a global `window.__SQUISH_STATE__` object that the
 * agent reads each frame.
 *
 * The web game must export state — see src/lib/agent-bridge.ts in the web app.
 */
export class CanvasReader {
  constructor(private page: Page) {}

  async captureState(): Promise<GameState> {
    const raw = await this.page.evaluate(() => {
      const w = window as any;
      // __SQUISH_STATE__ is set by the game loop each frame
      return w.__SQUISH_STATE__ ?? null;
    });

    if (!raw) {
      // Game not started yet or between sessions — return dead state
      return this.deadState();
    }

    return this.parseState(raw);
  }

  private parseState(raw: any): GameState {
    return {
      isAlive: raw.isAlive ?? false,
      score: raw.score ?? 0,
      wave: raw.wave ?? 1,
      lives: raw.lives ?? 0,
      blobs: (raw.blobs ?? []).map((b: any) => this.parseBlob(b)),
      projectiles: raw.projectiles ?? [],
      playerPosition: raw.playerPosition ?? { x: 400, y: 300 },
      combo: {
        count: raw.combo?.count ?? 0,
        multiplier: raw.combo?.multiplier ?? 1,
        timeLeftMs: raw.combo?.timeLeftMs ?? 0,
      },
      canvasWidth: raw.canvasWidth ?? 800,
      canvasHeight: raw.canvasHeight ?? 600,
      timestamp: Date.now(),
    };
  }

  private parseBlob(b: any): Blob {
    return {
      id: b.id ?? String(Math.random()),
      position: { x: b.x ?? 0, y: b.y ?? 0 },
      radius: b.radius ?? 20,
      type: b.type ?? "normal",
      hp: b.hp ?? 1,
      points: b.points ?? 100,
    };
  }

  private deadState(): GameState {
    return {
      isAlive: false,
      score: 0,
      wave: 0,
      lives: 0,
      blobs: [],
      projectiles: [],
      playerPosition: { x: 400, y: 300 },
      combo: { count: 0, multiplier: 1, timeLeftMs: 0 },
      canvasWidth: 800,
      canvasHeight: 600,
      timestamp: Date.now(),
    };
  }
}
