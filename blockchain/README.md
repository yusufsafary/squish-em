# Squish Em! — Solana Blockchain

**Phase 3 of the Squish Em! Roadmap** — Q3 2026

## Programs

| Program | Description | Status |
|---------|-------------|--------|
| `squish-token` | SPL token — earn by playing, spend on skins | Development |
| `squish-nft` | Metaplex NFT blob skins | Development |

## SDK

The `sdk/` package is a TypeScript SDK for both the web app and mobile app to interact with on-chain programs.

```ts
import { getSquishBalance, getTopScores, getOwnedSkins } from "@squish-em/solana-sdk";
```

## Architecture

```
Player plays game
    → Game server verifies session
    → Calls award_tokens instruction
    → Player receives SQUISH tokens

Player buys skin
    → Frontend builds mint_skin tx
    → Player signs with wallet (Phantom/Solflare)
    → NFT minted to player's wallet
    → Game reads owned NFTs to apply skin

Player posts score
    → Frontend builds submit_score tx
    → Player signs
    → Score stored on-chain
    → Leaderboard reads all score accounts
```

## Getting Started

### Prerequisites
- Rust + `cargo` 
- [Solana CLI](https://docs.solanalabs.com/cli/install) 
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) `avm install 0.30.0`

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
| Common skin | 0 SQUISH (free) |
| Rare skin | 100 SQUISH |
| Epic skin | 500 SQUISH |
| Legendary skin | 2,000 SQUISH |
