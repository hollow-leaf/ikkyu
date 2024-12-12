import * as anchor from '@coral-xyz/anchor'
import { BN } from '@coral-xyz/anchor'
import AnchorAirdropEscrowJson from '@/idl/anchor_airdrop_escrow.json'
import { AnchorAirdropEscrow } from '@/idl/anchor_airdrop_escrow'
import {
  ISolana,
  isSolanaWallet,
  SolanaWallet
} from '@dynamic-labs/solana-core'
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync
} from '@solana/spl-token'

// Token 地址
export class SolanaTransactionService {
  private ikkyu = new PublicKey(
    'BgrKMqeLDLxqy4pf34Gse2CnJxUgyPVR8Uc2r7aM676E'
  )

  private tokenProgram = TOKEN_2022_PROGRAM_ID

  constructor(private primaryWallet: SolanaWallet | null) {
    if (!this.primaryWallet || !isSolanaWallet(this.primaryWallet)) {
      throw new Error('Primary wallet is not a valid Solana wallet.')
    }
  }

  private async getConnection(): Promise<Connection> {
    return await this.primaryWallet!.getConnection()
  }

  private async getSigner(): Promise<ISolana> {
    return await this.primaryWallet!.getSigner()
  }

  // Create Meme tokens
  public async createMemeToken(name: string, symbol: string, imageUrl: string, description: string): Promise<string> {
    const connection = await this.getConnection()
    const signer = await this.getSigner()

    const ikkyuProgram = new anchor.Program<AnchorAirdropEscrow>(
      AnchorAirdropEscrowJson as AnchorAirdropEscrow,
      { connection }
    )

    const ownerKey = new PublicKey(this.primaryWallet!.address)
    const ownership = PublicKey.findProgramAddressSync(
      [Buffer.from('anchor_airdrop_escrow')],
      ikkyuProgram.programId
    )[0]
    const ownershipBonk = getAssociatedTokenAddressSync(
      this.ikkyu,
      ownership,
      true,
      this.tokenProgram
    )

    const providerVault = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), ownerKey.toBuffer()],
      ikkyuProgram.programId
    )[0]

    const ownerAtaBonk = getAssociatedTokenAddressSync(
      this.ikkyu,
      ownerKey,
      false,
      this.tokenProgram
    )

    const maxAmount = 30e6;
    const oneTimeAmount = 10e6;
    const depositAmount = 100e6;
    const seed = new anchor.BN(20240802);
    const mintObasha = new PublicKey("BgrKMqeLDLxqy4pf34Gse2CnJxUgyPVR8Uc2r7aM676E");
    const initializerAtaObasha = getAssociatedTokenAddressSync(mintObasha, ownerKey, false, this.tokenProgram)
    const escrow = PublicKey.findProgramAddressSync(
      [Buffer.from("state"), seed.toArrayLike(Buffer, "le", 8)],
      ikkyuProgram.programId
    )[0];
    const vault = getAssociatedTokenAddressSync(mintObasha, escrow, true, this.tokenProgram);

    const instructions = await ikkyuProgram.methods
      .initialize(seed, new anchor.BN(oneTimeAmount), new anchor.BN(maxAmount), new anchor.BN(depositAmount))
      .accountsStrict({
        initializer: ownerKey,
        mintObasha: mintObasha,
        initializerAtaObasha: initializerAtaObasha,
        escrow,
        vault,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: this.tokenProgram,
        systemProgram: SystemProgram.programId
      })
      .instruction()

    const transaction = new Transaction().add(instructions)
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash
    transaction.feePayer = ownerKey

    try {
      const { signature } = await signer.signAndSendTransaction(transaction)
      return signature
    } catch (error) {
      throw error
    }
  }

  // Mint Meme Tokens
  public async mintMemeToken(amount: number, receiver: string): Promise<string> {
    const connection = await this.getConnection()
    const signer = await this.getSigner()

    const ikkyuProgram = new anchor.Program<AnchorAirdropEscrow>(
      AnchorAirdropEscrowJson as AnchorAirdropEscrow,
      { connection }
    )

    // TODO: Replace with the correct program ID
    const ownerKey = new PublicKey(this.primaryWallet!.address)
    const ownership = PublicKey.findProgramAddressSync(
      [Buffer.from('anchor_airdrop_escrow')],
      ikkyuProgram.programId
    )[0]
    const ownershipBonk = getAssociatedTokenAddressSync(
      this.ikkyu,
      ownership,
      true,
      this.tokenProgram
    )
    const providerVault = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), ownerKey.toBuffer()],
      ikkyuProgram.programId
    )[0]
    const ownerAtaBonk = getAssociatedTokenAddressSync(
      this.ikkyu,
      ownerKey,
      false,
      this.tokenProgram
    )

    const seed = new anchor.BN(20240802);
    const mintObasha = new PublicKey("BgrKMqeLDLxqy4pf34Gse2CnJxUgyPVR8Uc2r7aM676E");
    const claimerAtaObasha = getAssociatedTokenAddressSync(mintObasha, ownerKey, false, this.tokenProgram)
    const escrow = PublicKey.findProgramAddressSync(
      [Buffer.from("state"), seed.toArrayLike(Buffer, "le", 8)],
      ikkyuProgram.programId
    )[0];
    const obashafrens = PublicKey.findProgramAddressSync(
      [Buffer.from("obashafrens"), ownerKey.toBuffer(), escrow.toBuffer()],
      ikkyuProgram.programId
    )[0];
    const vault = getAssociatedTokenAddressSync(mintObasha, escrow, true, this.tokenProgram);

    const instructions = await ikkyuProgram.methods
      .claim()
      .accountsStrict({
        // TODO: Replace with the correct ABI Method
        claimer: ownerKey,
        mintObasha: mintObasha,
        claimerAtaObasha: claimerAtaObasha,
        escrow,
        obashafrens,
        vault,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: this.tokenProgram,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    const transaction = new Transaction().add(instructions)
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash
    transaction.feePayer = ownerKey

    try {
      const { signature } = await signer.signAndSendTransaction(transaction)
      return signature
    } catch (error) {
      throw error
    }
  }


}
