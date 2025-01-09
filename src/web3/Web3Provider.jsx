import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { solana, solanaTestnet, solanaDevnet, polygonAmoy, bscTestnet } from "@reown/appkit/networks";
import { mainnet, arbitrum, sepolia } from "@reown/appkit/networks";
import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import WalletContext from "../context/WalletContext";
import { useEffect, useState } from "react";

export function Web3ModalProvider({ children }) {
  const [block_chain, setBlock_chain] = useState(localStorage.getItem('blockchain'))

  useEffect(() => {
    setBlock_chain(localStorage.getItem('blockchain'))
    console.log("getBlockChain", block_chain)
  }, [block_chain, localStorage.getItem('blockchain')])

  // block_chain, setBlock_chain

  // 0. Setup queryClient
  const queryClient = new QueryClient();

  // 1. Get projectId from https://cloud.walletconnect.com
  const projectId = "84072b7bf8a52cbefc58fcaceae93a20";

  // 2. Create a metadata object - optional
  const metadata = {
    name: "Guess.Meme",
    description: "guess meme project",
    url: "https://guess.meme", // origin must match your domain & subdomain
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
  };

  // 3. Set the networks
  // const blockChain = localStorage.getItem("blockchain");
  // blockChain === "SOL" ? solanaDevnet : polygonAmoy;
  const networks  = [
    polygonAmoy,
    solanaDevnet,
    sepolia,
    bscTestnet
  ];

  // 4. Create Wagmi Adapter
  const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
  });

  // 2. Create Solana adapter
  const solanaWeb3JsAdapter = new SolanaAdapter({
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
  });

   const setAdapter = block_chain === "ETH" || block_chain === "POL" || block_chain === "BNB" ? [wagmiAdapter] : [solanaWeb3JsAdapter]

  //const setAdapter = block_chain == "ETH" ? [wagmiAdapter] : [solanaWeb3JsAdapter]
  // 5. Create modal
  const modal = createAppKit({
    adapters: setAdapter,
    networks,
    projectId,
    metadata,

    allWallets: "HIDE",

    features: {
      email: false,

      socials: false,
      analytics: true, // Optional - defaults to your Cloud configuration
    },
  });
  return block_chain === "ETH" ?(
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  ):(
    <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
  );
}