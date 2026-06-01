# Squish Em! — Solana Blockchain

**Phase 3 of the Squish Em! Roadmap** — Q3 2026

## Programs

| Program | Description | Status |
|---------|-------------|--------|
| `squish-token` | SPL token — earn by playing, spend on skins | Development |
| `squish-nft` | Metaplex NFT blob skins | Development |
| `squish-mining` | Session proof validation + token awards | Development |
| `squish-leaderboard` | On-chain verifiable global/weekly scores | Development |

## SDK

The `sdk/` package is a TypeScript SDK for both the web app and mobile app.

```ts
import {
  getSquishBalance,
  getOwnedSkins,
  getTopScores,
  calculateReward,
  connectWallet,
  getTierForAmount,
} from "@squish-em/solana-sdk";
```

## Architecture

```
Player plays game
    → Game server verifies session + signs attestation
    → squish-mining: verify proof, check replay nonce
    → squish-token: mint SQUISH to player ATA
    → squish-leaderboard: update on-chain high score

Player buys skin
    → Frontend builds mint_skin tx (SQUISH burn + NFT mint)
    → Player signs with wallet (Phantom/Solflare/Backpack)
    → squish-nft: burn SQUISH, mint Metaplex NFT
    → Game reads wallet NFTs on next load → applies skin

Player stakes
    → stakeTokens() locks SQUISH in stake PDA
    → multiplier applied to future mining rewards
    → unstakeTokens() after lock period expires
```

## Getting Started

### Prerequisites
- Rust + `cargo`
- [Solana CLI](https://docs.solanalabs.com/cli/install)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) — `avm install 0.30.0`

### Build & Test

```bash
cd blockchain
anchor build
anchor test
```

### Deploy (devnet)

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh devnet
```

## Token Economics

| Action | SQUISH Earned/Spent |
|--------|---------------------|
| Per 100 points scored | +1 SQUISH |
| Max per session | +1,000 SQUISH |
| Daily cap | 2,000 SQUISH |
| Common skin | 0 SQUISH (free) |
| Rare skin | 100 SQUISH |
| Epic skin | 500 SQUISH |
| Legendary skin | 2,000 SQUISH |

## Documentation

- `docs/blockchain/token-economics.md` — full token utility & supply model
- `docs/blockchain/strategy.md` — blockchain architecture strategy
- `docs/blockchain/setup.md` — local development setup
