import type { Page } from "puppeteer";
import type { Action, Vec2 } from "../types.js";

/**
 * Sends mouse/keyboard inputs to the game running in the browser.
 */
export class GameController {
  constructor(private page: Page) {}

  /** Click the "Start Game" / "Play Again" button */
  async startGame(): Promise<void> {
    await this.page.evaluate(() => {
      const w = window as any;
      if (typeof w.__SQUISH_START__ === "function") {
        w.__SQUISH_START__();
      }
    });
    await this.sleep(500);
  }

  /** Execute an agent action */
  async execute(action: Action): Promise<void> {
    switch (action.type) {
      case "shoot":
        if (action.target) await this.shoot(action.target);
        break;
      case "move":
        if (action.target) await this.moveTo(action.target);
        break;
      case "idle":
        break;
    }
  }

  /** Click on a canvas position to shoot */
  private async shoot(target: Vec2): Promise<void> {
    const canvas = await this.page.$("canvas");
    if (!canvas) return;
    const box = await canvas.boundingBox();
    if (!box) return;

    await this.page.mouse.click(
      box.x + target.x,
      box.y + target.y,
      { button: "left" }
    );
  }

  /** Move mouse to canvas position (for player movement if mouse-driven) */
  private async moveTo(target: Vec2): Promise<void> {
    const canvas = await this.page.$("canvas");
    if (!canvas) return;
    const box = await canvas.boundingBox();
    if (!box) return;

    await this.page.mouse.move(box.x + target.x, box.y + target.y);
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
