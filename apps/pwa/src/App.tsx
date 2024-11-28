import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppContextProvider } from "./contexts/AppContext";
import PumpGame from "./routes/pump-game";
import WalletProvider from "./components/providers/wallet-provider";
import Start from "./components/start";
import GameLayout from "./routes/game-layout";
import Toaster from "./components/toaster";
import FomoGame from "./routes/fomo-game";
import { MintMemeButton } from "./components/MintMemeButton";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Start />,
  },
  {
    path: "/game",
    element: <GameLayout />,
    children: [
      {
        path: "pump",
        element: <PumpGame />,
      },
      {
        path: "fomo",
        element: <FomoGame />,
      },
    ],
  },
  {
    path: "/contractTest",
    element: (
      <MintMemeButton
        amount={1000}
        receiver="0x6F744A5737507F035c42872f6869203829F78E36"
        tokenAddr="0xce06BD17190F1146846f0e09B78591b3BF904926"
      />
    ),
  },
]);

export default function App() {
  return (
    <WalletProvider>
      <AppContextProvider>
        <main className="relative mx-auto flex h-screen w-screen flex-col items-center overflow-hidden bg-black font-space-grotesk text-white">
          <RouterProvider router={router} />
        </main>
        <Toaster />
      </AppContextProvider>
    </WalletProvider>
  );
}
