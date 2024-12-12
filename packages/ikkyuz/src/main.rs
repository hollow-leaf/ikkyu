
use risc0_zkvm::{guest::{env, sha::Impl},sha::{Digest, Sha256}};

fn main() {
    // Read the two words from the host environment
    let mut word1 = Vec::new();
    let mut word2 = Vec::new();
    env::read_slice(&mut word1);
    env::read_slice(&mut word2);

    // Perform the comparison
    let comparison_result = compare_words(&word1, &word2);

    // Commit the result (comparison output)
    env::commit_slice(&[comparison_result as u8]);
}

/// Compares two words and returns a result:
/// - 0: if words are equal
/// - 1: if word1 is lexicographically smaller than word2
/// - 2: if word1 is lexicographically greater than word2
fn compare_words(word1: &[u8], word2: &[u8]) -> u8 {
    use std::cmp::Ordering;

    match word1.cmp(word2) {
        Ordering::Equal => 0,
        Ordering::Less => 1,
        Ordering::Greater => 2,
    }
}