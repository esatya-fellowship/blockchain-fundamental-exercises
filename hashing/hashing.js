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
//inserting each line into blockchain
for (let [index, line] of poem.entries() )
{
	let blockData = {
		index: Blockchain.blocks[index].index +1,
		prevhash: Blockchain.blocks[index].hash,
		data: line,
		timestamp: Date.now(),
	}
	Blockchain.blocks.push({
		...blockData, //spread blockData properties
		hash: blockHash(JSON.stringify(blockData)), //ensure that the data is in a consistent format
	})
}
console.log(Blockchain)
console.log('Blockchain is valid: ',verifyChain(Blockchain));

function blockHash(blockData) {
	return crypto.createHash("sha256").update(
		//using block data to calculate hash
		blockData
	).digest("hex");
}
function verifyBlock(block){
	const {data, prevhash, index, hash} = block;
	//verifying as per the readme document
	if (!data) return false;
	if (index == 0 )
	{
		if (hash!= '000000' ) return false;
	}
	if (!prevhash) return false;
	if (!Number.isInteger(index) || index < 0) return false;
	const reComputedHash = blockHash(JSON.stringify({
        index: block.index,
        prevhash: block.prevhash,
        data: block.data,
        timestamp: block.timestamp
    }));
	if (block.hash !== reComputedHash) return false;

	return true; //if all conditions are met
}
//the linkage between one block and its previous block is checked
function verifyChain(){
	const blocks = Blockchain.blocks;
	if (blocks.length < 2) return false; //at least two blocks are required to verify
	for (let i=1; i<blocks.length; i++)
	{
		const currentBlock = blocks[i];
	  	const previousBlock = blocks[i - 1];
		if (!verifyBlock(currentBlock)) return false;
		if (currentBlock.prevhash != previousBlock.hash) return false; //checking the linkage
	}
	return true;
}