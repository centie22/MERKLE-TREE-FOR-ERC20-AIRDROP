// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const {keccak256} = require("@ethersproject/keccak256");
const { ethers } = require("hardhat");
//const csv = require("csv-parser");

function encodeLeaf(address, spots){
  return ethers.utils.defaultAbiCoder.encode(["address", "uint64"], [address, spots]);
}
async function main() {
  
  const allWhiteListAddresses = [
    encodeLeaf("0x7e02ad7bfe2d5d87f448404a9e5b10ec32b9a20d", 220),
    encodeLeaf("0x11cacc84c5c73d28e67b5a1ba81a9eeac5873efe", 220),
    encodeLeaf("0x358f810120a810d069f481f45f22a04dfd102729", 220),
    encodeLeaf("0x52f789aa53d56504bc3d019fc23bd9e2a839a7cc", 220),
    encodeLeaf("0x7c31bdbaae4ba6ee7c29ea2decd4b09235fe9ced", 220),
    encodeLeaf("0xad14531958ff34a814eb280412ca4d8cb798578b", 220),
    encodeLeaf("0xa3b894dff16abc0e38d304da280eb0419b525cae", 220),
    encodeLeaf("0x7b640558b504c0ac17c379a730f095a79fa8207e", 220),
    encodeLeaf("0x84c25dae42c0862a51b50fa781da8b9ef2fcf171", 220),
    encodeLeaf("0x12ee2a26255063846f9dceb9f106288d7ef153c9", 220),
    encodeLeaf("0xd762ca5b33472d93ed477b681b3d0441e856ea44", 220)
    
  ]
  
  const merkleTree = new MerkleTree(allWhiteListAddresses, keccak256, {hashLeaves: true, sortPairs: true});
  

  console.log(merkleTree);
  
  const Signer = "0x52f789aa53d56504bc3d019fc23bd9e2a839a7cc";

  await helpers.impersonateAccount(Signer);
  
  const impersonatedSigner = await ethers.getSigner(Signer);

  await helpers.setBalance(Signer, ethers.utils.parseEther("3000000"));
  const signerBalance = await impersonatedSigner.getBalance();
console.log("The balance of the Signer is SignerBalance: ", signerBalance);

  
  const rootHash = merkleTree.getHexRoot();
  
  //console.log("Merkle tree of Whitelist addresses\n ", merkleTree.toString());
  console.log("The RootHash is: ", rootHash);

  const Merkle = await ethers.getContractFactory('MerkleTree'); //get instance of contract
  
  const merkletree = await Merkle.deploy(rootHash); //we deploy with name and symbol of nft as I use constructor
  await merkletree.deployed();
  console.log('Contract deployed to address:', merkletree.address);
  
  //generating hex proof of address
  
  const MsgSenderClaimer =keccak256(allWhiteListAddresses[3]);
  const hexProof = merkleTree.getHexProof(MsgSenderClaimer);
  
  console.log("this is hex proof: ", hexProof);
  
  //Verifying the msg.sender

  console.log("Verifying msg.sender address and claiming token");
  
   await merkletree.connect(impersonatedSigner).tokenWhilelistMint(hexProof, 220);
  const addressBalance = await merkletree.balanceOf(impersonatedSigner.address);
  
  console.log("Balance of impersonated signer is: ", addressBalance);
  
  
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
