import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import chalk from "chalk";
import { CanvasReader } from "./game/canvas-reader.js";
import { GameController } from "./game/controller.js";
import { GreedyStrategy } from "./strategies/greedy.js";
import { RLAgent } from "./strategies/rl-agent.js";
import { ComboStrategy } from "./strategies/combo.js";
import type { Strategy } from "./strategies/base.js";
import { RewardClaimer } from "./mining/reward-claimer.js";
import type { GameState, SessionResult } from "./types.js";

export interface AgentOptions {
  strategy: "greedy" | "rl" | "combo";
  walletKeypair: Keypair;
  rpcUrl: string;
  tokenMint: PublicKey;
  gameUrl: string;
  dryRun?: boolean;
}

export class MiningAgent {
  private browser?: Browser;
  private page?: Page;
  private reader?: CanvasReader;
  private controller?: GameController;
  private strategy?: Strategy;
  private rewardClaimer?: RewardClaimer;
  private connection: Connection;

  constructor(private opts: AgentOptions) {
    this.connection = new Connection(opts.rpcUrl, "confirmed");
  }

  async initialize(): Promise<void> {
    // Launch headless browser
    this.browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 800, height: 600 });

    // Load game
    await this.page.goto(this.opts.gameUrl, { waitUntil: "networkidle2" });

    // Initialize game interface components
    this.reader = new CanvasReader(this.page);
    this.controller = new GameController(this.page);

    // Initialize AI strategy
    this.strategy = this.buildStrategy();

    // Initialize reward claimer
    this.rewardClaimer = new RewardClaimer({
      connection: this.connection,
      keypair: this.opts.walletKeypair,
      tokenMint: this.opts.tokenMint,
      dryRun: this.opts.dryRun ?? false,
    });
  }

  private buildStrategy(): Strategy {
    switch (this.opts.strategy) {
      case "rl":    return new RLAgent();
      case "combo": return new ComboStrategy();
      default:      return new GreedyStrategy();
    }
  }

  /** Run one complete game session and return result */
  async runSession(): Promise<SessionResult> {
    if (!this.reader || !this.controller || !this.strategy || !this.rewardClaimer) {
      throw new Error("Agent not initialized — call initialize() first");
    }

    const startTime = Date.now();
    console.log(chalk.blue("  ▶ Session started"));

    // Start game
    await this.controller.startGame();

    let ticks = 0;
    let finalScore = 0;
    let isAlive = true;

    // Main game loop
    while (isAlive) {
      const state = await this.reader.captureState();
      isAlive = state.isAlive;
      finalScore = state.score;

      if (!isAlive) break;

      // Get action from strategy
      const action = await this.strategy.decide(state);

      // Execute action
      await this.controller.execute(action);

      ticks++;
      await sleep(50); // ~20 FPS decision rate
    }

    const duration = Date.now() - startTime;
    const tokensEarned = await this.rewardClaimer.claim(finalScore);

    const result: SessionResult = {
      score: finalScore,
      ticks,
      durationMs: duration,
      tokensEarned,
      strategy: this.opts.strategy,
      timestamp: Date.now(),
    };

    console.log(chalk.green(
      `  ✓ Score: ${finalScore.toLocaleString()} | Tokens: +${tokensEarned} SQUISH | ${(duration / 1000).toFixed(1)}s`
    ));

    return result;
  }

  async shutdown(): Promise<void> {
    await this.browser?.close();
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
