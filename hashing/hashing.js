"use strict";

var crypto = require("crypto");

// The Power of a Smile
// by Tupac Shakur
var poem = [
	"The power of a gun can kill",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

var Blockchain = {
	blocks: [],
};

// Genesis block
Blockchain.blocks.push({
	index: 0,
	hash: "000000",
	data: "",
	timestamp: Date.now(),
});

// TODO: insert each line into blockchain
for (let [index, line] of poem.entries()) {
	let blockData = {
		index: Blockchain.blocks[index].index + 1,
		data: line,
		timestamp: Date.now(),
		prevHash: Blockchain.blocks[index].hash,
	}
	Blockchain.blocks.push({
		index: Blockchain.blocks[index].index + 1,
		prevHash: Blockchain.blocks[index].hash,
		data: line,
		timestamp: Date.now(),
		hash: blockHash(JSON.stringify(blockData)), // crypto.createHash().update() method expects a string or a buffer as input
	})
}

console.log(Blockchain)
console.log(`Blockchain is valid: ${verifyChain()}`);

// **********************************

function blockHash(blockData) {
	return crypto.createHash("sha256").update(
		blockData
	).digest("hex");
}

//Verify a block
function verifyBlock(block) {
	const {data, prevHash, index, hash} = block;
	let blockData = {index, data, timestamp: block.timestamp, prevHash};

	if (!data) return false; //Checking if data is non-empty
	if (index === 0 && hash !== '000000') return false; //For the genesis block, hash must be "000000"
	if (!prevHash) return false;//Checking if prevHash is non-empty
	if (!Number.isInteger(index) || index < 0) return false;// index must be an integer >= 0
	if (hash !== blockHash(JSON.stringify(blockData))) return false;// Verifying if the calculated hash matches the stored hash
  
	return true;
}

//Verify the entire blockchain
function verifyChain() {
	const blocks = Blockchain.blocks;
	
	if (blocks.length < 2) return false;// Checking if there are at least two blocks to verify linkage
  
	for (let i = 1; i < blocks.length; i++) {
	  const currentBlock = blocks[i];
	  const previousBlock = blocks[i - 1];
	  
	  if (currentBlock.prevHash !== previousBlock.hash) return false;// Checking linkage between currentBlock and previousBlock
	  
	  if (!verifyBlock(currentBlock)) return false;// Verifying the individual blocks
	}
  
	return true; // Chain is valid
  }