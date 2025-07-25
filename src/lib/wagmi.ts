
import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { injected, walletConnect } from 'wagmi/connectors';

// Define Abstract testnet chain
export const abstractTestnet = defineChain({
  id: 11124,
  name: 'Abstract Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://api.testnet.abs.xyz'],
      webSocket: ['wss://api.testnet.abs.xyz/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Abstract Testnet Explorer',
      url: 'https://sepolia.abscan.org',
    },
  },
  testnet: true,
});

// WalletConnect project ID - using injected only for now to avoid 403 errors
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const config = createConfig({
  chains: [abstractTestnet],
  connectors: [
    injected(),
    // Only include WalletConnect if we have a valid project ID
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [abstractTestnet.id]: http(),
  },
});

export const chains = [abstractTestnet];
