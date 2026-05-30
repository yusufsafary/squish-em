import chalk from "chalk";
import ora from "ora";
import type { MiningAgent } from "../agent.js";
import type { SessionResult, MiningStats } from "../types.js";
import { StatsTracker } from "./stats.js";

export interface SchedulerOptions {
  maxSessions: number;  // 0 = unlimited
  cooldownMs: number;   // Pause between sessions
}

/**
 * Schedules and manages continuous mining sessions.
 * Tracks stats, handles errors, respects session limits.
 */
export class MiningScheduler {
  private stats: StatsTracker;

  constructor(
    private agent: MiningAgent,
    private opts: SchedulerOptions
  ) {
    this.stats = new StatsTracker();
  }

  async run(): Promise<void> {
    let sessionCount = 0;
    const unlimited = this.opts.maxSessions === 0;

    while (unlimited || sessionCount < this.opts.maxSessions) {
      sessionCount++;
      const label = `Session #${sessionCount}${unlimited ? "" : ` / ${this.opts.maxSessions}`}`;
      const spinner = ora(label).start();

      try {
        const result = await this.agent.runSession();
        this.stats.record(result);
        spinner.stop();
        this.printSessionResult(sessionCount, result);
      } catch (err: any) {
        spinner.fail(chalk.red(`Session #${sessionCount} failed: ${err.message}`));
        await sleep(2000); // Back off on error
      }

      // Print cumulative stats every 5 sessions
      if (sessionCount % 5 === 0) {
        this.printCumulativeStats();
      }

      if (unlimited || sessionCount < this.opts.maxSessions) {
        await sleep(this.opts.cooldownMs);
      }
    }

    console.log(chalk.cyan("\n📊 Final Mining Summary:"));
    this.printCumulativeStats();
    await this.agent.shutdown();
  }

  private printSessionResult(n: number, r: SessionResult): void {
    const elapsed = (r.durationMs / 1000).toFixed(1);
    console.log(
      chalk.white(`  #${n} `) +
      chalk.yellow(`Score: ${r.score.toLocaleString().padStart(8)} `) +
      chalk.green(`+${r.tokensEarned} SQUISH `) +
      chalk.gray(`[${elapsed}s | ${r.ticks} ticks]`)
    );
  }

  private printCumulativeStats(): void {
    const s = this.stats.get();
    console.log(chalk.cyan([
      `\n  📈 Cumulative: `,
      `Sessions: ${s.totalSessions} | `,
      `Total SQUISH: ${s.totalTokensEarned} | `,
      `Best Score: ${s.bestScore.toLocaleString()} | `,
      `Avg Score: ${Math.round(s.avgScore).toLocaleString()}`,
    ].join("")));
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
