import * as anchor from "@coral-xyz/anchor";
import { AnchorAirdropEscrow } from "../target/types/anchor_airdrop_escrow";
import { PublicKey, SystemProgram, Keypair, Transaction } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

 

describe("anchor-airdrop-escrow", () => {

  // 0. Set provider, connection and program
  anchor.setProvider(anchor.AnchorProvider.env());
  const initializer = anchor.Wallet.local() as anchor.Wallet;
  const provider = anchor.getProvider();
  const connection = provider.connection;
  const program = anchor.workspace.AnchorAirdropEscrow as anchor.Program<AnchorAirdropEscrow>;
  const MINT_SIZE = 165;
  // 1. Define the accounts
  // Fill in the token you want to airdrop
  const mintobasha = new PublicKey("Aqk2sTGwLuojdYSHDLCXgidGNUQeskWS2JbKXPksHdaG");
  // Feel free to change the seed to any number you like
  const seed = new anchor.BN(20240802);
  const escrow = PublicKey.findProgramAddressSync(
    [Buffer.from("state"), seed.toArrayLike(Buffer, "le", 8)],
    program.programId
  )[0];
  const initializerAtaobasha = getAssociatedTokenAddressSync(mintobasha, initializer.publicKey);
  const obashafrens = PublicKey.findProgramAddressSync(
    [Buffer.from("obashafrens"), initializer.publicKey.toBuffer(), escrow.toBuffer()],
    program.programId
  )[0];
  const vault = getAssociatedTokenAddressSync(mintobasha, escrow, true);

  // Account Wrapper
  const accounts = {
    initializer: initializer.publicKey,
    mintobasha: mintobasha,
    initializerAtaobasha: initializerAtaobasha,
    claimerAtaobasha: initializerAtaobasha,
    escrow,
    vault,
    obashafrens,
    associatedTokenprogram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  };

  console.log("Mintobasha", mintobasha.toBase58());
  console.log("Escrow", escrow.toBase58());
  console.log("obashafrens", obashafrens.toBase58());
  console.log("Vault", vault.toBase58());

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block,
    });
    return signature;
  };

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  };

  // // if you want to create a mint and airdrop tokens
  xit("Airdrop and create mints", async () => {
    let lamports = await getMinimumBalanceForRentExemptMint(connection);
    let tx = new Transaction();
    tx.instructions = [
      ...[mintobasha].map((m) =>
        SystemProgram.createAccount({
          fromPubkey: provider.publicKey,
          newAccountPubkey: m.publicKey,
          lamports,
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM_ID,
        })
      ),
      ...[
        [mintobasha.publicKey, initializer.publicKey, initializerAtaobasha],
      ].flatMap((x) => [
        createInitializeMint2Instruction(x[0], 6, x[1], null),
        createAssociatedTokenAccountIdempotentInstruction(provider.publicKey, x[2], x[1], x[0]),
        createMintToInstruction(x[0], x[2], x[1], 1e9),
      ]),
    ];

    await provider.sendAndConfirm(tx, [mintobasha]).then(log);
  });

  // Create a new airdrop(escrow)
  it("Initialize", async () => {
    const maxAmount = 30e6;
    const oneTimeAmount = 10e6;
    const depositAmount = 100e6;
    await program.methods
      .initialize(seed,new anchor.BN(oneTimeAmount), new anchor.BN(maxAmount), new anchor.BN(depositAmount))
      .accounts({ ...accounts })
      .rpc()
      .then(confirm)
      .then(log);
  });

  // Claim the airdrop
  it("Claim", async () => {
    await program.methods
      .claim()
      .accounts({ ...accounts })
      .rpc()
      .then(confirm)
      .then(log);
  });
  it("Claim", async () => {
    await program.methods
      .claim()
      .accounts({ ...accounts })
      .rpc()
      .then(confirm)
      .then(log);
  });
  it("Claim", async () => {
    await program.methods
      .claim()
      .accounts({ ...accounts })
      .rpc()
      .then(confirm)
      .then(log);
  });

  // Withdraw remaining tokens in Vault
  it("Withdraw", async () => {
    await program.methods
      .withdraw()
      .accounts({ ...accounts })
      .rpc()
      .then(confirm)
      .then(log);
  });
});
