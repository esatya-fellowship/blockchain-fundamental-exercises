"use strict"

var crypto = require("crypto")

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
]

var Blockchain = {
	blocks: [],
}

// Genesis block
Blockchain.blocks.push({
	index: 0,
	hash: "000000",
	data: "",
	timestamp: Date.now(),
})

function blockHash(bl) {
	return crypto.createHash("sha256").update(
		// TODO: use block data to calculate hash
		bl.index + bl.prevHash + bl.data + bl.timestamp
	).digest("hex")
}

// Function to create a new block
function createBlock(index, prevHash, data) {
	var block = {
		index: index,
		prevHash: prevHash,
		data: data,
		timestamp: Date.now(),
		hash: ""
	}
	block.hash = blockHash(block)
	return block
}

// TODO: insert each line into blockchain
for (let i = 0; i < poem.length; i++) {
    var prevBlock = Blockchain.blocks[i]
    var newBlock = createBlock(i + 1, prevBlock.hash, poem[i])
    Blockchain.blocks.push(newBlock)
}

// Function to verify the whole Blockchain
function verifyBlock(block) {
    if (typeof block.index !== 'number' || block.index < 0) {
        return false
    }
    if (typeof block.prevHash !== 'string' || block.prevHash.length === 0) {
        return false
    }
    if (typeof block.data !== 'string' || block.data.length === 0) {
        return false
    }
    if (typeof block.hash !== 'string' || block.hash !== blockHash(block)) {
        return false
    }
    if (block.index === 0 && block.hash !== "000000") {
        return false
    }
    return true
}

// Function to verify whole Blockchain
function verifyChain(blockchain) {
    for (let i = 1; i < blockchain.blocks.length; i++) {
        if (!verifyBlock(blockchain.blocks[i])) {
            return false
        }
        if (blockchain.blocks[i].prevHash !== blockchain.blocks[i - 1].hash) {
            return false
        }
    }
    return true
}


console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`)