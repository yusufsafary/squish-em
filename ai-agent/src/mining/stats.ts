import type { SessionResult, MiningStats } from "../types.js";
import { writeFileSync, readFileSync, existsSync } from "fs";

const LOG_PATH = "./mining-log.json";

export class StatsTracker {
  private sessions: SessionResult[] = [];

  constructor() {
    if (existsSync(LOG_PATH)) {
      try {
        this.sessions = JSON.parse(readFileSync(LOG_PATH, "utf8"));
      } catch {}
    }
  }

  record(session: SessionResult): void {
    this.sessions.push(session);
    writeFileSync(LOG_PATH, JSON.stringify(this.sessions, null, 2));
  }

  get(): MiningStats {
    if (this.sessions.length === 0) {
      return {
        totalSessions: 0,
        totalScore: 0,
        totalTokensEarned: 0,
        bestScore: 0,
        avgScore: 0,
        totalPlaytimeMs: 0,
        lastSession: null,
      };
    }

    const totalScore = this.sessions.reduce((s, r) => s + r.score, 0);
    return {
      totalSessions: this.sessions.length,
      totalScore,
      totalTokensEarned: this.sessions.reduce((s, r) => s + r.tokensEarned, 0),
      bestScore: Math.max(...this.sessions.map((r) => r.score)),
      avgScore: totalScore / this.sessions.length,
      totalPlaytimeMs: this.sessions.reduce((s, r) => s + r.durationMs, 0),
      lastSession: this.sessions[this.sessions.length - 1],
    };
  }

  async print(): Promise<void> {
    const s = this.get();
    console.log("\n📊 Mining Stats");
    console.log(`  Sessions:      ${s.totalSessions}`);
    console.log(`  Total SQUISH:  ${s.totalTokensEarned}`);
    console.log(`  Best Score:    ${s.bestScore.toLocaleString()}`);
    console.log(`  Avg Score:     ${Math.round(s.avgScore).toLocaleString()}`);
    console.log(`  Total Playtime: ${(s.totalPlaytimeMs / 3600000).toFixed(2)}h`);
  }
}
