import { PublicKey } from "@solana/web3.js";

export interface SquishConfig {
  network: "mainnet-beta" | "devnet" | "localnet";
  rpcUrl: string;
  tokenMint: PublicKey;
  nftCollectionMint: PublicKey;
  leaderboardProgram: PublicKey;
}

export interface LeaderboardEntry {
  rank: number;
  player: PublicKey;
  score: bigint;
  timestamp: number;
}

export interface BlobSkin {
  id: number;
  name: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  mintAddress: PublicKey | null;
  imageUri: string;
  price: number; // in SQUISH tokens
}
