import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import chalk from "chalk";

export interface RewardClaimerOptions {
  connection: Connection;
  keypair: Keypair;
  tokenMint: PublicKey;
  dryRun: boolean;
}

/**
 * Submits game session scores to the Solana mining program and claims SQUISH tokens.
 *
 * Flow:
 * 1. Session ends with final score
 * 2. Agent POSTs score + session proof to game server
 * 3. Game server signs the session attestation (anti-cheat)
 * 4. Agent submits signed proof + award_tokens ix to Solana
 * 5. SQUISH tokens minted to agent wallet
 */
export class RewardClaimer {
  constructor(private opts: RewardClaimerOptions) {}

  /**
   * Claim SQUISH tokens for a completed session.
   * Returns tokens earned (0 in dry-run mode).
   */
  async claim(score: number): Promise<number> {
    const tokens = this.calculateTokens(score);

    if (tokens === 0) return 0;

    if (this.opts.dryRun) {
      console.log(chalk.yellow(`  [dry-run] Would claim ${tokens} SQUISH for score ${score}`));
      return tokens;
    }

    try {
      // 1. Get session proof from game server
      const proof = await this.getSessionProof(score);

      // 2. Build award_tokens transaction
      const tx = await this.buildAwardTx(score, proof);

      // 3. Sign and send
      tx.recentBlockhash = (
        await this.opts.connection.getLatestBlockhash()
      ).blockhash;
      tx.feePayer = this.opts.keypair.publicKey;
      tx.sign(this.opts.keypair);

      const sig = await this.opts.connection.sendRawTransaction(tx.serialize());
      await this.opts.connection.confirmTransaction(sig, "confirmed");

      console.log(chalk.green(`  ⛏  Claimed ${tokens} SQUISH | tx: ${sig.slice(0, 12)}...`));
      return tokens;
    } catch (e: any) {
      console.error(chalk.red(`  ✗ Claim failed: ${e.message}`));
      return 0;
    }
  }

  /** 1 SQUISH per 100 points, capped at 1,000 per session */
  private calculateTokens(score: number): number {
    return Math.min(Math.floor(score / 100), 1000);
  }

  /**
   * Get a signed session proof from the game server.
   * The server signs (walletAddress + score + timestamp) to prevent spoofing.
   */
  private async getSessionProof(score: number): Promise<Uint8Array> {
    const res = await fetch("https://api.squishem.io/v1/session/attest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: this.opts.keypair.publicKey.toBase58(),
        score,
        timestamp: Date.now(),
      }),
    });
    const json = await res.json();
    return Uint8Array.from(Buffer.from(json.proof, "base64"));
  }

  private async buildAwardTx(score: number, _proof: Uint8Array): Promise<Transaction> {
    // TODO: use generated IDL client after program deploy
    // import { Program } from "@coral-xyz/anchor";
    // const program = new Program(IDL, programId, provider);
    // return program.methods.awardTokens(new BN(score)).accounts({...}).transaction();
    return new Transaction(); // placeholder
  }
}
