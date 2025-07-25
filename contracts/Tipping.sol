// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Tipping
 * @dev Enhanced tipping contract with analytics and ETH support
 */
contract Tipping is Ownable, ReentrancyGuard {
    IERC20 public token;
    address public waifuAddress; // The waifu's address to receive tips

    // Tipping statistics
    uint256 public totalETHTipped;
    uint256 public totalTokensTipped;
    uint256 public totalTippers;
    uint256 public totalTips;

    // User tracking
    mapping(address => uint256) public userETHTipped;
    mapping(address => uint256) public userTokensTipped;
    mapping(address => uint256) public userTipCount;
    mapping(address => bool) public hasTipped;
    mapping(address => uint256) public lastTipTime;

    // Tip tracking
    struct TipRecord {
        address tipper;
        address recipient;
        uint256 amount;
        bool isETH;
        uint256 timestamp;
        string message;
    }

    TipRecord[] public tipHistory;
    address[] public tippers;

    event ETHTipped(address indexed from, address indexed to, uint256 amount, string message);
    event TokensTipped(address indexed from, address indexed to, uint256 amount, string message);
    event WaifuAddressUpdated(address indexed oldAddress, address indexed newAddress);

    /**
     * @param _token Address of the WaifuToken contract
     * @param _waifuAddress Address to receive tips for the waifu
     */
    constructor(address _token, address _waifuAddress) Ownable(msg.sender) {
        require(_token != address(0), "Token address cannot be zero");
        require(_waifuAddress != address(0), "Waifu address cannot be zero");
        token = IERC20(_token);
        waifuAddress = _waifuAddress;
    }

    /**
     * @dev Tip with ETH
     */
    function tipETH(string calldata message) external payable nonReentrant {
        require(msg.value > 0, "Must send ETH to tip");
        require(waifuAddress != address(0), "Waifu address not set");

        // Update statistics
        if (!hasTipped[msg.sender]) {
            hasTipped[msg.sender] = true;
            tippers.push(msg.sender);
            totalTippers++;
        }

        userETHTipped[msg.sender] += msg.value;
        userTipCount[msg.sender]++;
        lastTipTime[msg.sender] = block.timestamp;
        totalETHTipped += msg.value;
        totalTips++;

        // Record tip
        tipHistory.push(TipRecord({
            tipper: msg.sender,
            recipient: waifuAddress,
            amount: msg.value,
            isETH: true,
            timestamp: block.timestamp,
            message: message
        }));

        // Transfer ETH to waifu
        (bool success, ) = waifuAddress.call{value: msg.value}("");
        require(success, "ETH transfer failed");

        emit ETHTipped(msg.sender, waifuAddress, msg.value, message);
    }

    /**
     * @dev Tip with WAIFU tokens
     */
    function tipTokens(uint256 amount, string calldata message) external nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(waifuAddress != address(0), "Waifu address not set");

        // Update statistics
        if (!hasTipped[msg.sender]) {
            hasTipped[msg.sender] = true;
            tippers.push(msg.sender);
            totalTippers++;
        }

        userTokensTipped[msg.sender] += amount;
        userTipCount[msg.sender]++;
        lastTipTime[msg.sender] = block.timestamp;
        totalTokensTipped += amount;
        totalTips++;

        // Record tip
        tipHistory.push(TipRecord({
            tipper: msg.sender,
            recipient: waifuAddress,
            amount: amount,
            isETH: false,
            timestamp: block.timestamp,
            message: message
        }));

        require(token.transferFrom(msg.sender, waifuAddress, amount), "Token transfer failed");
        emit TokensTipped(msg.sender, waifuAddress, amount, message);
    }

    /**
     * @dev Update waifu address (owner only)
     */
    function setWaifuAddress(address _waifuAddress) external onlyOwner {
        require(_waifuAddress != address(0), "Cannot set zero address");
        address oldAddress = waifuAddress;
        waifuAddress = _waifuAddress;
        emit WaifuAddressUpdated(oldAddress, _waifuAddress);
    }

    /**
     * @dev Get tipping statistics
     */
    function getTippingStats() external view returns (
        uint256 _totalETHTipped,
        uint256 _totalTokensTipped,
        uint256 _totalTippers,
        uint256 _totalTips,
        address _waifuAddress
    ) {
        return (
            totalETHTipped,
            totalTokensTipped,
            totalTippers,
            totalTips,
            waifuAddress
        );
    }

    /**
     * @dev Get user tipping statistics
     */
    function getUserTippingStats(address user) external view returns (
        uint256 ethTipped,
        uint256 tokensTipped,
        uint256 tipCount,
        uint256 _lastTipTime,
        bool _hasTipped
    ) {
        return (
            userETHTipped[user],
            userTokensTipped[user],
            userTipCount[user],
            lastTipTime[user],
            hasTipped[user]
        );
    }

    /**
     * @dev Get recent tips
     */
    function getRecentTips(uint256 count) external view returns (TipRecord[] memory) {
        if (count > tipHistory.length) {
            count = tipHistory.length;
        }

        TipRecord[] memory recentTips = new TipRecord[](count);
        uint256 historyLength = tipHistory.length;

        for (uint256 i = 0; i < count; i++) {
            // Return in reverse chronological order (most recent first)
            recentTips[i] = tipHistory[historyLength - 1 - i];
        }

        return recentTips;
    }

    /**
     * @dev Get total number of tips
     */
    function getTipCount() external view returns (uint256) {
        return tipHistory.length;
    }

    /**
     * @dev Get top tippers
     */
    function getTopTippers(uint256 count) external view returns (
        address[] memory addresses,
        uint256[] memory ethAmounts,
        uint256[] memory tokenAmounts
    ) {
        if (count > tippers.length) {
            count = tippers.length;
        }

        addresses = new address[](count);
        ethAmounts = new uint256[](count);
        tokenAmounts = new uint256[](count);

        // Simple implementation so far - in production, we would want to sort by total value i reckon
        for (uint256 i = 0; i < count && i < tippers.length; i++) {
            addresses[i] = tippers[i];
            ethAmounts[i] = userETHTipped[tippers[i]];
            tokenAmounts[i] = userTokensTipped[tippers[i]];
        }

        return (addresses, ethAmounts, tokenAmounts);
    }
}
