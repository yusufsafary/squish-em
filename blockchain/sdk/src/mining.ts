import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import type { SessionResult } from "./types.js";

/** Mining program ID — replace after deploy */
export const MINING_PROGRAM_ID = new PublicKey(
  "SQUISH_MINING_PROGRAM_ID_REPLACE_AFTER_DEPLOY"
);

/** Game server API base URL */
const GAME_API = "https://api.squishem.io/v1";

export interface SessionProof {
  score: number;
  timestamp: number;
  nonce: Uint8Array;
  signature: Uint8Array;
}

/**
 * Request a signed session attestation from the game server.
 * The server signs (wallet || score || timestamp || nonce) to prove
 * the session was legitimate.
 */
export async function getSessionProof(
  walletAddress: PublicKey,
  score: number
): Promise<SessionProof> {
  const res = await fetch(`${GAME_API}/session/attest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wallet: walletAddress.toBase58(),
      score,
      timestamp: Date.now(),
    }),
  });

  if (!res.ok) throw new Error(`Attestation failed: ${res.status}`);

  const json = await res.json();
  return {
    score: json.score,
    timestamp: json.timestamp,
    nonce: Uint8Array.from(Buffer.from(json.nonce, "base64")),
    signature: Uint8Array.from(Buffer.from(json.signature, "base64")),
  };
}

/**
 * Submit a session proof to the on-chain mining program and claim SQUISH tokens.
 * Returns the transaction signature.
 */
export async function claimMiningReward(
  connection: Connection,
  player: Keypair,
  proof: SessionProof
): Promise<string> {
  // TODO: build from generated IDL after program deploy
  // const program = new Program(IDL, MINING_PROGRAM_ID, new AnchorProvider(connection, wallet, {}));
  // return program.methods.claimSessionReward(...).rpc();
  throw new Error("Mining program not deployed yet — available Q3 2026");
}

/**
 * Calculate expected SQUISH token reward for a score.
 * Mirrors the on-chain formula: 1 SQUISH per 100 points, max 1000.
 */
export function calculateReward(score: number): number {
  return Math.min(Math.floor(score / 100), 1000);
}

/**
 * Fetch total SQUISH distributed by the mining program
 */
export async function getMiningStats(connection: Connection): Promise<{
  totalSessions: number;
  totalTokensDistributed: number;
}> {
  // TODO: deserialize MiningConfig account after deploy
  return { totalSessions: 0, totalTokensDistributed: 0 };
}
