/**
 * Wallet connection utilities for SQUISH EM!
 *
 * Supports Phantom, Solflare, Backpack (web) and Mobile Wallet Adapter (Android).
 * Import this in both the React web app and the Expo mobile app.
 */

import { Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

export type SupportedWallet = "phantom" | "solflare" | "backpack";

export interface WalletAdapter {
  publicKey: PublicKey | null;
  connected: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
  signAndSendTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<string>;
}

// ─── RPC Endpoints ─────────────────────────────────────────────────────────

export const RPC_ENDPOINTS = {
  mainnet: "https://mainnet.helius-rpc.com/?api-key=HELIUS_API_KEY",
  devnet:  "https://devnet.helius-rpc.com/?api-key=HELIUS_API_KEY",
  localnet: "http://localhost:8899",
} as const;

export type Network = keyof typeof RPC_ENDPOINTS;

export function createConnection(network: Network): Connection {
  return new Connection(RPC_ENDPOINTS[network], "confirmed");
}

// ─── Wallet Detection ──────────────────────────────────────────────────────

/**
 * Detect which Solana wallets are installed in the browser.
 */
export function getInstalledWallets(): SupportedWallet[] {
  if (typeof window === "undefined") return [];
  const installed: SupportedWallet[] = [];
  if ((window as any).solana?.isPhantom) installed.push("phantom");
  if ((window as any).solflare?.isSolflare) installed.push("solflare");
  if ((window as any).backpack) installed.push("backpack");
  return installed;
}

/**
 * Get the raw wallet provider for a given wallet name.
 * Returns null if the wallet is not installed.
 */
export function getWalletProvider(wallet: SupportedWallet): any | null {
  if (typeof window === "undefined") return null;
  switch (wallet) {
    case "phantom":  return (window as any).solana?.isPhantom ? (window as any).solana : null;
    case "solflare": return (window as any).solflare?.isSolflare ? (window as any).solflare : null;
    case "backpack": return (window as any).backpack ?? null;
    default:         return null;
  }
}

// ─── Connection Helpers ────────────────────────────────────────────────────

/**
 * Connect to a wallet and return the public key.
 * Opens the wallet's approval popup.
 */
export async function connectWallet(wallet: SupportedWallet): Promise<PublicKey> {
  const provider = getWalletProvider(wallet);
  if (!provider) throw new Error(`${wallet} wallet not installed`);
  const response = await provider.connect();
  return new PublicKey(response.publicKey.toString());
}

/**
 * Disconnect from the current wallet.
 */
export async function disconnectWallet(wallet: SupportedWallet): Promise<void> {
  const provider = getWalletProvider(wallet);
  if (provider?.disconnect) await provider.disconnect();
}

// ─── Transaction Helpers ───────────────────────────────────────────────────

/**
 * Sign and send a transaction, returning the transaction signature.
 * Automatically sets recent blockhash before signing.
 */
export async function signAndSend(
  connection: Connection,
  transaction: Transaction,
  wallet: SupportedWallet
): Promise<string> {
  const provider = getWalletProvider(wallet);
  if (!provider) throw new Error(`${wallet} not connected`);

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = new PublicKey(provider.publicKey.toString());

  const signed = await provider.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());

  await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");
  return signature;
}

/**
 * Shorten a public key for display: "Abc1...xyz9"
 */
export function shortenAddress(address: PublicKey | string, chars = 4): string {
  const str = address.toString();
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}
