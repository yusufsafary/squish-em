# SQUISH 'EM!

A kawaii HTML5 Canvas blob shooter game. Shoot blobs, chain combos, survive boss waves.

## Play

- [Play Now](https://yusufsafary.github.io/squish-em/game.html)

## Roadmap

| Phase | Timeline | Status |
|-------|----------|--------|
| **Beta Launch** — Web game live | May 2026 | ✅ LIVE |
| **Mobile** — Android (Play Store) + iOS (App Store) | June 2026 | 🔨 In Progress |
| **Solana** — SQUISH token, NFT blob skins, on-chain leaderboard | Q3 2026 | 📋 Planned |

## Repository Structure

```
squish-em/
├── src/              # Web app source (React + Vite)
│   ├── lib/          #   agent-bridge.ts, mining-worker.ts (WebWorker)
│   ├── hooks/        #   useMiningAgent.ts
│   ├── components/   #   MiningPanel.tsx (HUD overlay)
│   └── pages/        #   mining.tsx (Mining dashboard)
├── public/           # Static assets
├── *.html            # Game & page entry points
│
├── ai-agent/         # AI Mining Agent (Node.js / Puppeteer)
│   ├── src/
│   │   ├── agent.ts            #   MiningAgent orchestrator
│   │   ├── game/               #   Canvas reader + controller
│   │   ├── strategies/         #   Greedy, Combo, RL (DQN/TensorFlow.js)
│   │   └── mining/             #   Scheduler, reward claimer, stats
│   └── models/                 #   Trained RL model weights
│
├── mobile/           # Phase 2: Expo React Native (Android + iOS)
│   ├── app/(tabs)/
│   │   └── mine.tsx            #   AI Mining tab (WebView + injected agent)
│   ├── store/mining.ts         #   Mining state (Zustand)
│   └── ...
│
├── blockchain/       # Phase 3: Solana
│   ├── programs/
│   │   ├── squish-token/       # SPL token (Anchor/Rust)
│   │   ├── squish-nft/         # Metaplex NFT skins (Anchor/Rust)
│   │   └── squish-mining/      # Mining program — validates sessions, awards tokens
│   ├── sdk/src/
│   │   └── mining.ts           # Session proof + reward claim SDK
│   └── scripts/
│
└── docs/             # Full documentation
    ├── roadmap.md
    ├── architecture.md
    ├── ai-agent/setup.md
    ├── mobile/setup.md
    └── blockchain/setup.md
```

## AI Mining Agent

The autonomous bot plays the game and earns SQUISH tokens:

```bash
cd ai-agent
npm install

# Dry-run (no on-chain txs)
npm run mine -- --dry-run --strategy greedy

# Live mining
npm run mine -- --strategy combo
```

Three strategies: **Greedy** (fast, reliable), **Combo** (chains shots for multipliers), **RL** (DQN trained via self-play).

See [docs/ai-agent/setup.md](docs/ai-agent/setup.md) for full guide.

## Phase 2 — Mobile

```bash
cd mobile
npm install
npx expo start
```

See [docs/mobile/setup.md](docs/mobile/setup.md) for store submission guide.

## Phase 3 — Solana Blockchain

```bash
cd blockchain
anchor build
anchor test
```

See [docs/blockchain/setup.md](docs/blockchain/setup.md) for deployment guide.

**Token Economics:**
- Earn 1 SQUISH per 100 points (max 1,000 per session)
- Spend SQUISH on NFT blob skins (100–2,000 SQUISH each)
- On-chain leaderboard with signed score proofs

## Contributing

See [docs/architecture.md](docs/architecture.md) for the full architecture overview.
