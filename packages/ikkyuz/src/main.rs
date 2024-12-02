
use risc0_zkvm::{guest::{env, sha::Impl},sha::{Digest, Sha256}};

fn main() {
    let mut input_1 = Vec::new();
    env::read_slice(&mut input_1);
    let digest = Impl::hash_bytes(&[input_1.as_slice()]);
    env::commit_slice(digest.as_bytes());
}
