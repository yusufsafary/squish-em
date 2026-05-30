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
├── public/           # Static assets
├── *.html            # Game & page entry points
│
├── mobile/           # Phase 2: Expo React Native (Android + iOS)
│   ├── app/          #   Screens (Expo Router)
│   ├── hooks/        #   React hooks
│   ├── store/        #   Zustand state
│   └── constants/    #   Colors, config
│
├── blockchain/       # Phase 3: Solana
│   ├── programs/
│   │   ├── squish-token/   # SPL token (Anchor/Rust)
│   │   └── squish-nft/     # Metaplex NFT skins (Anchor/Rust)
│   ├── sdk/          #   TypeScript SDK for web + mobile
│   └── scripts/      #   Deployment scripts
│
└── docs/             # Full documentation
    ├── roadmap.md
    ├── architecture.md
    ├── mobile/setup.md
    └── blockchain/setup.md
```

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
