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
	data: "Genesis block",
	timestamp: Date.now(),
	previousHash: null, 
});

// TODO: insert each line into blockchain
for (let line of poem) {
	const newBlock = {
	  index: Blockchain.blocks.length,
	  data: line,
	  timestamp: Date.now(),
	  previousHash: Blockchain.blocks[Blockchain.blocks.length - 1].hash, // Set previousHash for new blocks
	};
  
	insertBlock(Blockchain, newBlock);
}
  
	

function verifyChain(blockchain) {
	for (let i = 1; i < blockchain.blocks.length; i++) {
	  const currentBlock = blockchain.blocks[i];
	  const previousBlock = blockchain.blocks[i - 1];
  
	  if (currentBlock.hash !== blockHash(currentBlock)) {
		return false;
	  }
  
	  if (currentBlock.previousHash !== previousBlock.hash) {
		return false;
	  }
	}
  
	return true;
}
  
  console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);
  
  function insertBlock(blockchain, newBlock) {
	blockchain.blocks.push(newBlock);
}
  

function blockHash(bl) {
	return crypto.createHash("sha256").update(
	  JSON.stringify(bl)
	).digest("hex");
}
  