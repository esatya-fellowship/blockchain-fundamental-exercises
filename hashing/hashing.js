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

function createBlock(data){
	data.forEach((element,index)=>{
		const dataOfSingleBlock={
			index:Blockchain.blocks[index] + 1,
			data:element,
			timestamp:Date.now(),
			prevHash:Blockchain.blocks[index].hash,
		}
		
		let hash=blockHash(JSON.stringify(dataOfSingleBlock))
		dataOfSingleBlock.hash=hash;
		Blockchain.blocks.push(dataOfSingleBlock)
	})
}


	

function verifyBlock(block){
	let {index,data,prevHash,hash}=block;
	delete block.hash

	if(!data || !prevHash ) return false;
	if (index<0 || (index===0 && hash!="000000") ) return false;
	if(hash!=blockHash(JSON.stringify(block))) return false;
	return true;
}


function verifyChain(){
	const blocks=Blockchain.blocks;
	if(blocks.length < 2 ) return false;
	for(let i=1;i<blocks.length;i++){
		const currentBlock=blocks[i]
		const previousBlock=blocks[i-1];
		if(currentBlock.prevHash != previousBlock.hash) return false;
		return verifyBlock(currentBlock);
	}
}

createBlock(poem);
console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);


// **********************************

function blockHash(bl) {
	return crypto.createHash("sha256").update(
		bl
	).digest("hex");
}
