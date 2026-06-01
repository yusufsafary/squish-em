import { PublicKey } from "@solana/web3.js";

export interface SquishConfig {
  network: "mainnet-beta" | "devnet" | "localnet";
  rpcUrl: string;
  tokenMint: PublicKey;
  nftCollectionMint: PublicKey;
  leaderboardProgram: PublicKey;
  miningProgram: PublicKey;
  stakingProgram: PublicKey;
}

export interface LeaderboardEntry {
  rank: number;
  player: PublicKey;
  score: bigint;
  timestamp: number;
}

export interface WeeklyEntry extends LeaderboardEntry {
  weekNumber: number;
}

export interface BlobSkin {
  id: number;
  name: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  mintAddress: PublicKey | null;
  imageUri: string;
  price: number; // in SQUISH tokens
}

export interface SessionResult {
  score: number;
  timestamp: number;
  tokensEarned: number;
  signature: string | null; // tx signature if reward was claimed
}

export interface PlayerStats {
  wallet: PublicKey;
  allTimeHigh: number;
  weeklyHigh: number;
  sessionsPlayed: number;
  totalTokensEarned: number;
  lastPlayed: number;
}

export interface MiningStats {
  totalSessions: number;
  totalTokensDistributed: number;
}
