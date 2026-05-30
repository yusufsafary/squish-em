#!/bin/bash
# SQUISH Em! Solana Deployment Script
# Usage: ./scripts/deploy.sh [localnet|devnet|mainnet]

set -e

CLUSTER=${1:-devnet}
echo "Deploying to $CLUSTER..."

# Build programs
anchor build

# Deploy token program
echo "Deploying squish-token..."
TOKEN_ID=$(solana program deploy target/deploy/squish_token.so \
  --url $CLUSTER \
  --keypair ~/.config/solana/id.json)
echo "SQUISH Token Program ID: $TOKEN_ID"

# Deploy NFT program
echo "Deploying squish-nft..."
NFT_ID=$(solana program deploy target/deploy/squish_nft.so \
  --url $CLUSTER \
  --keypair ~/.config/solana/id.json)
echo "SQUISH NFT Program ID: $NFT_ID"

echo ""
echo "Update these IDs in:"
echo "  - blockchain/Anchor.toml"
echo "  - blockchain/sdk/src/nft.ts (NFT_PROGRAM_ID)"
echo "  - blockchain/sdk/src/leaderboard.ts (LEADERBOARD_PROGRAM_ID)"
echo "  - src/lib/solana.ts (web frontend)"
echo "  - mobile/store/wallet.ts (mobile)"
