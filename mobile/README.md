# Squish Em! — Mobile App

**Phase 2 of the Squish Em! Roadmap** — Android (Play Store) + iOS (App Store)

## Tech Stack

- **Framework**: Expo SDK 51 + Expo Router (file-based routing)
- **Language**: TypeScript
- **State**: Zustand + AsyncStorage
- **Animations**: React Native Reanimated 3
- **Blockchain**: `@solana/web3.js` + `@solana/spl-token` (Phase 3)

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Home | `/(tabs)/` | Landing with play/leaderboard/NFT buttons |
| Play | `/(tabs)/play` | HTML5 game via WebView (native engine in v2) |
| Leaderboard | `/(tabs)/leaderboard` | Global on-chain leaderboard |
| Profile | `/(tabs)/profile` | Wallet + user stats |
| NFT Skins | `/nft-skins` | Browse & buy blob skins |
| Wallet | `/wallet` | SQUISH token balance |

## Getting Started

```bash
cd mobile
npm install
npx expo start
```

## Building for Stores

```bash
# Android APK / AAB
npm run build:android

# iOS IPA
npm run build:ios
```

Requires [EAS CLI](https://docs.expo.dev/build/introduction/) and configured `eas.json`.

## Roadmap Integration

- **Phase 2 (June 2026)**: Store submission via EAS Build + EAS Submit
- **Phase 3 (Q3 2026)**: Solana wallet, SQUISH token rewards, NFT skins
