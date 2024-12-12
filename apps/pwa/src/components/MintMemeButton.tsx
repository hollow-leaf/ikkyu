import { useAccount, useWriteContract } from "wagmi";
import { Token } from "../../pkg/contracts/Token";
import { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isSolanaWallet } from "@dynamic-labs/solana";
import { SolanaTransactionService } from "@/hooks/solanahook";
import { SolanaWallet } from "@dynamic-labs/solana-core";

interface MintMemeButtonProps {
  amount: number;
  receiver: `0x${string}`;
  tokenAddr: `0x${string}`;
  className?: string;
}

export function MintMemeButton({
  amount,
  receiver,
  tokenAddr,
  className,
}: MintMemeButtonProps) {
  const { isConnected } = useAccount();
  const [isSuccess, setIsSuccess] = useState(false);
  const { writeContract, isError, failureReason } = useWriteContract();

  const { primaryWallet } = useDynamicContext()

  const handleOnClick = async () => {
    try {
      if (primaryWallet && isSolanaWallet(primaryWallet)) {

        const transaction = new SolanaTransactionService(
          primaryWallet as SolanaWallet
        )

        const signature = await transaction.mintMemeToken(amount, receiver);
        const explorerTx = `https://explorer.solana.com/tx/${signature}?cluster=devnet`

      }
      else {
        writeContract({
          abi: Token["abi"],
          address: tokenAddr,
          functionName: "mint",
          args: [amount, receiver],
        });
      }
      setIsSuccess(true);
    } catch (error) {
      alert(error);
      setIsSuccess(false);
    }
  };

  return (
    <div>
      {isConnected ? (
        <button
          className={className}
          onClick={() => {
            console.log("Click!");
            handleOnClick;
          }}
        >
          Mint
        </button>
      ) : (
        <div className={className}>Disconnected</div>
      )}
      {isError && <div>{failureReason?.message}</div>}
    </div>
  );
}
