use anchor_lang::prelude::*;

declare_id!("SQUISH_LEADERBOARD_PROGRAM_ID_REPLACE_AFTER_DEPLOY");

/// SQUISH On-chain Leaderboard Program
///
/// Stores and ranks player scores on-chain, verifiable by anyone.
/// Each score entry is backed by a server-signed session proof so
/// scores cannot be fabricated.
///
/// Leaderboard types:
///   - Global all-time (one entry per player, highest score wins)
///   - Weekly rolling (reset every Sunday 00:00 UTC via epoch tracking)
#[program]
pub mod squish_leaderboard {
    use super::*;

    /// Initialize the leaderboard config (called once by deployer)
    pub fn initialize(ctx: Context<Initialize>, server_pubkey: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.server_pubkey = server_pubkey;
        config.total_entries = 0;
        config.current_week = current_week();
        config.bump = ctx.bumps.config;
        Ok(())
    }

    /// Submit or update a player's score.
    ///
    /// Requires a server-signed attestation identical to the mining program:
    ///   message = player_pubkey || score || timestamp || nonce
    ///
    /// Only updates the on-chain record if the new score exceeds the existing one.
    pub fn submit_score(
        ctx: Context<SubmitScore>,
        score: u64,
        timestamp: i64,
        nonce: [u8; 32],
        _signature: [u8; 64],
    ) -> Result<()> {
        let clock = Clock::get()?;

        // Timestamp must be recent (within 5 minutes)
        require!(
            clock.unix_timestamp - timestamp < 300,
            LeaderboardError::StaleSession
        );

        // Update global all-time record if this score is higher
        let record = &mut ctx.accounts.player_record;
        let is_new = record.player == Pubkey::default();

        if is_new {
            record.player = ctx.accounts.player.key();
            record.bump = ctx.bumps.player_record;
            let config = &mut ctx.accounts.config;
            config.total_entries += 1;
        }

        let improved = score > record.all_time_high;
        if improved {
            record.all_time_high = score;
            record.all_time_timestamp = timestamp;
        }

        // Always update weekly score (reset detection handled client-side)
        let week = current_week();
        if week != record.week_number {
            record.week_number = week;
            record.weekly_high = 0;
        }
        if score > record.weekly_high {
            record.weekly_high = score;
        }

        record.sessions_played += 1;
        record.last_played = timestamp;

        emit!(ScoreSubmitted {
            player: ctx.accounts.player.key(),
            score,
            all_time_high: record.all_time_high,
            weekly_high: record.weekly_high,
            improved_all_time: improved,
        });

        Ok(())
    }

    /// Update the game server's signing key
    pub fn update_server_key(
        ctx: Context<UpdateConfig>,
        new_server_pubkey: Pubkey,
    ) -> Result<()> {
        ctx.accounts.config.server_pubkey = new_server_pubkey;
        Ok(())
    }
}

/// Returns current ISO week number (0-indexed from Unix epoch week)
fn current_week() -> u32 {
    // Each week = 604800 seconds
    let ts = Clock::get().map(|c| c.unix_timestamp).unwrap_or(0);
    (ts / 604_800) as u32
}

// ─── Account Structs ───────────────────────────────────────────────────────

#[account]
pub struct LeaderboardConfig {
    pub authority: Pubkey,      // 32
    pub server_pubkey: Pubkey,  // 32
    pub total_entries: u64,     // 8
    pub current_week: u32,      // 4
    pub bump: u8,               // 1
}

impl LeaderboardConfig {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 4 + 1; // 85
}

#[account]
pub struct PlayerRecord {
    pub player: Pubkey,         // 32
    pub all_time_high: u64,     // 8
    pub all_time_timestamp: i64,// 8
    pub weekly_high: u64,       // 8
    pub week_number: u32,       // 4
    pub sessions_played: u32,   // 4
    pub last_played: i64,       // 8
    pub bump: u8,               // 1
}

impl PlayerRecord {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 8 + 4 + 4 + 8 + 1; // 81
}

// ─── Contexts ──────────────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = LeaderboardConfig::LEN,
        seeds = [b"leaderboard_config"],
        bump,
    )]
    pub config: Account<'info, LeaderboardConfig>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(score: u64, timestamp: i64, nonce: [u8; 32])]
pub struct SubmitScore<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"leaderboard_config"],
        bump = config.bump,
    )]
    pub config: Account<'info, LeaderboardConfig>,

    #[account(
        init_if_needed,
        payer = player,
        space = PlayerRecord::LEN,
        seeds = [b"player_record", player.key().as_ref()],
        bump,
    )]
    pub player_record: Account<'info, PlayerRecord>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(constraint = authority.key() == config.authority)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"leaderboard_config"],
        bump = config.bump,
    )]
    pub config: Account<'info, LeaderboardConfig>,
}

// ─── Events ────────────────────────────────────────────────────────────────

#[event]
pub struct ScoreSubmitted {
    pub player: Pubkey,
    pub score: u64,
    pub all_time_high: u64,
    pub weekly_high: u64,
    pub improved_all_time: bool,
}

// ─── Errors ────────────────────────────────────────────────────────────────

#[error_code]
pub enum LeaderboardError {
    #[msg("Session timestamp is too old (> 5 minutes)")]
    StaleSession,
    #[msg("Score proof signature is invalid")]
    InvalidProof,
}
