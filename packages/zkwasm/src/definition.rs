use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Serialize, Deserialize, Clone)]
pub struct RustGameState {
    pub total_steps: u64,
    pub current_position: u64,
    pub merits: u64, // 新增 merits 屬性
}

impl RustGameState {
    pub fn new() -> RustGameState {
        RustGameState {
            total_steps: 0,
            current_position: 0,
            merits: 0, // 初始化 merits 屬性
        }
    }
}

impl fmt::Display for RustGameState {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "RustGameState {{ total_steps: {}, current_position: {}, merits: {} }}",
            self.total_steps, self.current_position, self.merits
        )
    }
}