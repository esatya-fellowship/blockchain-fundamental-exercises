"use strict";

const crypto = require("crypto");

// The Power of a Smile
// by Tupac Shakur
const poem = [
  "The power of a gun can kill",
  "and the power of fire can burn",
  "the power of wind can chill",
  "and the power of a mind can learn",
  "the power of anger can rage",
  "inside until it tears u apart",
  "but the power of a smile",
  "especially yours can heal a frozen heart",
];

const Blockchain = {
  blocks: [],
};

// Genesis block
Blockchain.blocks.push({
  index: 0,
  prevHash: "000000",
  data: "",
  timestamp: Date.now(),
  hash: blockHash({
    index: 0,
    prevHash: "000000",
    data: "",
    timestamp: Date.now(),
  }),
});

// Define a function to calculate the hash for a block
function blockHash(block) {
  const { index, prevHash, data, timestamp } = block;
  const dataString = JSON.stringify(data);
  return crypto
    .createHash("sha256")
    .update(index + prevHash + dataString + timestamp)
    .digest("hex");
}

// Define a function to create a new block and add it to the blockchain
function createBlock(data) {
  const prevBlock = Blockchain.blocks[Blockchain.blocks.length - 1];
  const newIndex = prevBlock.index + 1;
  const newTimestamp = Date.now();
  const newHash = blockHash({
    index: newIndex,
    prevHash: prevBlock.hash,
    data,
    timestamp: newTimestamp,
  });

  const newBlock = {
    index: newIndex,
    prevHash: prevBlock.hash,
    data,
    timestamp: newTimestamp,
    hash: newHash,
  };

  Blockchain.blocks.push(newBlock);
  return newBlock;
}

// Define a function to verify a single block
function verifyBlock(block) {
  const { index, prevHash, data, timestamp, hash } = block;
  const dataString = JSON.stringify(data);
  return (
    dataString.length > 0 &&
    (index === 0 ? hash === "000000" : true) &&
    prevHash.length > 0 &&
    Number.isInteger(index) &&
    index >= 0 &&
    hash === blockHash({ index, prevHash, data, timestamp })
  );
}

// Define a function to verify the entire blockchain
function verifyChain(chain) {
  for (let i = 0; i < chain.blocks.length; i++) {
    if (!verifyBlock(chain.blocks[i])) {
      return false;
    }
    if (i > 0 && chain.blocks[i].prevHash !== chain.blocks[i - 1].hash) {
      return false;
    }
  }
  return true;
}

// Create blocks for each line of the poem and add them to the blockchain
for (let line of poem) {
  createBlock(line);
}

// Verify the blockchain
const isBlockchainValid = verifyChain(Blockchain);

console.log(Blockchain.blocks);
console.log(`Blockchain is valid: ${isBlockchainValid}`);
