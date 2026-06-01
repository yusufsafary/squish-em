# SQUISH Token ($SQUISH) — Token Economics & Utility

> Status: Planned — Phase 3 (Q3 2026)

## Overview

$SQUISH is an SPL token on Solana earned by playing SQUISH EM! and spent on in-game
utility. It is not an investment vehicle — it is a game token with real utility.

---

## Earn Mechanics

| Action | $SQUISH Earned |
|--------|----------------|
| Game session (per 100 pts scored) | +1 SQUISH |
| Maximum per session | +1,000 SQUISH |
| Daily first-game bonus | +50 SQUISH |
| Weekly challenge completion | +200 SQUISH |
| Tournament participation (top 10) | +500–5,000 SQUISH |

### Anti-inflation Controls

- **Session cap**: Hard cap of 1,000 SQUISH per game session.
- **Daily cap**: 2,000 SQUISH max per wallet per day (enforced on-chain).
- **Server attestation**: Every session reward requires a cryptographic proof signed
  by the game server. No server signature → no tokens. Bot farming is blocked.
- **Replay protection**: Every session nonce is recorded on-chain. Duplicate claims
  are rejected at the program level.

---

## Spend Mechanics

| Use | Cost |
|-----|------|
| Common blob skin | Free |
| Rare blob skin | 100 SQUISH |
| Epic blob skin | 500 SQUISH |
| Legendary blob skin | 2,000 SQUISH |
| Tournament entry (SOL prize pool) | 50 SQUISH |
| Guild creation | 1,000 SQUISH |
| Staking (multiplier boosts) | Variable |

### Skin Marketplace

Skins are Metaplex NFTs. Secondary sales on Tensor / Magic Eden carry a **5% royalty**
that flows back to the game treasury. This creates a sustainable buy-pressure loop:
players earn SQUISH → buy skins → secondary market → royalties fund treasury.

---

## Token Supply

| Allocation | % | Amount | Vesting |
|------------|---|--------|---------|
| Player rewards (mining pool) | 60% | 600,000,000 | Released by play — infinite horizon |
| Team & development | 15% | 150,000,000 | 12-month cliff, 36-month linear |
| Ecosystem / partnerships | 10% | 100,000,000 | 24-month linear |
| Treasury | 10% | 100,000,000 | Governance-controlled |
| Initial liquidity (Jupiter) | 5% | 50,000,000 | Unlocked at launch |

**Total supply**: 1,000,000,000 $SQUISH (1 billion, 9 decimals)

---

## Staking

Players can stake SQUISH to earn score multipliers without spending tokens:

| Staked Amount | Multiplier | Lock Duration |
|--------------|------------|---------------|
| 100 SQUISH | 1.05× | 7 days |
| 500 SQUISH | 1.15× | 14 days |
| 2,000 SQUISH | 1.30× | 30 days |
| 10,000 SQUISH | 1.50× | 90 days |

Multipliers apply to token earnings per session, not game score.

---

## Token Flow Diagram

```
Player plays game
    ↓ (session ends)
Game server validates + signs attestation
    ↓
squish-mining program verifies proof
    ↓
squish-token program mints SQUISH to player ATA
    ↓
Player spends SQUISH on NFT skin
    ↓
squish-nft program burns SQUISH + mints NFT
    ↓
Secondary sale on Tensor → 5% royalty → Treasury
```

---

## Program Addresses

| Program | Devnet | Mainnet |
|---------|--------|---------|
| squish-token | TBD after deploy | TBD |
| squish-nft | TBD after deploy | TBD |
| squish-mining | TBD after deploy | TBD |
| squish-leaderboard | TBD after deploy | TBD |

## References

- `blockchain/programs/squish-token/src/lib.rs` — token program source
- `blockchain/programs/squish-mining/src/lib.rs` — mining + session proof source
- `blockchain/sdk/src/token.ts` — TypeScript SDK
- `blockchain/sdk/src/staking.ts` — staking SDK
