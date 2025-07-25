
import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { injected, walletConnect } from 'wagmi/connectors';

// Get RPC URLs from environment variables or use defaults
const getAbstractRpcUrls = () => {
  const customRpc = process.env.NEXT_PUBLIC_ABSTRACT_RPC_URL;
  const customWs = process.env.NEXT_PUBLIC_ABSTRACT_WS_URL;

  // Default RPC endpoints with fallbacks
  const defaultHttpUrls = [
    'https://api.testnet.abs.xyz',
    // Add more fallback URLs here if available
  ];

  const defaultWsUrls = [
    'wss://api.testnet.abs.xyz/ws',
    // Add more fallback WebSocket URLs here if available
  ];

  return {
    http: customRpc ? [customRpc, ...defaultHttpUrls] : defaultHttpUrls,
    webSocket: customWs ? [customWs, ...defaultWsUrls] : defaultWsUrls,
  };
};

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
    default: getAbstractRpcUrls(),
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
    [abstractTestnet.id]: http(undefined, {
      batch: true,
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
});

export const chains = [abstractTestnet];
