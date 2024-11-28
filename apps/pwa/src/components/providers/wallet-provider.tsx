import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { http } from "viem";
import { baseSepolia, scrollSepolia, arbitrumSepolia } from "viem/chains";
import { PropsWithChildren } from "react";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { FlowWalletConnectors } from "@dynamic-labs/flow";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const dynamicKey = import.meta.env.VITE_DYNAMICAPIKEY;

const config = createConfig({
  chains: [baseSepolia, scrollSepolia, arbitrumSepolia],
  transports: {
    [baseSepolia.id]: http(),
    [scrollSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
  multiInjectedProviderDiscovery: false,
});

const queryClient = new QueryClient();

export default function WalletProvider({ children }: PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: dynamicKey,

        walletConnectors: [FlowWalletConnectors, EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <DynamicWidget />
            {children}
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
