use crate::definition::RustGameState;
use once_cell::sync::Lazy;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;

pub const MAX_POSITION: u64 = 10;
pub static GAME_STATE: Lazy<Mutex<RustGameState>> = Lazy::new(|| Mutex::new(RustGameState::new()));

/* STATEFUL FUNCTIONS This defines the initialization of the game*/
#[wasm_bindgen]
pub fn initialize_game(total_steps: u64, current_position: u64) {
    let mut game_state = GAME_STATE.lock().unwrap();

    game_state.total_steps = total_steps;
    game_state.current_position = current_position;
}

/* STATEFUL FUNCTIONS This is defines the logic when player moves one step/entering one command*/
#[wasm_bindgen]
pub fn step(input: u64) {
    let mut game_state = GAME_STATE.lock().unwrap();

    match input {
        0 => {
            if game_state.current_position != 0 {
                game_state.current_position -= 1;

                game_state.total_steps += 1;
            }
        }
        1 => {
            if game_state.current_position != MAX_POSITION {
                game_state.current_position += 1;

                game_state.total_steps += 1;
            }
        }
        _ => {
            panic!("Invalid command");
        }
    };
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
