# Mobile App — Setup Guide

## Prerequisites

1. **Node.js** 18+
2. **Expo CLI**: `npm install -g expo-cli`
3. **EAS CLI**: `npm install -g eas-cli`
4. For iOS: macOS + Xcode 15+
5. For Android: Android Studio + Android SDK

## Local Development

```bash
cd mobile
npm install
npx expo start
```

Press `a` for Android emulator, `i` for iOS simulator, or scan QR with Expo Go.

## EAS Build Setup

```bash
eas login
eas build:configure
```

Edit `mobile/eas.json` with your Apple Team ID and Android keystore.

### Android Build
```bash
cd mobile
eas build --platform android --profile preview
```

### iOS Build
```bash
cd mobile
eas build --platform ios --profile preview
```

## Store Submission

### Google Play Store
1. Create app in [Play Console](https://play.google.com/console)
2. Upload AAB: `eas build --platform android --profile production`
3. `eas submit --platform android`

### Apple App Store
1. Create app in [App Store Connect](https://appstoreconnect.apple.com)
2. Build IPA: `eas build --platform ios --profile production`
3. `eas submit --platform ios`

## Environment Variables

Create `mobile/.env`:
```
EXPO_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
EXPO_PUBLIC_SQUISH_TOKEN_MINT=REPLACE_AFTER_DEPLOY
EXPO_PUBLIC_NFT_PROGRAM_ID=REPLACE_AFTER_DEPLOY
```
