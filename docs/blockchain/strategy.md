# Blockchain Architecture Strategy

> Phase 3 — Q3 2026

## Why Solana

| Criteria | Solana | Ethereum | BNB Chain |
|----------|--------|----------|-----------|
| Transaction fee | ~$0.0005 | ~$1–20 | ~$0.05 |
| Finality | 400ms | 12 seconds | 3 seconds |
| Throughput | 65,000 TPS | 15–30 TPS | 300 TPS |
| SPL token tooling | Native | ERC-20 port | BEP-20 port |
| Metaplex NFT standard | Native | Manual | Manual |
| Mobile wallet support | MWA (native) | WalletConnect | WalletConnect |

For a real-time game where players earn tokens every session (sub-second feedback required),
Solana is the only L1 that makes this feel instant rather than painful.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│  Client Layer (Web + Mobile)                        │
│  React/Vite + Expo — @squish-em/solana-sdk          │
│  Phantom / Solflare / Backpack / MWA                │
└──────────────────┬──────────────────────────────────┘
                   │ TypeScript SDK calls
┌──────────────────▼──────────────────────────────────┐
│  Game Server (api.squishem.io)                      │
│  Express — session validation + attestation signing │
│  Holds game-server keypair (HSM in production)      │
└──────────────────┬──────────────────────────────────┘
                   │ Signed session proofs
┌──────────────────▼──────────────────────────────────┐
│  Solana Programs (Anchor 0.30 / Rust)               │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │ squish-mining   │  │ squish-token (SPL)       │  │
│  │ - verify proof  │→ │ - mint to player ATA     │  │
│  │ - replay guard  │  │ - treasury management    │  │
│  └─────────────────┘  └──────────────────────────┘  │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │ squish-nft      │  │ squish-leaderboard       │  │
│  │ - Metaplex mint │  │ - on-chain scores        │  │
│  │ - SQUISH burn   │  │ - verifiable ranking     │  │
│  └─────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Anti-Cheat Strategy

Bot farming is the existential threat to any play-to-earn economy. SQUISH EM! uses a
layered defense:

### Layer 1 — Server Attestation (off-chain)
The game server monitors session telemetry (timing, event frequency, mouse entropy) and
only signs sessions that look human. No signature → program rejects the claim.

### Layer 2 — On-chain Replay Protection
Every claim uses a unique nonce. The `squish-mining` program stores all used nonces in
`SessionRecord` PDAs. Submitting the same nonce twice is rejected at the program level.

### Layer 3 — Timestamp Freshness
Session proofs expire in **5 minutes**. A signed proof cannot be stockpiled.

### Layer 4 — Daily Cap
The program enforces a per-wallet daily ceiling (2,000 SQUISH). Even if all other checks
pass, a whale-farming wallet hits a ceiling.

### Layer 5 — Server Key Rotation
The game server keypair can be rotated via `update_server_key`. If a signing key is
compromised, it is rotated and old sessions expire within 5 minutes.

---

## Wallet Integration Strategy

### Web (React + Vite)
- **Primary**: `@solana/wallet-adapter-react` with Phantom, Solflare, Backpack adapters
- **Connection**: Non-custodial — private keys never leave the user's wallet
- **Session**: Wallet address stored in React context; disconnects clear all on-chain state

### Mobile (Expo / React Native)
- **Android**: Mobile Wallet Adapter (MWA) — Phantom and Solflare on Android support MWA
- **iOS**: Deep-link flow (Phantom Universal Links) — MWA not yet supported on iOS
- **Fallback**: WalletConnect v2 for wallets without MWA

### Transaction Flow
```
User triggers action (e.g. claim reward)
    ↓
SDK builds Transaction / VersionedTransaction
    ↓
Sends to wallet adapter (signAndSendTransaction)
    ↓
User approves in wallet UI
    ↓
Transaction broadcast to RPC (Helius endpoint)
    ↓
SDK polls confirmTransaction (commitment: confirmed)
    ↓
UI updates with new balance / NFT
```

---

## RPC Strategy

| Environment | Provider | Commitment |
|-------------|----------|------------|
| Development | `localhost:8899` (solana-test-validator) | `confirmed` |
| Staging | Helius Devnet | `confirmed` |
| Production | Helius Mainnet (dedicated node) | `confirmed` |

Helius is preferred over public endpoints because:
- DAS API for NFT queries (`getAssetsByOwner`)
- Webhooks for real-time on-chain event notifications
- Rate limits 10× higher than public RPC

---

## Security

| Risk | Mitigation |
|------|-----------|
| Game server key compromise | HSM storage + rotation via `update_server_key` |
| Program upgrade | Upgrade authority → Squads multisig on mainnet |
| Oracle manipulation | No oracles — all logic is deterministic |
| Rug risk | Liquidity locked, team tokens vested 12-month cliff |
| Smart contract bug | Anchor invariants + audit before mainnet |

---

## Rollout Plan

| Milestone | Target | Description |
|-----------|--------|-------------|
| Localnet deploy | Now | Programs compile and tests pass |
| Devnet deploy | August 2026 | Real wallet testing with fake SOL |
| Security audit | September 2026 | Third-party Anchor audit |
| Mainnet deploy | October 2026 | Token launch + Jupiter liquidity |
| CoinGecko listing | November 2026 | Organic listing after liquidity |

---

## References

- `blockchain/programs/` — Anchor program source
- `blockchain/sdk/` — TypeScript SDK
- `docs/blockchain/token-economics.md` — token utility & supply
- `docs/blockchain/setup.md` — local development setup
