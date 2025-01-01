import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { solanaDevnet, polygonAmoy } from "@reown/appkit/networks";
import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useEffect, useState } from "react";

export function Web3ModalProvider({ children }) {
  const [blockChain, setBlockChain] = useState(localStorage.getItem('blockchain'));
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const chain = localStorage.getItem('blockchain');
    setBlockChain(chain);
    console.log("getBlockChain", chain);
  }, [localStorage.getItem('blockchain')]);

  const queryClient = new QueryClient();
  const projectId = "84072b7bf8a52cbefc58fcaceae93a20";

  const metadata = {
    name: "Guess.Meme",
    description: "guess meme project",
    url: "https://guess.meme",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
  };

  // Create adapters based on selected blockchain
  let activeAdapter;
  if (blockChain === "SOL") {
    activeAdapter = new SolanaAdapter({
      wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
      defaultNetwork: solanaDevnet.id,
      onConnect: () => {
        setIsConnected(true);
      },
      onDisconnect: () => {
        setIsConnected(false);
      }
    });
  } else {
    activeAdapter = new WagmiAdapter({
      networks: [polygonAmoy],
      projectId,
      ssr: true,
      defaultChainId: polygonAmoy.id,
      features: {
        metamask: true,
        walletConnect: true,
        coinbase: true,
        phantom: false,
        solflare: false
      },
      onConnect: async ({ address, connector }) => {
        setIsConnected(true);
        // Immediate chain switch attempt on connection
        if (window.ethereum) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${polygonAmoy.id.toString(16)}` }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: `0x${polygonAmoy.id.toString(16)}`,
                    chainName: 'Polygon Amoy',
                    rpcUrls: ['https://rpc-amoy.polygon.technology'],
                    nativeCurrency: {
                      name: 'MATIC',
                      symbol: 'MATIC',
                      decimals: 18
                    },
                  }],
                });
              } catch (addError) {
                console.error('Error adding Polygon Amoy:', addError);
              }
            }
          }
        }
      },
      onDisconnect: () => {
        setIsConnected(false);
      }
    });
  }

  const modal = createAppKit({
    adapters: [activeAdapter],
    networks: [blockChain === "SOL" ? solanaDevnet : polygonAmoy],
    projectId,
    metadata,
    allWallets: "HIDE",
    defaultChainId: blockChain === "ETH" ? polygonAmoy.id : solanaDevnet.id,
    features: {
      email: false,
      socials: false,
      analytics: true,
      walletConnect: false,
      ...(blockChain === "SOL" ? {
        phantom: true,
        solflare: true,
        metamask: false,
        coinbase: false,
      } : {
        phantom: false,
        solflare: false,
        metamask: true,
        coinbase: true,
      })
    },
    // Add disconnect options
    disconnect: {
      // Enable disconnect feature
      enabled: true,
      // Async function to handle disconnect
      callback: async () => {
        try {
          await activeAdapter.disconnect();
          setIsConnected(false);
          // Optional: Clear any local storage or state related to the connection
          // localStorage.removeItem('walletconnect');
          // localStorage.removeItem('connected');
        } catch (error) {
          console.error('Disconnect error:', error);
        }
      }
    }
  });

  // Monitor ethereum chain changes
  useEffect(() => {
    if (blockChain === "ETH" && window.ethereum) {
      const handleChainChanged = (chainId) => {
        // If chain is changed to something other than Polygon Amoy, try to switch back
        if (chainId !== `0x${polygonAmoy.id.toString(16)}`) {
          window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${polygonAmoy.id.toString(16)}` }],
          }).catch(console.error);
        }
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Cleanup listener
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [blockChain]);

  return blockChain === "ETH" ? (
    <WagmiProvider config={activeAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  ) : (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}