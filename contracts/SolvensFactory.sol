// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./SolvensVault.sol";

/**
 * @title SolvensFactory
 * @notice Factory for deploying new isolated loan vaults using EIP-1167 clones.
 */
contract SolvensFactory is Ownable {
    
    address public vaultImplementation;
    address[] public allLoans;

    /**
     * @notice Emitted when a new loan coffer is created.
     ...
     */
    event LoanCreated(
        address indexed vaultAddress, 
        address indexed borrower, 
        string tokenName, 
        uint256 totalDebt,
        uint256 apr,
        uint256 collateral
    );

    constructor(address _implementation) Ownable(msg.sender) {
        vaultImplementation = _implementation;
    }

    /**
     * @notice Updates the implementation address for future clones.
     * @param _newImplementation New SolvensVault implementation address.
     */
    function setImplementation(address _newImplementation) external onlyOwner {
        require(_newImplementation != address(0), "Invalid address");
        vaultImplementation = _newImplementation;
    }

    /**
     * @notice Programmatically creates a new loan vault.
     */
    function createLoan(
        string memory _tokenName,
        uint256 _amount,
        uint256 _apr,
        uint256 _duration,
        uint256 _collateral
    ) external returns (address) {
        // Deploy proxy
        address clone = Clones.clone(vaultImplementation);
        
        // Initialize the proxy
        SolvensVault(clone).initialize(
            msg.sender, 
            _amount, 
            _apr, 
            _duration, 
            _collateral,
            ""
        );

        allLoans.push(clone);

        // Emit informative log for the dashboard
        emit LoanCreated(
            clone, 
            msg.sender, 
            _tokenName, 
            _amount, 
            _apr, 
            _collateral
        );

        return clone;
    }

    function getLoansCount() external view returns (uint256) {
        return allLoans.length;
    }
}
