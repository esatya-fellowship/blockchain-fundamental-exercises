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
	prevhash:"",
	data: "",
	timestamp: Date.now(),
});



// TODO: insert each line into blockchain
async function createBlocks() {
    for (let i = 0; i < poem.length; i++) {
        const generatedHash = blockHash(poem[i], i);
        Blockchain.blocks.push({
            index: i + 1,
			prevhash:Blockchain.blocks[i].hash,
            hash: generatedHash,
            data: poem[i],
            timestamp: Date.now(),
        });

        await new Promise(resolve => setTimeout(resolve, 100)); 
    }
}

createBlocks().then(() => {
    //console.log("Blockchain:", JSON.stringify(Blockchain, null, 2)); ----> correct
	console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);

});




// **********************************

function blockHash(bl, num) {
	const dataToHash = JSON.stringify(bl) + Blockchain.blocks[num].hash;
	console.log("Data To Hash=",dataToHash); 

	return crypto.createHash("sha256").update(
		dataToHash
	).digest("hex");
}

function blocks() {
	for (var i = 0; i < poem.length; i++) {
		console.log(`${i} block = `, Blockchain.blocks[i])
	}

}

function verifyChain(Blockchain){
	const length= Blockchain.blocks.length;
	//console.log(length); ----> 9
	var verification = true;
	var i = 1;
	while(i<=length-1){

		console.log(Blockchain.blocks[i-1].hash,' ',Blockchain.blocks[i].prevhash);

		if (Blockchain.blocks[i-1].hash===Blockchain.blocks[i].prevhash){
			i++;
		}
		else{
			verification=false;
			break;
		}
	}
	if (verification){
		return "The Blockchain is correct";
	}
	else{
		return "The Blockchain is not correct"
	}
}