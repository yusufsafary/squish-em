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

/** Live $SQUISH SPL token mint address (Solana mainnet) */
export const SQUISH_TOKEN_MINT = new PublicKey(
  "314yiE7VgKbBozCpAqyGaLk8EZzKdzDShtwzAyRBqory"
);

/** Token decimals */
export const SQUISH_DECIMALS = 9;

/** Total fixed supply: 1 billion $SQUISH */
export const SQUISH_TOTAL_SUPPLY = 1_000_000_000;

/** Jupiter price API endpoint */
const JUPITER_PRICE_URL =
  "https://price.jup.ag/v6/price?ids=314yiE7VgKbBozCpAqyGaLk8EZzKdzDShtwzAyRBqory";

/** DexScreener fallback */
const DEXSCREENER_URL =
  "https://api.dexscreener.com/latest/dex/tokens/314yiE7VgKbBozCpAqyGaLk8EZzKdzDShtwzAyRBqory";

/**
 * Fetch the current $SQUISH USD price.
 * Tries Jupiter price API first, falls back to DexScreener.
 */
export async function getSquishPriceUsd(): Promise<number | null> {
  try {
    const res = await fetch(JUPITER_PRICE_URL);
    if (res.ok) {
      const json = await res.json();
      const price = json?.data?.["314yiE7VgKbBozCpAqyGaLk8EZzKdzDShtwzAyRBqory"]?.price;
      if (typeof price === "number" && price > 0) return price;
    }
  } catch {
    // fall through to DexScreener
  }
  try {
    const res = await fetch(DEXSCREENER_URL);
    if (res.ok) {
      const json = await res.json();
      const price = Number(json?.pairs?.[0]?.priceUsd);
      if (price > 0) return price;
    }
  } catch {
    // both failed
  }
  return null;
}

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
    return Number(account.amount) / Math.pow(10, SQUISH_DECIMALS);
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
