use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_master_edition_v3, create_metadata_accounts_v3, CreateMasterEditionV3,
        CreateMetadataAccountsV3, Metadata,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::types::{Creator, DataV2};

declare_id!("SQUISH_NFT_PROGRAM_ID_REPLACE_AFTER_DEPLOY");

/// SQUISH NFT Blob Skins Program
///
/// Each blob skin is a unique Metaplex NFT on Solana.
/// Players buy skins with SQUISH tokens. Skins are applied in-game.
#[program]
pub mod squish_nft {
    use super::*;

    /// Mint a new blob skin NFT to a player's wallet
    pub fn mint_skin(
        ctx: Context<MintSkin>,
        skin_id: u8,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        require!(skin_id < SkinType::COUNT, SquishError::InvalidSkin);

        // Mint 1 NFT
        mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
                &[&[b"mint_authority", &[ctx.bumps.mint_authority]]],
            ),
            1,
        )?;

        // Create Metaplex metadata
        create_metadata_accounts_v3(
            CpiContext::new_with_signer(
                ctx.accounts.token_metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: ctx.accounts.metadata.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    mint_authority: ctx.accounts.mint_authority.to_account_info(),
                    payer: ctx.accounts.payer.to_account_info(),
                    update_authority: ctx.accounts.mint_authority.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
                &[&[b"mint_authority", &[ctx.bumps.mint_authority]]],
            ),
            DataV2 {
                name,
                symbol,
                uri,
                seller_fee_basis_points: 500, // 5% royalty
                creators: Some(vec![Creator {
                    address: ctx.accounts.mint_authority.key(),
                    verified: true,
                    share: 100,
                }]),
                collection: None,
                uses: None,
            },
            true,
            true,
            None,
        )?;

        emit!(SkinMinted {
            owner: ctx.accounts.payer.key(),
            skin_id,
            mint: ctx.accounts.mint.key(),
        });

        Ok(())
    }
}

pub struct SkinType;
impl SkinType {
    pub const COUNT: u8 = 32; // 32 unique skins planned at launch
}

#[derive(Accounts)]
pub struct MintSkin<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = mint_authority,
        mint::freeze_authority = mint_authority,
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub token_account: Account<'info, TokenAccount>,

    #[account(
        seeds = [b"mint_authority"],
        bump,
    )]
    /// CHECK: PDA used as mint authority
    pub mint_authority: UncheckedAccount<'info>,

    /// CHECK: Metaplex metadata account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[event]
pub struct SkinMinted {
    pub owner: Pubkey,
    pub skin_id: u8,
    pub mint: Pubkey,
}

#[error_code]
pub enum SquishError {
    #[msg("Invalid skin ID")]
    InvalidSkin,
}
