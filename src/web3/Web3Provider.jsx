import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { solanaDevnet, polygonAmoy, sepolia, bscTestnet } from "@reown/appkit/networks";
import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useEffect, useState } from "react";

export function Web3ModalProvider({ children }) {
  const [blockChain, setBlockChain] = useState(localStorage.getItem('blockchain') || 'SOL');
  const [isConnected, setIsConnected] = useState(false);
  //////
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const storedChain = localStorage.getItem('blockchain') || 'SOL';
    setBlockChain(storedChain);
    // Check if device is mobile
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  const queryClient = new QueryClient();
  const projectId = "84072b7bf8a52cbefc58fcaceae93a20";
  const metadata = {
    name: "Guess.Meme",
    description: "guess meme project",
    url: "https://guessmemelive.netlify.app/",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
  };

  // Configure adapters and wallets based on the selected blockchain
  // const solanaWallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
  const solanaWallets = [
    new PhantomWalletAdapter({ appIdentity: metadata }),
    new SolflareWalletAdapter({ appIdentity: metadata })
  ];  

  const ethereumNetworks =
    blockChain === "ETH" ? [sepolia] :
      blockChain === "POL" ? [polygonAmoy] :
        blockChain === "BNB" ? [bscTestnet] : [];

  const activeAdapter = blockChain === "SOL"
    ? new SolanaAdapter({
      wallets: solanaWallets,
      defaultNetwork: solanaDevnet.id,
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false)
    })
    : new WagmiAdapter({
      networks: ethereumNetworks,
      projectId,
      ssr: true,
      defaultChainId: ethereumNetworks[0].id,
      features: {
        metamask: true,
        walletConnect: true,
        coinbase: true,
      },
    });

  createAppKit({
    adapters: [activeAdapter],
    networks: blockChain === "SOL" ? [solanaDevnet] : ethereumNetworks,
    projectId,
    metadata,
    allWallets: "HIDE",
    defaultChainId: blockChain === "SOL" ? solanaDevnet.id : ethereumNetworks[0].id,
    features: {
      email: false,
      socials: false,
      analytics: true,
      mobileWallets: true, // Explicitly enable mobile wallets
    },
  });

  return blockChain !== "SOL" ? (
    <WagmiProvider config={activeAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  ) : (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}


