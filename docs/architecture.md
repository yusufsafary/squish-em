# SQUISH EM! — Architecture Overview

## Repository Structure

```
squish-em/
├── src/                    # Phase 1: Web app source (React + Vite)
│   ├── pages/              #   Routes: home, play, roadmap, how-to-play
│   ├── components/         #   UI + game components
│   ├── hooks/              #   React hooks
│   └── lib/                #   Utilities
├── public/                 # Static assets
├── *.html                  # HTML entry points (game, index, about, etc.)
│
├── mobile/                 # Phase 2: Expo React Native app
│   ├── app/                #   Expo Router screens
│   │   ├── (tabs)/         #     Tab bar screens
│   │   ├── nft-skins.tsx   #     NFT marketplace
│   │   └── wallet.tsx      #     SQUISH token wallet
│   ├── components/         #   Shared RN components
│   ├── hooks/              #   React hooks (leaderboard, etc.)
│   ├── store/              #   Zustand stores (wallet, game state)
│   ├── constants/          #   Colors, config
│   └── app.json            #   Expo config
│
├── blockchain/             # Phase 3: Solana programs + SDK
│   ├── programs/
│   │   ├── squish-token/   #   SPL token program (Anchor/Rust)
│   │   └── squish-nft/     #   Metaplex NFT program (Anchor/Rust)
│   ├── sdk/                #   TypeScript SDK for web + mobile
│   │   └── src/
│   │       ├── token.ts    #     SQUISH token helpers
│   │       ├── nft.ts      #     NFT skin helpers
│   │       └── leaderboard.ts # On-chain leaderboard
│   ├── scripts/            #   Deployment scripts
│   └── Anchor.toml         #   Anchor workspace config
│
└── docs/                   # Documentation
    ├── roadmap.md
    ├── architecture.md     ← you are here
    ├── mobile/
    └── blockchain/
```

## Data Flow

### Game Session → Token Reward (Phase 3)
```
Browser/App → Game ends → POST /api/session {score, proof}
    → Game server validates session
    → Calls squish-token program: award_tokens(player, score)
    → Solana emits TokensAwarded event
    → Frontend refreshes SQUISH balance
```

### Buy NFT Skin
```
Player selects skin → Frontend builds mint_skin transaction
    → Player signs with Phantom/Solflare/Backpack
    → squish-nft program: mint_skin(skin_id, metadata_uri)
    → Metaplex NFT created in player's wallet
    → Game polls wallet NFTs on next load → applies skin
```

## Tech Stack by Phase

| Layer | Phase 1 | Phase 2 | Phase 3 |
|-------|---------|---------|---------|
| Frontend | React + Vite | React Native + Expo | + Solana wallet adapter |
| Game engine | HTML5 Canvas | WebView → native | Same + on-chain score submit |
| Data | localStorage | AsyncStorage | Solana on-chain |
| Deploy | GitHub Pages | EAS + Play/App Store | Solana mainnet |
| Language | TypeScript | TypeScript | Rust (programs) + TS (SDK) |
