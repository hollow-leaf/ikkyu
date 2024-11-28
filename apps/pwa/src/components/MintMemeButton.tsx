import { useAccount, useWriteContract } from "wagmi";
import { Token } from "../../pkg/contracts/Token";

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

  const { writeContract, isError, failureReason } = useWriteContract();

  return (
    <div>
      {isConnected ? (
        <button
          className={className}
          onClick={() => {
            console.log("Click!");
            writeContract({
              abi: Token["abi"],
              address: tokenAddr,
              functionName: "mint",
              args: [amount, receiver],
            });
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
