use anchor_lang::prelude::*;

declare_id!("BnfrWabSyiLYvHVD5W6PwTH3dfwTMkRArvhZ8hVm6gwJ");

#[program]
pub mod contracts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
