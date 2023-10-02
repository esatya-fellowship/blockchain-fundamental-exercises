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
// for (let line of poem) {
// }

// console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);
const createHash = (line) => {
  // assignment of variables of length, previousHash, data, time stamp and hash
  const length = Blockchain.blocks.length;
  const prevHash = Blockchain.blocks[length - 1].hash;
  const data = line;
  const timestamp = Date.now();
  const hash = blockHash(length, prevHash, data, timestamp);

  const block = {
    index: length,
    prevHash,
    data,
    timestamp,
    hash,
  };

  //   pushing above created object of block
  Blockchain.blocks.push(block);

  return block;
};

poem.forEach((line) => {
  createHash(line);
});

console.log("Blockchain check", Blockchain.blocks);

// **********************************

// modifying below function to match arguments
function blockHash(index, prevHash, data, timestamp) {
  const sum = index + prevHash + data + timestamp;
  return crypto
    .createHash("sha256")
    .update(
      // TODO: use block data to calculate hash
      sum
    )
    .digest("hex");
}

const verifyBlock = (block, index) => {
  if (!block) {
    return false;
  }

  if (index === 0) {
    return true;
  }

  if (index > 0) {
    const prevBlock = Blockchain.blocks[index - 1];

    if (prevBlock.hash !== block.prevHash) {
      return false;
    }
  }

  const calculatedHash = blockHash(
    index,
    block.prevHash,
    block.data,
    block.timestamp
  );

  if (block.hash !== calculatedHash) {
    return false;
  }

  return true;
};

const verifyChain = (Blockchain) => {
  for (let index = 0; index < Blockchain.blocks.length; index++) {
    if (!verifyBlock(Blockchain.blocks[index], index)) {
      return false;
    }
  }

  return true;
};

console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);

// verifyChain(Blockchain);
