import {
  Connection,
  PublicKey,
  Transaction,
  type TransactionInstruction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token";

/**
 * Get a player's SQUISH token balance
 */
export async function getSquishBalance(
  connection: Connection,
  tokenMint: PublicKey,
  walletAddress: PublicKey
): Promise<number> {
  try {
    const ata = await getAssociatedTokenAddress(tokenMint, walletAddress);
    const account = await getAccount(connection, ata);
    return Number(account.amount) / 1e9; // 9 decimals
  } catch {
    return 0;
  }
}

/**
 * Create ATA if it doesn't exist, return the instruction
 */
export async function ensureTokenAccount(
  connection: Connection,
  tokenMint: PublicKey,
  owner: PublicKey,
  payer: PublicKey
): Promise<{ ata: PublicKey; instruction: TransactionInstruction | null }> {
  const ata = await getAssociatedTokenAddress(tokenMint, owner);
  try {
    await getAccount(connection, ata);
    return { ata, instruction: null };
  } catch {
    const instruction = createAssociatedTokenAccountInstruction(
      payer,
      ata,
      owner,
      tokenMint
    );
    return { ata, instruction };
  }
}
