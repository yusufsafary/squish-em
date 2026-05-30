import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import type { LeaderboardEntry } from "./types";

/** On-chain leaderboard program ID — replace after deploy */
export const LEADERBOARD_PROGRAM_ID = new PublicKey(
  "SQUISH_LEADERBOARD_PROGRAM_ID_REPLACE_AFTER_DEPLOY"
);

/**
 * Fetch top N scores from the on-chain leaderboard
 */
export async function getTopScores(
  connection: Connection,
  limit: number = 100
): Promise<LeaderboardEntry[]> {
  // Fetch all leaderboard accounts owned by the program
  const accounts = await connection.getProgramAccounts(LEADERBOARD_PROGRAM_ID, {
    filters: [{ dataSize: 49 }], // pubkey(32) + score(8) + timestamp(8) + rank(1)
  });

  return accounts
    .map(({ account }) => {
      const data = account.data;
      return {
        player: new PublicKey(data.slice(0, 32)),
        score: data.readBigUInt64LE(32),
        timestamp: Number(data.readBigUInt64LE(40)),
        rank: 0,
      };
    })
    .sort((a, b) => (b.score > a.score ? 1 : -1))
    .slice(0, limit)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

/**
 * Submit a score to the on-chain leaderboard
 * Called after a verified game session
 */
export async function submitScore(
  connection: Connection,
  player: PublicKey,
  score: number,
  signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<string> {
  // TODO: build instruction from IDL after program deploy
  const tx = new Transaction();
  // ... instruction building
  const signed = await signTransaction(tx);
  return connection.sendRawTransaction(signed.serialize());
}
