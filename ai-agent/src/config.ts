import { Keypair, PublicKey } from "@solana/web3.js";
import { readFileSync, existsSync } from "fs";
import { z } from "zod";
import "dotenv/config";

const ConfigSchema = z.object({
  SOLANA_RPC_URL: z.string().url().default("https://api.devnet.solana.com"),
  SQUISH_TOKEN_MINT: z.string().default("REPLACE_AFTER_DEPLOY"),
  SQUISH_MINING_PROGRAM: z.string().default("REPLACE_AFTER_DEPLOY"),
  AGENT_KEYPAIR_PATH: z.string().default("~/.config/solana/id.json"),
  GAME_URL: z.string().url().default("https://yusufsafary.github.io/squish-em/game.html"),
  MINING_LOG_PATH: z.string().default("./mining.log"),
});

export interface AgentConfig {
  walletKeypair: Keypair;
  rpcUrl: string;
  tokenMint: PublicKey;
  miningProgram: PublicKey;
  gameUrl: string;
  logPath: string;
}

export async function loadConfig(): Promise<AgentConfig> {
  const env = ConfigSchema.parse(process.env);

  const keypairPath = env.AGENT_KEYPAIR_PATH.replace("~", process.env.HOME ?? "");
  let walletKeypair: Keypair;
  if (existsSync(keypairPath)) {
    const keyData = JSON.parse(readFileSync(keypairPath, "utf8"));
    walletKeypair = Keypair.fromSecretKey(Uint8Array.from(keyData));
  } else {
    walletKeypair = Keypair.generate();
    console.warn("⚠️  No keypair found — generated ephemeral wallet. Set AGENT_KEYPAIR_PATH.");
  }

  return {
    walletKeypair,
    rpcUrl: env.SOLANA_RPC_URL,
    tokenMint: new PublicKey(env.SQUISH_TOKEN_MINT),
    miningProgram: new PublicKey(env.SQUISH_MINING_PROGRAM),
    gameUrl: env.GAME_URL,
    logPath: env.MINING_LOG_PATH,
  };
}
