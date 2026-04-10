// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SolvensVault
 * @notice Isolated lending vault for a specific loan.
 */
contract SolvensVault is ERC1155, Initializable, ReentrancyGuard {
    
    // IDs for different risk tranches
    uint256 public constant TOKEN_CALLER = 0; // High Risk / YES position
    uint256 public constant TOKEN_SELLER = 1; // Low Risk / NO position

    address public borrower;
    uint256 public targetAmount;
    uint256 public apr; // Annual Interest Rate (basis points, e.g., 3250 = 32.5%)
    uint256 public duration; // in seconds
    uint256 public collateralAmount;
    
    uint256 public startTime;
    bool public isRepaid;
    
    event Invested(address indexed investor, uint256 position, uint256 amount);
    event Repaid(uint256 totalAmount);
    event Withdrawn(address indexed investor, uint256 amount);

    constructor() ERC1155("") {
        _disableInitializers();
    }

    /**
     * @notice Initialize the clone with specific loan parameters.
     */
    function initialize(
        address _borrower,
        uint256 _targetAmount,
        uint256 _apr,
        uint256 _duration,
        uint256 _collateralAmount,
        string memory _uri
    ) public initializer {
        borrower = _borrower;
        targetAmount = _targetAmount;
        apr = _apr;
        duration = _duration;
        collateralAmount = _collateralAmount;
        // Set URI if needed
    }

    /**
     * @notice Invest in the loan by taking a position.
     * @param position 0 for Caller, 1 for Seller.
     * @param amount Amount to invest (USDC).
     */
    function invest(uint256 position, uint256 amount) external nonReentrant {
        require(position <= 1, "Invalid position");
        require(startTime == 0, "Loan already started");
        
        // Logic for transferring USDC would go here
        // For now, we mint the debt token representing the position
        _mint(msg.sender, position, amount, "");
        
        emit Invested(msg.sender, position, amount);
    }

    /**
     * @notice Borrower repays the loan.
     */
    function repay() external nonReentrant {
        require(msg.sender == borrower, "Only borrower can repay");
        require(!isRepaid, "Already repaid");
        
        isRepaid = true;
        emit Repaid(targetAmount);
    }

    // Additional logic for liquidations and withdrawals would be implemented here...
}
