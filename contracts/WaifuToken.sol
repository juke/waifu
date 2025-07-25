// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WaifuToken
 * @dev Enhanced ERC20 token with additional features for the waifu ecosystem
 */
contract WaifuToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public totalBurned;

    // Tracking for analytics
    mapping(address => uint256) public lastTransferTime;
    mapping(address => uint256) public totalReceived;
    mapping(address => uint256) public totalSent;

    event TokensBurned(address indexed burner, uint256 amount);
    event LargeTransfer(address indexed from, address indexed to, uint256 amount);

    constructor(uint256 initialSupply) ERC20("Waifu Token", "WAIFU") Ownable(msg.sender) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max supply");
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Enhanced transfer with analytics tracking
     */
    function _update(address from, address to, uint256 value) internal override {
        super._update(from, to, value);

        // Track analytics (skip minting/burning)
        if (from != address(0) && to != address(0)) {
            lastTransferTime[from] = block.timestamp;
            lastTransferTime[to] = block.timestamp;
            totalSent[from] += value;
            totalReceived[to] += value;

            // Emit event for large transfers (>1% of total supply)
            if (value > totalSupply() / 100) {
                emit LargeTransfer(from, to, value);
            }
        }
    }

    /**
     * @dev Burn tokens to reduce supply
     */
    function burn(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance to burn");
        _burn(msg.sender, amount);
        totalBurned += amount;
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Owner can mint additional tokens (up to max supply)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        _mint(to, amount);
    }

    /**
     * @dev Get token statistics
     */
    function getTokenStats() external view returns (
        uint256 _totalSupply,
        uint256 _maxSupply,
        uint256 _totalBurned,
        uint256 _circulatingSupply
    ) {
        return (
            totalSupply(),
            MAX_SUPPLY,
            totalBurned,
            totalSupply() // In this case, circulating = total (no locked tokens)
        );
    }

    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) external view returns (
        uint256 balance,
        uint256 _totalReceived,
        uint256 _totalSent,
        uint256 _lastTransferTime
    ) {
        return (
            balanceOf(user),
            totalReceived[user],
            totalSent[user],
            lastTransferTime[user]
        );
    }
}
