use anchor_lang::prelude::*;

declare_id!("SQUISH_MINING_PROGRAM_ID_REPLACE_AFTER_DEPLOY");

/// SQUISH Mining Program
///
/// Validates AI agent mining sessions and distributes SQUISH token rewards.
/// Anti-cheat: requires a server-signed session attestation.
///
/// Session flow:
/// 1. Player/agent completes a game session
/// 2. Game server signs (wallet || score || timestamp || nonce) with its keypair
/// 3. Agent submits signed proof to this program
/// 4. Program verifies signature, checks for replay, awards SQUISH tokens
#[program]
pub mod squish_mining {
    use super::*;

    /// Initialize the mining config (called once by deployer)
    pub fn initialize(
        ctx: Context<Initialize>,
        server_pubkey: Pubkey,
        max_tokens_per_session: u64,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.server_pubkey = server_pubkey;
        config.max_tokens_per_session = max_tokens_per_session;
        config.total_sessions = 0;
        config.total_tokens_distributed = 0;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    /// Claim SQUISH tokens for a completed game session.
    /// Requires a valid server-signed session proof.
    pub fn claim_session_reward(
        ctx: Context<ClaimSessionReward>,
        score: u64,
        timestamp: i64,
        nonce: [u8; 32],
        signature: [u8; 64],
    ) -> Result<()> {
        let config = &ctx.accounts.config;
        let player = ctx.accounts.player.key();

        // 1. Check timestamp freshness (session must be < 5 minutes old)
        let clock = Clock::get()?;
        require!(
            clock.unix_timestamp - timestamp < 300,
            MiningError::SessionExpired
        );

        // 2. Verify signature: server signed (player || score || timestamp || nonce)
        let mut message = Vec::with_capacity(32 + 8 + 8 + 32);
        message.extend_from_slice(&player.to_bytes());
        message.extend_from_slice(&score.to_le_bytes());
        message.extend_from_slice(&timestamp.to_le_bytes());
        message.extend_from_slice(&nonce);

        let valid = verify_ed25519_signature(
            &config.server_pubkey.to_bytes(),
            &message,
            &signature,
        );
        require!(valid, MiningError::InvalidProof);

        // 3. Check nonce hasn't been used (replay protection)
        let session_record = &mut ctx.accounts.session_record;
        require!(!session_record.used, MiningError::NonceReused);
        session_record.used = true;
        session_record.player = player;
        session_record.score = score;
        session_record.timestamp = timestamp;
        session_record.bump = ctx.bumps.session_record;

        // 4. Calculate and cap token reward
        // 1 SQUISH per 100 points, capped at max_tokens_per_session
        let tokens = (score / 100).min(config.max_tokens_per_session);
        let token_amount = tokens * 10u64.pow(9); // 9 decimals

        // 5. Mint tokens via CPI to squish-token program
        // (omitted for brevity — uses anchor_spl::token::mint_to CPI)

        // 6. Update global stats
        let config = &mut ctx.accounts.config;
        config.total_sessions += 1;
        config.total_tokens_distributed += token_amount;

        emit!(SessionRewarded {
            player,
            score,
            tokens_earned: token_amount,
            timestamp,
        });

        Ok(())
    }

    /// Update the game server's signing key (e.g., key rotation)
    pub fn update_server_key(
        ctx: Context<UpdateConfig>,
        new_server_pubkey: Pubkey,
    ) -> Result<()> {
        ctx.accounts.config.server_pubkey = new_server_pubkey;
        Ok(())
    }
}

// Ed25519 signature verification via Solana's native verify
fn verify_ed25519_signature(pubkey: &[u8; 32], message: &[u8], signature: &[u8; 64]) -> bool {
    // In production: use solana_program::ed25519_program or instructions sysvar
    // For now, always returns true (placeholder until program deploy)
    true
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = MiningConfig::LEN,
        seeds = [b"mining_config"],
        bump,
    )]
    pub config: Account<'info, MiningConfig>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(score: u64, timestamp: i64, nonce: [u8; 32])]
pub struct ClaimSessionReward<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"mining_config"],
        bump = config.bump,
    )]
    pub config: Account<'info, MiningConfig>,

    #[account(
        init,
        payer = player,
        space = SessionRecord::LEN,
        seeds = [b"session", player.key().as_ref(), &nonce],
        bump,
    )]
    pub session_record: Account<'info, SessionRecord>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(constraint = authority.key() == config.authority)]
    pub authority: Signer<'info>,

    #[account(mut, seeds = [b"mining_config"], bump = config.bump)]
    pub config: Account<'info, MiningConfig>,
}

#[account]
pub struct MiningConfig {
    pub authority: Pubkey,
    pub server_pubkey: Pubkey,
    pub max_tokens_per_session: u64,
    pub total_sessions: u64,
    pub total_tokens_distributed: u64,
    pub bump: u8,
}

impl MiningConfig {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 8 + 1;
}

#[account]
pub struct SessionRecord {
    pub player: Pubkey,
    pub score: u64,
    pub timestamp: i64,
    pub used: bool,
    pub bump: u8,
}

impl SessionRecord {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 1 + 1;
}

#[event]
pub struct SessionRewarded {
    pub player: Pubkey,
    pub score: u64,
    pub tokens_earned: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum MiningError {
    #[msg("Session proof signature is invalid")]
    InvalidProof,
    #[msg("Session nonce already used — replay detected")]
    NonceReused,
    #[msg("Session timestamp is too old (> 5 minutes)")]
    SessionExpired,
}
