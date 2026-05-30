use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("SQUISH_PROGRAM_ID_REPLACE_AFTER_DEPLOY");

/// SQUISH Token Program
/// 
/// The SQUISH token is an SPL token on Solana earned by playing Squish Em!
/// Players earn tokens proportional to their score. Tokens are spent on NFT blob skins.
#[program]
pub mod squish_token {
    use super::*;

    /// Initialize the SQUISH token mint and game treasury
    pub fn initialize(ctx: Context<Initialize>, decimals: u8) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.authority = ctx.accounts.authority.key();
        treasury.mint = ctx.accounts.mint.key();
        treasury.total_distributed = 0;
        treasury.bump = ctx.bumps.treasury;
        Ok(())
    }

    /// Award SQUISH tokens to a player based on their score
    /// Called by the game server after a verified game session
    pub fn award_tokens(ctx: Context<AwardTokens>, score: u64) -> Result<()> {
        // 1 SQUISH per 100 points, capped at 1000 SQUISH per session
        let amount = (score / 100).min(1000) * 10u64.pow(ctx.accounts.mint.decimals as u32);

        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.player_token_account.to_account_info(),
                    authority: ctx.accounts.treasury.to_account_info(),
                },
                &[&[b"treasury", &[ctx.accounts.treasury.bump]]],
            ),
            amount,
        )?;

        let treasury = &mut ctx.accounts.treasury;
        treasury.total_distributed += amount;

        emit!(TokensAwarded {
            player: ctx.accounts.player.key(),
            score,
            amount,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = Treasury::LEN,
        seeds = [b"treasury"],
        bump,
    )]
    pub treasury: Account<'info, Treasury>,

    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AwardTokens<'info> {
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"treasury"],
        bump = treasury.bump,
    )]
    pub treasury: Account<'info, Treasury>,

    #[account(mut, address = treasury.mint)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Treasury {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub total_distributed: u64,
    pub bump: u8,
}

impl Treasury {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 1;
}

#[event]
pub struct TokensAwarded {
    pub player: Pubkey,
    pub score: u64,
    pub amount: u64,
}
