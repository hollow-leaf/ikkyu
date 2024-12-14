use crate::definition::RustGameState;
use once_cell::sync::Lazy;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;

pub const MAX_POSITION: u64 = 10;
pub const WINNING_MERITS: u64 = 100; // 定義通過遊戲所需的 merits
pub static GAME_STATE: Lazy<Mutex<RustGameState>> = Lazy::new(|| Mutex::new(RustGameState::new()));

/* STATEFUL FUNCTIONS This defines the initialization of the game*/
#[wasm_bindgen]
pub fn initialize_game(total_steps: u64, current_position: u64) {
    let mut game_state = GAME_STATE.lock().unwrap();

    game_state.total_steps = total_steps;
    game_state.current_position = current_position;
    game_state.merits = 0; // 初始化 merits
}

/* STATEFUL FUNCTIONS This defines the logic when player adds merits points */
#[wasm_bindgen]
pub fn add_merits(points: u64) {
    let mut game_state = GAME_STATE.lock().unwrap();

    game_state.merits += points;
    game_state.total_steps += 1;

    if game_state.merits >= WINNING_MERITS {
        // 通過遊戲的邏輯
        // 可以在這裡添加更多的處理，例如設置遊戲狀態為通過等
    }
}

/* PURE FUNCTIONS This function returns the game state, but parse into Json, so can be used in Javascript */
#[wasm_bindgen]
pub fn get_game_state() -> String {
    let game = _get_game_state();
    serde_json::to_string(&game).unwrap()
}

/* PURE FUNCTION This function returns the game state, to be used in Rust and Zkmain */
pub fn _get_game_state() -> RustGameState {
    let game = GAME_STATE.lock().unwrap().clone();
    return game;
}