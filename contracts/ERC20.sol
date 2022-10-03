// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AirToken is ERC20, Ownable {
    constructor() ERC20("AirToken", "AIRs") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint( uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
