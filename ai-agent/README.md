# SQUISH Em! — AI Mining Agent

Autonomous bot that plays Squish Em! and earns SQUISH tokens on Solana.

## How It Works

```
AI Agent (Puppeteer headless browser)
    → Reads game state via window.__SQUISH_STATE__
    → AI strategy decides best shot/move
    → Sends mouse inputs to canvas
    → Session ends → score submitted to game server
    → Server signs attestation proof (anti-cheat)
    → Agent submits proof + award_tokens ix to Solana
    → SQUISH tokens minted to agent wallet
```

## Strategies

| Strategy | Description | Score Tier |
|----------|-------------|------------|
| `greedy` | Always targets highest (points/distance) blob | Good |
| `combo`  | Plans shot sequences to maximize chain combos | Great |
| `rl`     | DQN trained via self-play (TensorFlow.js) | Best (after training) |

## Quick Start

```bash
cd ai-agent
npm install

# Set your Solana wallet keypair
export AGENT_KEYPAIR_PATH=~/.config/solana/id.json
export SOLANA_RPC_URL=https://api.devnet.solana.com

# Dry run (no on-chain txs)
npm run mine -- --dry-run --strategy greedy

# Live mining (earns real SQUISH)
npm run mine -- --strategy combo --sessions 10

# Unlimited mining
npm run mine -- --strategy rl
```

## Training the RL Agent

```bash
npm run train -- --episodes 5000
```

Model is saved to `models/rl-policy/` and loaded automatically on next run.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SOLANA_RPC_URL` | devnet | Solana RPC endpoint |
| `SQUISH_TOKEN_MINT` | — | SQUISH SPL token mint address |
| `SQUISH_MINING_PROGRAM` | — | On-chain mining program ID |
| `AGENT_KEYPAIR_PATH` | `~/.config/solana/id.json` | Wallet for receiving tokens |
| `GAME_URL` | GitHub Pages URL | Game URL to run |

## Mining Stats

```bash
npm run mine status
```

Stats are logged to `mining-log.json` — includes per-session score, tokens earned, duration.

## Architecture

```
ai-agent/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── agent.ts              # MiningAgent orchestrator
│   ├── config.ts             # Config loading
│   ├── types.ts              # Shared types (GameState, Action, etc.)
│   ├── game/
│   │   ├── canvas-reader.ts  # Reads game state via window.__SQUISH_STATE__
│   │   └── controller.ts     # Sends mouse inputs to game canvas
│   ├── strategies/
│   │   ├── base.ts           # Strategy interface + utils
│   │   ├── greedy.ts         # Greedy targeting
│   │   ├── combo.ts          # Combo chain optimizer (TSP heuristic)
│   │   └── rl-agent.ts       # DQN reinforcement learning
│   └── mining/
│       ├── reward-claimer.ts # Submits scores + claims SQUISH on-chain
│       ├── scheduler.ts      # Manages continuous sessions
│       └── stats.ts          # Session logging + stats display
└── models/
    └── rl-policy/            # Trained model weights (after training)
```
