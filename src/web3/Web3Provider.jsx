import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";

import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import { mainnet, arbitrum, sepolia } from "@reown/appkit/networks";

import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";

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
const networks = [
  mainnet,
  arbitrum,
  sepolia,
  solana,
  solanaTestnet,
  solanaDevnet,
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

const getBlockChain = localStorage.getItem("blockchain");
console.log("getBlockChain", getBlockChain);

const setAdapter = getBlockChain == "ETH" ? [wagmiAdapter]:[solanaWeb3JsAdapter] 
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
export function Web3ModalProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
