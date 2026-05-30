# Blockchain — Setup Guide

## Prerequisites

1. **Rust**: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. **Solana CLI**: `sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"`
3. **Anchor CLI**: `cargo install --git https://github.com/coral-xyz/anchor avm --force && avm install 0.30.0 && avm use 0.30.0`
4. **Node.js** 18+ (for SDK and tests)

## Local Development

```bash
# Start local validator
solana-test-validator

# In another terminal
cd blockchain
anchor build
anchor test
```

## Devnet Deployment

```bash
# Configure wallet
solana config set --url devnet
solana airdrop 2

# Deploy
./scripts/deploy.sh devnet
```

## SDK Development

```bash
cd blockchain/sdk
npm install
npm run dev  # watch mode
```

Import in the web app:
```ts
import { getSquishBalance, getOwnedSkins, getTopScores } from "@squish-em/solana-sdk";
```

## Wallet Setup for Testing

1. Install [Phantom](https://phantom.app) browser extension
2. Switch to Devnet in Phantom settings
3. Get devnet SOL: `solana airdrop 2 <your-wallet-address> --url devnet`

## Security Notes

- Program upgrade authority should be a multisig (Squads) on mainnet
- Game server keypair for token awards must be kept secure
- Anti-cheat: session proofs signed by game server, verified on-chain
