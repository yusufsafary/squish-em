# AI Mining Agent — Setup Guide

## What It Does

The AI Mining Agent autonomously plays Squish Em! in a headless browser (Puppeteer), achieves high scores, then submits session proofs to the Solana blockchain to earn SQUISH tokens — automatically.

## Prerequisites

- Node.js 18+
- A Solana wallet keypair (`~/.config/solana/id.json`)
- Devnet SOL for transaction fees: `solana airdrop 2`

## Quick Start

```bash
cd ai-agent
npm install

# Dry-run: test without on-chain transactions
npm run mine -- --dry-run --strategy greedy

# Live mining: 10 sessions with combo strategy
npm run mine -- --strategy combo --sessions 10

# Unlimited mining
npm run mine -- --strategy rl
```

## Strategies

### ⚡ Greedy (`--strategy greedy`)
Always targets the blob with the highest `(points / distance)` ratio. Prioritizes boss blobs at any distance. **Best for getting started** — no setup required.

### 🔗 Combo (`--strategy combo`)
Plans shot sequences using a nearest-neighbor TSP heuristic to chain as many blobs as possible within the combo window. Achieves 20-40% higher scores than greedy on dense waves.

### 🧠 RL (`--strategy rl`)
Deep Q-Network (DQN) trained via self-play using TensorFlow.js. Requires training before use:

```bash
npm run train -- --episodes 5000
```

The trained model is saved to `models/rl-policy/` and loaded automatically on the next run.

**State encoding (20 features):**
- Player position (normalized)
- Top-3 blob positions, types, HP (15 features)
- Combo count, time remaining
- Wave number

**Architecture:** 3-layer MLP (128→64→4), Adam optimizer, ε-greedy exploration with decay.

## Environment Variables

Create `ai-agent/.env`:

```env
SOLANA_RPC_URL=https://api.devnet.solana.com
SQUISH_TOKEN_MINT=REPLACE_AFTER_DEPLOY
SQUISH_MINING_PROGRAM=REPLACE_AFTER_DEPLOY
AGENT_KEYPAIR_PATH=~/.config/solana/id.json
GAME_URL=https://yusufsafary.github.io/squish-em/game.html
```

## Mining Stats

```bash
node dist/index.js status
```

Stats are persisted to `mining-log.json`. Each session records: score, tokens earned, strategy, duration, Solana tx signature.

## How Anti-Cheat Works

The mining program requires a **session attestation** signed by the game server:

```
Server signs: SHA256(wallet_pubkey || score || timestamp || nonce)
Agent submits: proof + award_tokens instruction
Program verifies: ed25519 signature + nonce freshness (< 5 min) + replay check
```

This means only sessions that actually occurred on the game server can earn tokens — the AI must genuinely play and achieve the score.

## In-Browser Agent (Web)

The web game also has a built-in agent that runs in a **WebWorker** (no Puppeteer needed):

1. Go to the Play page
2. Open the **Mining Panel** (bottom-right)
3. Select strategy and click "Start Mining"
4. The agent plays autonomously in the game canvas

## Mobile Agent

The mobile app's **Mine tab** injects JavaScript into the game WebView:
- Reads `window.__SQUISH_STATE__` every 50ms
- Dispatches synthetic touch events on the canvas
- Auto-restarts sessions
- Posts score updates and game-over events back to React Native

## Architecture

```
┌─────────────────────────────────────────────────┐
│                AI Mining Agent                  │
│                                                 │
│  ┌──────────────┐    ┌───────────────────────┐  │
│  │ Puppeteer    │    │  Strategy Engine      │  │
│  │ headless     │◄──►│  • Greedy             │  │
│  │ browser      │    │  • Combo (TSP)        │  │
│  └──────┬───────┘    │  • RL (DQN/TF.js)     │  │
│         │            └───────────────────────┘  │
│  ┌──────▼───────┐                               │
│  │ Canvas       │    ┌───────────────────────┐  │
│  │ Reader       │    │  Mining Scheduler     │  │
│  │ (game state) │    │  • Session management │  │
│  └──────┬───────┘    │  • Cooldown handling  │  │
│         │            │  • Stats tracking     │  │
│  ┌──────▼───────┐    └───────────────────────┘  │
│  │ Game         │                               │
│  │ Controller   │    ┌───────────────────────┐  │
│  │ (mouse input)│    │  Reward Claimer       │  │
│  └──────────────┘    │  • Get server proof   │  │
│                      │  • Submit on-chain    │  │
│                      │  • Confirm tx         │  │
│                      └───────────────────────┘  │
└─────────────────────────────────────────────────┘
           │                      │
           ▼                      ▼
    Game Server              Solana Mainnet
    (signs proof)         (mints SQUISH tokens)
```
