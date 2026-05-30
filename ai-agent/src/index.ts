#!/usr/bin/env node
import { program } from "commander";
import chalk from "chalk";
import ora from "ora";
import { MiningAgent } from "./agent.js";
import { MiningScheduler } from "./mining/scheduler.js";
import { loadConfig } from "./config.js";

program
  .name("squish-agent")
  .description("SQUISH Em! AI Mining Agent — earn SQUISH tokens automatically")
  .version("0.1.0");

program
  .command("mine")
  .description("Start autonomous mining sessions")
  .option("-s, --strategy <name>", "AI strategy: greedy | rl | combo", "greedy")
  .option("-n, --sessions <count>", "Number of sessions to run (0 = unlimited)", "0")
  .option("-d, --dry-run", "Run without submitting scores on-chain")
  .action(async (opts) => {
    const config = await loadConfig();
    const spinner = ora("Initializing AI Mining Agent...").start();

    const agent = new MiningAgent({
      strategy: opts.strategy,
      walletKeypair: config.walletKeypair,
      rpcUrl: config.rpcUrl,
      tokenMint: config.tokenMint,
      gameUrl: config.gameUrl,
      dryRun: opts.dryRun,
    });

    await agent.initialize();
    spinner.succeed(chalk.green("Agent ready"));

    const scheduler = new MiningScheduler(agent, {
      maxSessions: parseInt(opts.sessions),
      cooldownMs: 5_000,
    });

    console.log(chalk.cyan("\n🤖 Starting AI Mining Agent"));
    console.log(chalk.gray(`   Strategy: ${opts.strategy}`));
    console.log(chalk.gray(`   Mode: ${opts.dryRun ? "dry-run" : "live (on-chain)"}`));
    console.log(chalk.gray(`   Sessions: ${opts.sessions === "0" ? "unlimited" : opts.sessions}\n`));

    await scheduler.run();
  });

program
  .command("train")
  .description("Train the RL agent model")
  .option("-e, --episodes <count>", "Training episodes", "1000")
  .action(async (opts) => {
    const { RLAgent } = await import("./strategies/rl-agent.js");
    const rl = new RLAgent();
    await rl.train(parseInt(opts.episodes));
  });

program
  .command("status")
  .description("Show mining stats")
  .action(async () => {
    const config = await loadConfig();
    const { MiningStats } = await import("./mining/stats.js");
    const stats = new MiningStats(config);
    await stats.print();
  });

program.parse();
