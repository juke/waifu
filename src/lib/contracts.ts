import { Address } from 'viem';

// Contract addresses on Abstract testnet
export const CONTRACT_ADDRESSES = {
  WAIFU_TOKEN: '0x1f3d611eB258CD59f91461bbBCB0c93970eB389c' as Address,
  TOKEN_SALE: '0xE33172A3A94209c240840128487a80A37b48d17D' as Address,
  TIPPING: '0x1F49814E3aa4f8582c69a00421FBE9C2273046Ef' as Address,
} as const;

// ERC20 Token ABI (simplified for our needs)
export const WAIFU_TOKEN_ABI = [
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'transferFrom',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  // Enhanced functions
  {
    type: 'function',
    name: 'getTokenStats',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '_totalSupply', type: 'uint256' },
      { name: '_maxSupply', type: 'uint256' },
      { name: '_totalBurned', type: 'uint256' },
      { name: '_circulatingSupply', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getUserStats',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'balance', type: 'uint256' },
      { name: '_totalReceived', type: 'uint256' },
      { name: '_totalSent', type: 'uint256' },
      { name: '_lastTransferTime', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'burn',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'totalBurned',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'MAX_SUPPLY',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'TokensBurned',
    inputs: [
      { name: 'burner', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'LargeTransfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
] as const;

// Enhanced Token Sale Contract ABI
export const TOKEN_SALE_ABI = [
  {
    type: 'function',
    name: 'token',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'rate',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'buyTokens',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getSaleStats',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '_totalTokensSold', type: 'uint256' },
      { name: '_totalETHRaised', type: 'uint256' },
      { name: '_totalBuyers', type: 'uint256' },
      { name: '_tokensAvailable', type: 'uint256' },
      { name: '_saleActive', type: 'bool' },
    ],
  },
  {
    type: 'function',
    name: 'totalTokensSold',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalETHRaised',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalBuyers',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'saleActive',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'maxPurchasePerWallet',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'purchasesByWallet',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  // Removed saleActive function - not needed
  {
    type: 'event',
    name: 'TokensPurchased',
    inputs: [
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'cost', type: 'uint256', indexed: false },
    ],
  },
] as const;

// Enhanced Tipping Contract ABI
export const TIPPING_ABI = [
  {
    type: 'function',
    name: 'tipETH',
    stateMutability: 'payable',
    inputs: [{ name: 'message', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'tipTokens',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'message', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getTippingStats',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: '_totalETHTipped', type: 'uint256' },
      { name: '_totalTokensTipped', type: 'uint256' },
      { name: '_totalTippers', type: 'uint256' },
      { name: '_totalTips', type: 'uint256' },
      { name: '_waifuAddress', type: 'address' },
    ],
  },
  {
    type: 'function',
    name: 'getUserTippingStats',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'ethTipped', type: 'uint256' },
      { name: 'tokensTipped', type: 'uint256' },
      { name: 'tipCount', type: 'uint256' },
      { name: '_lastTipTime', type: 'uint256' },
      { name: '_hasTipped', type: 'bool' },
    ],
  },
  {
    type: 'function',
    name: 'waifuAddress',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'totalETHTipped',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalTokensTipped',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalTippers',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'ETHTipped',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'message', type: 'string', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'TokensTipped',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'message', type: 'string', indexed: false },
    ],
  },
] as const;

// Contract configuration type
export type ContractConfig = {
  address: Address;
  abi: readonly unknown[];
};

// Export contract configurations
export const CONTRACTS = {
  WAIFU_TOKEN: {
    address: CONTRACT_ADDRESSES.WAIFU_TOKEN,
    abi: WAIFU_TOKEN_ABI,
  },
  TOKEN_SALE: {
    address: CONTRACT_ADDRESSES.TOKEN_SALE,
    abi: TOKEN_SALE_ABI,
  },
  TIPPING: {
    address: CONTRACT_ADDRESSES.TIPPING,
    abi: TIPPING_ABI,
  },
} as const;

// Token configuration
export const TOKEN_CONFIG = {
  name: 'Waifu Token',
  symbol: 'WAIFU',
  decimals: 18,
  // Price in ETH (e.g., 0.001 ETH per token)
  priceInETH: '0.001',
} as const;
