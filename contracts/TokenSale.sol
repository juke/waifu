// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenSale
 * @dev Enhanced crowdsale contract for selling ERC20 tokens for ETH with analytics.
 */
contract TokenSale is Ownable {
    IERC20 public token;
    uint256 public rate; // Number of tokens per 1 ETH

    // Sale tracking
    uint256 public totalTokensSold;
    uint256 public totalETHRaised;
    uint256 public totalBuyers;
    uint256 public maxPurchasePerWallet = 10 ether; // Max 10 ETH per wallet
    bool public saleActive = true;

    // Buyer tracking
    mapping(address => uint256) public purchasesByWallet;
    mapping(address => bool) public hasPurchased;
    address[] public buyers;

    event TokensPurchased(address indexed buyer, uint256 amountETH, uint256 amountTokens);
    event Withdrawn(address indexed to, uint256 amount);
    event SaleStatusChanged(bool active);
    event MaxPurchaseChanged(uint256 newMax);

    /**
     * @param _token Address of the ERC20 token being sold
     * @param _rate Number of tokens per 1 ETH (e.g., 1000 means 1 ETH = 1000 tokens)
     */
    constructor(address _token, uint256 _rate) Ownable(msg.sender) {
        require(_token != address(0), "Token address cannot be zero");
        require(_rate > 0, "Rate must be greater than zero");
        token = IERC20(_token);
        rate = _rate;
    }

    /**
     * @dev Buy tokens by sending ETH to this contract.
     */
    function buyTokens() external payable {
        require(saleActive, "Sale is not active");
        require(msg.value > 0, "Send ETH to buy tokens");
        require(purchasesByWallet[msg.sender] + msg.value <= maxPurchasePerWallet, "Exceeds max purchase per wallet");

        uint256 tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount, "Not enough tokens in contract");

        // Update tracking
        if (!hasPurchased[msg.sender]) {
            hasPurchased[msg.sender] = true;
            buyers.push(msg.sender);
            totalBuyers++;
        }

        purchasesByWallet[msg.sender] += msg.value;
        totalTokensSold += tokenAmount;
        totalETHRaised += msg.value;

        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    /**
     * @dev Owner can withdraw collected ETH.
     */
    function withdrawETH(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        to.transfer(balance);
        emit Withdrawn(to, balance);
    }

    /**
     * @dev Owner can withdraw unsold tokens.
     */
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        require(token.transfer(to, amount), "Token transfer failed");
    }

    /**
     * @dev Owner can pause/unpause the sale.
     */
    function setSaleActive(bool _active) external onlyOwner {
        saleActive = _active;
        emit SaleStatusChanged(_active);
    }

    /**
     * @dev Owner can update max purchase per wallet.
     */
    function setMaxPurchasePerWallet(uint256 _maxPurchase) external onlyOwner {
        maxPurchasePerWallet = _maxPurchase;
        emit MaxPurchaseChanged(_maxPurchase);
    }

    /**
     * @dev Get total number of buyers.
     */
    function getBuyerCount() external view returns (uint256) {
        return totalBuyers;
    }

    /**
     * @dev Get buyer address by index.
     */
    function getBuyer(uint256 index) external view returns (address) {
        require(index < buyers.length, "Index out of bounds");
        return buyers[index];
    }

    /**
     * @dev Get sale statistics.
     */
    function getSaleStats() external view returns (
        uint256 _totalTokensSold,
        uint256 _totalETHRaised,
        uint256 _totalBuyers,
        uint256 _tokensAvailable,
        bool _saleActive
    ) {
        return (
            totalTokensSold,
            totalETHRaised,
            totalBuyers,
            token.balanceOf(address(this)),
            saleActive
        );
    }
}
