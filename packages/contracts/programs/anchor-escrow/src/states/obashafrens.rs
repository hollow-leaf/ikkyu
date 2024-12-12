use anchor_lang::prelude::*;

#[account]
pub struct Obashafrens {
    pub claimed_amount: u64,
}

impl Space for Obashafrens {
    // First 8 Bytes are Discriminator (u64)
    const INIT_SPACE: usize = 8 + 8;
}
