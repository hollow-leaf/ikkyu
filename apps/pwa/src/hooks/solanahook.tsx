import * as anchor from '@coral-xyz/anchor'
import { BN } from '@coral-xyz/anchor'
import ContractJson from '@/idl/contracts.json'
import { Contract } from '@/idl/contracts'
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
import { randomBytes } from 'crypto'


// Token 地址
export class SolanaTransactionService {
  private ikkyu = new PublicKey(
    'Token Address'
  )

  private tokenProgram = TOKEN_2022_PROGRAM_ID

  constructor(private primaryWallet: SolanaWallet | null) {
    if (!this.primaryWallet || !isSolanaWallet(this.primaryWallet)) {
      throw new Error('Primary wallet is not a valid Solana wallet.')
    }
  }

  // 必要的
  private async getConnection(): Promise<Connection> {
    return await this.primaryWallet!.getConnection()
  }

  // 必要的
  private async getSigner(): Promise<ISolana> {
    return await this.primaryWallet!.getSigner()
  }

  // Interact
  // Send SOL to another wallet
  public async sendTransaction(
    destinationAddress: string,
    amountSOL: number
  ): Promise<string> {
    const connection = await this.getConnection()
    const signer = await this.getSigner()

    const fromKey = new PublicKey(this.primaryWallet!.address)
    const toKey = new PublicKey(destinationAddress)
    const amountInLamports = amountSOL * 1e9

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKey,
        lamports: amountInLamports,
        toPubkey: toKey
      })
    )

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash
    transaction.feePayer = fromKey

    try {
      const { signature } = await signer.signAndSendTransaction(transaction)
      return signature
    } catch (error) {
      throw new Error(`Transaction failed: ${error}`)
    }
  }

  // Create Meme tokens
  public async createMemeToken(name: string, symbol: string, imageUrl: string, description: string): Promise<string> {
    const connection = await this.getConnection()
    const signer = await this.getSigner()

    // TODO: Replace with the correct contract
    const ikkyuProgram = new anchor.Program<Contract>(
      ContractJson as Contract,
      { connection }
    )

    // TODO: Replace with the correct program ID
    const ownerKey = new PublicKey(this.primaryWallet!.address)
    const ownership = PublicKey.findProgramAddressSync(
      [Buffer.from('contracts')],
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

    const instructions = await ikkyuProgram.methods
      .createMemeToken(name, symbol, imageUrl, description)
      .accountsStrict({
        // TODO: Replace with the correct ABI Method
        provider: ownerKey,
        providervault: providerVault,
        ownership,
        ikkyu: this.ikkyu,
        providerAtaBonk: ownerAtaBonk,
        ownershipBonk,
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

    // TODO: Replace with the correct contract
    const ikkyuProgram = new anchor.Program<Contract>(
      ContractJson as Contract,
      { connection }
    )

    // TODO: Replace with the correct program ID
    const ownerKey = new PublicKey(this.primaryWallet!.address)
    const ownership = PublicKey.findProgramAddressSync(
      [Buffer.from('contracts')],
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

    const instructions = await ikkyuProgram.methods
      .mintMemmeToken(new BN(amount), receiver)
      .accountsStrict({
        // TODO: Replace with the correct ABI Method
        provider: ownerKey,
        providervault: providerVault,
        ownership,
        ikkyu: this.ikkyu,
        providerAtaBonk: ownerAtaBonk,
        ownershipBonk,
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

  // Stake BONK tokens
  public async stakeToken(amount: number): Promise<string> {
    const connection = await this.getConnection()
    const signer = await this.getSigner()

    const ikkyuProgram = new anchor.Program<Contract>(
      ContractJson as Contract,
      { connection }
    )

    const ownerKey = new PublicKey(this.primaryWallet!.address)
    const ownership = PublicKey.findProgramAddressSync(
      [Buffer.from('tbw_yaminogemu')],
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

    const instructions = await ikkyuProgram.methods
      .deposit(new BN(amount * 1e6))
      .accountsStrict({
        provider: ownerKey,
        providervault: providerVault,
        ownership,
        mintBonk: this.ikkyu,
        providerAtaBonk: ownerAtaBonk,
        ownershipBonk,
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
}
