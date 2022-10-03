//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./ERC20.sol";

contract MerkleTree is AirToken{
    bytes32 public merkleTreeRoot;

    constructor (bytes32 _merkleTreeRoot) {
        merkleTreeRoot = _merkleTreeRoot;
    }

    mapping(address => bool) Tokenclaimed;

    function tokenWhilelistMint(bytes32[] calldata _merkleproof, uint tokenMint) public{
        bytes32 leaf =keccak256(abi.encode(msg.sender, tokenMint));

        require(!Tokenclaimed[msg.sender], "User already claimed Airdrop");
        require(MerkleProof.verify(_merkleproof, merkleTreeRoot, leaf), "Invalid proof!");

        mint(tokenMint);

        Tokenclaimed[msg.sender] = true;
    }

    function checkAddrStatus(address _addr) public view returns(bool) {
        return Tokenclaimed[_addr];
    }
}