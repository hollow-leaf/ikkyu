use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{
        transfer_checked, Mint, Token, TokenAccount, TransferChecked,
    },
};
use crate::error::ErrorCode;
use crate::states::{Escrow, Obashafrens};

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    claimer: Signer<'info>,
    mint_obasha: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = claimer,
        associated_token::mint = mint_obasha,
        associated_token::authority = claimer
    )]
    claimer_ata_obasha: Account<'info, TokenAccount>,
    #[account(
        mut,
        has_one = mint_obasha,
        seeds=[b"state", escrow.seed.to_le_bytes().as_ref()],
        bump,
    )]
    escrow: Account<'info, Escrow>,
    #[account(
        init_if_needed,
        payer = claimer,
        seeds = [b"obashafrens", claimer.key().as_ref(), escrow.key().as_ref()],
        space = Obashafrens::INIT_SPACE,
        bump,
    )]
    pub obashafrens: Account<'info, Obashafrens>,
    #[account(
        mut,
        associated_token::mint = mint_obasha,
        associated_token::authority = escrow
    )]
    pub vault: Account<'info, TokenAccount>,
    associated_token_program: Program<'info, AssociatedToken>,
    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
}

impl<'info> Claim<'info> {
    pub fn claim(&mut self) -> Result<()> {
        let signer_seeds: [&[&[u8]]; 1] = [&[
            b"state",
            &self.escrow.seed.to_le_bytes()[..],
            &[self.escrow.bump],
        ]];

        self.update_obashafrens()?;

        transfer_checked(
            self.into_claim_context().with_signer(&signer_seeds),
            self.escrow.one_time_amount,
            self.mint_obasha.decimals,
        )
    }

    fn into_claim_context(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        let cpi_accounts = TransferChecked {
            from: self.vault.to_account_info(),
            mint: self.mint_obasha.to_account_info(),
            to: self.claimer_ata_obasha.to_account_info(),
            authority: self.escrow.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }

    fn update_obashafrens(&mut self) -> Result<()> {
        if self.obashafrens.claimed_amount + self.escrow.one_time_amount > self.escrow.max_amount {
            return Err(ErrorCode::OutOfMaxAmount.into());
        }
        self.obashafrens.set_inner(Obashafrens {
            claimed_amount: self.obashafrens.claimed_amount + self.escrow.one_time_amount,
        });
        Ok(())
    }
}