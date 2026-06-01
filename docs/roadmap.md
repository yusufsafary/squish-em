# SQUISH EM! — Official Roadmap

## Phase 1 — Beta Launch ✅ LIVE
**May 2026**

### v1.1 — Gameplay Upgrade ✅ DONE
**June 2026**

- Smoother blob morphing (faster shape deformation, organic feel)
- Hit squash-stretch animation on all blobs on every bullet hit
- Smooth cannon lerp (silky drag response, no snap)
- Crystal blob new: HP 3, reflects bullets, sparkle aura (unlocks lv.9)
- Ninja blob new: HP 1, super fast, periodic dash attack (unlocks lv.7)
- New shocked expression for boss-surprise moments
- Crystal death flash + double ring shockwave
- New achievements: Crystal Slayer, Ninja Slayer, Unstoppable (20x combo)
- Updated title screen legend with new blob types


- HTML5 canvas blob shooter game
- Web deployment via GitHub Pages
- React + Vite + TypeScript frontend
- How-to-play, about, creator pages
- Combo system, boss waves

**Live at**: https://yusufsafary.github.io/squish-em/game.html

---

## Phase 2 — Mobile 📱
**June 2026** — Target: Google Play Store + Apple App Store

### Android
- [ ] EAS Build configuration
- [ ] Play Store developer account setup
- [ ] App signing & keystore
- [ ] Play Store listing: screenshots, description, icon
- [ ] Internal → Closed → Open testing tracks
- [ ] Production release

### iOS
- [ ] Apple Developer Program enrollment
- [ ] EAS Build iOS configuration
- [ ] TestFlight beta testing
- [ ] App Store Connect listing
- [ ] App Review submission
- [ ] Production release

### Features
- [ ] Home screen with play/leaderboard/profile
- [ ] WebView game integration (native engine in v2)
- [ ] Push notifications for daily challenges
- [ ] Haptic feedback on squish events
- [ ] Portrait-locked for one-thumb play

### Directory: `mobile/`

---

## Phase 3 — Solana Blockchain ⛓️
**Q3 2026** — SQUISH token + NFTs + On-chain leaderboard

### SQUISH Token (SPL)
- [ ] Token program deployment (Anchor)
- [ ] Earn mechanism: verified game session → token award
- [ ] Token economics finalized
- [ ] CoinGecko / Jupiter listing

### NFT Blob Skins (Metaplex)
- [ ] 32 unique skin designs (artwork)
- [ ] NFT program + mint flow
- [ ] Marketplace integration (Tensor / Magic Eden)
- [ ] In-game skin selector reads wallet NFTs

### On-chain Leaderboard
- [ ] Leaderboard program deployment
- [ ] Score submission with game session proof
- [ ] Anti-cheat: server-signed session attestation
- [ ] Global + weekly + friends leaderboards

### Wallet Integration
- [ ] Phantom wallet (web + mobile)
- [ ] Solflare wallet
- [ ] Backpack wallet
- [ ] Mobile Wallet Adapter (MWA) for Android

### Directory: `blockchain/`

---

## Future (Backlog)

- **Tournaments**: On-chain prize pools in SQUISH
- **Guilds**: Team-based blob squishing
- **Staking**: Stake SQUISH for bonus multipliers
- **Creator Mode**: Community-made maps minted as NFTs
- **Cross-chain**: Bridge to Ethereum via Wormhole
