
import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, arbitrum],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export { chains };
