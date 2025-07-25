# RPC Troubleshooting Guide

## Common Issues and Solutions

### 1. CORS Errors with Abstract Testnet RPC

**Problem:** You see errors like:
```
Access to fetch at 'https://api.testnet.abs.xyz/' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**

#### Option A: Use QuickNode (Recommended)
1. Sign up for a free account at [QuickNode](https://www.quicknode.com/signup)
2. Create an Abstract testnet endpoint
3. Add your endpoint URL to `.env`:
```bash
NEXT_PUBLIC_ABSTRACT_RPC_URL=https://your-quicknode-endpoint.com
NEXT_PUBLIC_ABSTRACT_WS_URL=wss://your-quicknode-endpoint.com
```

#### Option B: Use Alternative Public RPC (If Available)
Check for other public Abstract testnet RPC endpoints and add them to the fallback list in `src/lib/wagmi.ts`.

#### Option C: Development Workaround
For local development only, you can disable CORS in your browser:
- Chrome: Start with `--disable-web-security --user-data-dir=/tmp/chrome_dev`
- **Warning:** Only use this for development, never for production!

### 2. Toast Messages Not Showing

**Problem:** Success/error messages don't appear after transactions.

**Solution:** The toast system has been fixed with proper React Context. Make sure:
1. The `ToastProvider` is wrapping your app in `src/app/providers.tsx`
2. Components use `useToast()` hook correctly
3. Clear your browser cache and refresh

### 3. Infinite Error Loops

**Problem:** Console shows repeated RPC errors.

**Solution:** Error handling has been improved to prevent infinite retries:
- RecentTips and Leaderboard components now have proper error states
- Failed requests won't retry automatically
- Users can manually retry with "Try again" button

## For Production Deployment

### Vercel Deployment
1. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_ABSTRACT_RPC_URL` (if using custom RPC)
   - `NEXT_PUBLIC_ABSTRACT_WS_URL` (if using custom WebSocket)

2. The app will automatically use fallback RPC endpoints if custom ones aren't provided.

### Environment Variables
```bash
# Required for WalletConnect (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Custom RPC endpoints (optional but recommended)
NEXT_PUBLIC_ABSTRACT_RPC_URL=https://your-rpc-endpoint.com
NEXT_PUBLIC_ABSTRACT_WS_URL=wss://your-ws-endpoint.com
```

## Testing the Fixes

1. **Toast Messages:** Try connecting your wallet and performing any transaction
2. **RPC Connection:** Check browser console for reduced error messages
3. **Error Handling:** Disconnect internet briefly to see error states

## Getting Help

If you continue to experience issues:
1. Check the browser console for specific error messages
2. Verify your environment variables are set correctly
3. Try using a different RPC provider
4. Contact the Abstract team for RPC endpoint status

## Alternative RPC Providers

- **QuickNode:** https://www.quicknode.com/chains/abstract
- **Ankr:** Check if they support Abstract
- **Alchemy:** Check if they support Abstract
- **Infura:** Check if they support Abstract

Note: Abstract is a newer blockchain, so not all providers may support it yet.
