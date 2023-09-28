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

// **********************************

let prevHashPointer = Blockchain.blocks[0].hash;

// Function to create block
function createBlock(message) {
  // creating block obj
  const block = {
    index: Blockchain.blocks.length,
    prevHash: prevHashPointer,
    data: message,
    timestamp: Date.now(),
  };

  // creating block hash and assigning it to hash property
  const blockWithHash = {
    ...block,
    hash: blockHash(block),
  };

  // updating prevHash pointer
  prevHashPointer = blockWithHash.hash;

  return blockWithHash;
}

// Function to create hash of a block
function blockHash(bl) {
  let concatenatedString = "";
  // creating concatenated string
  for (const key in bl) {
    concatenatedString += bl[key];
  }
  return crypto.createHash("sha256").update(concatenatedString).digest("hex");
}

// Function to verify the Blockchain
function verifyChain(blocks) {
  for (let index = 0; index < blocks.length; index++) {
    const result = !verifyBlock(blocks[index], index, blocks);
    if (result) {
      return false;
    }
  }
  return true;
}

// Function to verify each block
function verifyBlock(eachBlock, index, blocks) {
  const { hash, ...block } = eachBlock;

  if (block.index === 0) {
    return hash === "000000";
  }

  if (
    block.prevHash === "" ||
    block.data.trim().length === 0 ||
    block.index < 0
  ) {
    return false;
  }

  const newHash = blockHash(block);
  if (newHash !== hash) {
    return false;
  }

  if (blocks[index + 1] !== undefined) {
    if (hash !== blocks[index + 1].prevHash) return false;
  }
  return true;
}

for (let line of poem) {
  // creating block
  let newBlock = createBlock(line);
  // inserting new block into blocks array
  Blockchain.blocks.push(newBlock);
}

console.log(`Blockchain is valid: ${verifyChain(Blockchain.blocks)}`);
