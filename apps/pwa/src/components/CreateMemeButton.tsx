import { useAccount, useWriteContract } from "wagmi";
import { TokenFactory } from "../../pkg/contracts/TokenFactory";
import { Button } from "./ui/button";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isSolanaWallet } from "@dynamic-labs/solana";
import { SolanaTransactionService } from "@/hooks/solanahook";
import { SolanaWallet } from "@dynamic-labs/solana-core";

interface CreateMemeButtonProps {
  name: string;
  symbol: string;
  imageUrl: string;
  description: string;
  className?: string;
}

export function CreateMemeButton({
  name,
  symbol,
  imageUrl,
  description,
  className,
}: CreateMemeButtonProps) {
  const { isConnected } = useAccount();

  const { writeContract, isError, failureReason } = useWriteContract();

  const [isSuccess, setIsSuccess] = useState(false);

  const { primaryWallet } = useDynamicContext()

  const handleOnClick = async () => {
    try {
      if (primaryWallet && isSolanaWallet(primaryWallet)) {

        const transaction = new SolanaTransactionService(
          primaryWallet as SolanaWallet
        )

        const signature = await transaction.createMemeToken(name, symbol, imageUrl, description);
        const explorerTx = `https://explorer.solana.com/tx/${signature}?cluster=devnet`

      }
      else {
        writeContract({
          abi: TokenFactory["abi"],
          address: "0x062b414E562ca0983c55D4731640e2E664cB96e2",
          functionName: "createMemeToken",
          args: [name, symbol, imageUrl, description],
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
      {isSuccess ? (
        <Badge>Success</Badge>
      ) : isConnected ? (
        <Button variant="outline" className={className} onClick={handleOnClick}>
          Mint Token
        </Button>
      ) : (
        <div className={className}>No connected</div>
      )}
      {isError && <div className="w-60">{failureReason?.message}</div>}
    </div>
  );
}
