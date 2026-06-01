/**
 * SQUISH Staking SDK
 *
 * Players stake SQUISH tokens to earn score multipliers.
 * Staked tokens are locked for a chosen duration.
 * Multipliers apply to mining rewards per session.
 *
 * Note: Staking program is Phase 3 backlog — functions throw until deployed.
 */

import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { getSquishBalance } from "./token";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface StakeTier {
  minAmount: number;    // minimum SQUISH to stake for this tier
  multiplier: number;   // reward multiplier (e.g. 1.15 = 15% bonus)
  lockDays: number;     // lock duration in days
  label: string;        // human-readable tier name
}

export interface StakePosition {
  wallet: PublicKey;
  amount: number;       // SQUISH staked
  stakedAt: number;     // Unix timestamp
  unlockAt: number;     // Unix timestamp
  tier: StakeTier;
  pda: PublicKey;       // on-chain stake account
}

// ─── Constants ─────────────────────────────────────────────────────────────

export const STAKE_TIERS: StakeTier[] = [
  { minAmount: 100,    multiplier: 1.05, lockDays: 7,  label: "Bronze" },
  { minAmount: 500,    multiplier: 1.15, lockDays: 14, label: "Silver" },
  { minAmount: 2_000,  multiplier: 1.30, lockDays: 30, label: "Gold"   },
  { minAmount: 10_000, multiplier: 1.50, lockDays: 90, label: "Legend" },
];

/** Return the tier that matches a given staked amount (highest qualifying tier). */
export function getTierForAmount(amount: number): StakeTier | null {
  const qualifying = STAKE_TIERS.filter(t => amount >= t.minAmount);
  return qualifying.length > 0 ? qualifying[qualifying.length - 1] : null;
}

/** Calculate the mining reward multiplier for a wallet's active stake. */
export function getMultiplier(position: StakePosition | null): number {
  if (!position) return 1.0;
  const now = Date.now() / 1000;
  if (now > position.unlockAt) return 1.0; // lock expired
  return position.tier.multiplier;
}

/** Apply staking multiplier to a base SQUISH reward. */
export function applyMultiplier(baseReward: number, multiplier: number): number {
  return Math.floor(baseReward * multiplier);
}

// ─── On-chain queries (Phase 3 — available Q3 2026) ───────────────────────

/**
 * Fetch active stake position for a wallet.
 * Returns null if no active stake exists.
 */
export async function getStakePosition(
  connection: Connection,
  wallet: PublicKey
): Promise<StakePosition | null> {
  // TODO: deserialize StakeAccount PDA after staking program deploy
  // PDA seeds: ["stake", wallet]
  void connection; void wallet;
  return null;
}

/**
 * Stake SQUISH tokens for a given duration.
 * Returns the transaction signature.
 */
export async function stakeTokens(
  connection: Connection,
  wallet: PublicKey,
  amount: number,
  lockDays: number,
  signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<string> {
  const balance = await getSquishBalance(
    connection,
    new PublicKey("SQUISH_TOKEN_MINT_REPLACE"),
    wallet
  );
  if (balance < amount) {
    throw new Error(`Insufficient balance: have ${balance} SQUISH, need ${amount}`);
  }
  // TODO: build staking instruction from IDL after deploy
  void lockDays; void signTransaction;
  throw new Error("Staking program not deployed yet — available Q3 2026");
}

/**
 * Unstake tokens after the lock period expires.
 */
export async function unstakeTokens(
  connection: Connection,
  wallet: PublicKey,
  signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<string> {
  void connection; void wallet; void signTransaction;
  throw new Error("Staking program not deployed yet — available Q3 2026");
}
