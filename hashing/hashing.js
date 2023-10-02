
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

// insert each line into blockchain
for (let line of poem) {
	const newBlock = createBlock(line);
	Blockchain.blocks.push(newBlock);
}

console.log(`Blockchain is_valid: ${verifyChain(Blockchain)}`);

// ********************************

function blockHash(bl) {
	return crypto
		.createHash("sha256")
		.update(
			// use block data to calculate hash
			bl.toString()
		)
		.digest("hex");
}

function createBlock(data) {
	// since gensis block is 0,
	// the length of blockchain with genesis block will be 1,
	// which can be used as the index for the next block
	const index = Blockchain.blocks.length;

	// get the last block and it's hash
	const lastBlock = Blockchain.blocks[index - 1];
	const prevHash = lastBlock.hash;

	// create new block, hash the block
	const newBlock = {
		index,
		prevHash,
		data,
		timestamp: Date.now(),
	};
	const hash = blockHash(newBlock);

	// return the new object with data and hash combined
	return { ...newBlock, hash };
}

function verifyChain(blockchain) {
	for (let block of blockchain.blocks) {
		// if verifyBlock returns true, continue checking the next block in loop
		if (verifyBlock(block)) continue;

		// if the loop didn't continued due to getting false,
		// flag the blockchain invalid by returning false
		return false;
	}
	// if loop continued through all blocks succesfully, signify blockchain is valid by returning true
	return true;
}

function verifyBlock(block) {
	// check if index is positive integer
	if (block.index < 0) return false;

	// check hash incase of genesis block
	if (block.index === 0 && block.hash != "000000") return false;

	// if not genesis block
	if (block.index !== 0) {
		// check previous hash is not empty
		if (block.prevHash === "") return false;

		// check length of data
		if (block.data.length === "") return false;

		// check block with blockHash
		const { hash, ...blockWithoutHash } = block;
		if (blockHash(blockWithoutHash) !== block.hash) return false;

		// check the prevHash of current block is equal to hash of previous block
		const previousBlock = Blockchain.blocks[block.index - 1];
		if (block.prevHash !== previousBlock.hash) return false;
	}

	// if all previous failchecks aren't triggered, then the blockchain is valid
	return true;
}