---
type: "always_apply"
---

# MVP Product Requirements Document (PRD): Waifu VTuber Launchpad Website (Testnet-First, No Embedded Livestream)

## 1. Overview
This MVP website is for launching a 3D waifu VTuber character that will be streamed 24/7 on Abstract. The site will allow users to connect their wallets, participate in a simple token presale, and tip the character. Due to Abstract limitations, the live stream will NOT be embedded on the site; instead, the site will link out to the waifu’s Abstract stream.

---

## 2. Goals
- Provide a landing page with a clear link/button to watch the waifu’s live stream on Abstract.
- Allow users to connect their Ethereum-compatible wallets (MetaMask, etc).
- Let users buy waifu tokens with testnet ETH (simple ICO).
- Allow users to tip the VTuber using testnet ETH or waifu tokens.
- Keep the design bold, simple, and fun.
- Ensure all smart contract interactions are tested on Abstract testnet before mainnet launch.

---

## 3. Core Features

### 3.1 Landing Page
- Prominent button or link to the waifu’s live stream on Abstract.
- Hero section with waifu art/banner.
- Simple, clear layout.

### 3.2 Wallet Integration
- Use wagmi and ethers.js for wallet connection and contract calls.
- Users connect via MetaMask or similar.
- Prompt user to switch to Abstract testnet if not already connected.
- Show wallet address when connected.

### 3.3 Token Sale (ICO)
- Show token sale status and price.
- Users enter amount and buy tokens with testnet ETH.
- Call smart contract function to handle purchase.
- Show transaction status (pending/success/fail).

### 3.4 Tipping
- Users enter an amount and tip the VTuber using testnet ETH or waifu tokens.
- Call smart contract function to handle tip.
- Show basic success/failure notification.

---

## 4. Technical Requirements

- **Frontend:** React (with wagmi/ethers.js), TypeScript preferred.
- **Live Stream:** No embedding; provide external link to Abstract stream.
- **Smart Contracts:** Token sale and tipping contract addresses and ABIs as config (deployed to Abstract testnet).
- **Testnet ETH:** Use Abstract testnet faucets ([Triangle faucet](https://docs.abs.xyz/tooling/faucets#faucets), [Thirdweb faucet](https://docs.abs.xyz/tooling/faucets#faucets)) to obtain testnet ETH for development and testing.
- **No advanced features** (no profiles, activity feeds, voting, etc).

---

## 5. User Flow

1. User lands on site and sees hero banner + link to waifu’s Abstract stream.
2. User clicks “Connect Wallet.”
3. User is prompted to switch to Abstract testnet if needed.
4. User can:
   - Buy tokens (enter amount, confirm transaction with testnet ETH).
   - Tip the waifu (enter amount, confirm transaction with testnet ETH or testnet waifu tokens).
5. User receives confirmation or error message for each action.
6. User can click the link to view the live stream on Abstract in a new tab.

---

## 6. Design & UX

- Playful, bold, waifu-inspired visuals.
- Minimal, clear layout.
- Responsive for desktop and mobile.

---

## 7. Out of Scope for MVP

- Embedded livestream
- Multi-character/coin support
- Custom coin creation
- User profiles
- Activity feeds
- Community voting/governance

---

## 8. Testing & Deployment

- All development and QA will take place on Abstract testnet.
- Testnet ETH can be obtained via official [Abstract faucets](https://docs.abs.xyz/tooling/faucets#faucets).
- Only deploy to mainnet after full testnet validation.

---

**MVP Focus:**  
- Clear link to live stream  
- Wallet connect  
- Token sale (testnet)  
- Tipping (testnet)  
- Minimal, fun design

**No mainnet/real ETH until tested.**