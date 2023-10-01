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
//each line would be a block of data , say block having index of 1 after genesis has "The power of a gun can kill", and next one having index of 2 has "and the power of fire can burn",
//loops the poem , first creates a block and notifes if block has been added. 
 for (let line of poem) {
 const newBlock = createBlock(line);
 Blockchain.Blocks.push(newBlock);
 //Concept of push in a stack 
 console.log(`A new block has been added:`);
 }

 console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);


// **********************************


function createBlock(data){
//get previous block
const previousBlock = Blockchain.Blocks[Blockchain.Blocks.length-1];

//create new block
const newBlock={
index:Blockchain.Blocks.length,
prevHash:previousBlock.hash,
data:data,
timestamp:Date.now(),
hash:blockHash(newBlock),
};
return newBlock;
}

function verifyChain(Blockchain){
for(let i=0 ; i<Blockchain.Blocks.length; i++){
const Block = Blockchain.Blocks[i];

//data must be non-empty
if(Block.data === " "){
return false;
}

//for the genesis block only, the hash must be "000000"
if(Block.index === 0 && Block.hash !== "000000"){
return false;
}

//prevHash must be non-empty
if(Block.prevHash === " "){
return false;
}

//index must be an integer >= 0
//since it's must be we do isn't 
if(!Number.isinteger(Block.index) || Block.index<0){
return false;
}


// still to be completed and checked.

//the hash must match what recomputing the hash with blockHash(..) produces

}



function blockHash(bl) {
	return crypto.createHash("sha256").update(
		// TODO: use block data to calculate hash
	).digest("hex");
}
