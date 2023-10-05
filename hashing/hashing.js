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

function createBlock(TextData) {
  let chainLength = Blockchain.blocks.length;

  Blockchain.blocks.push({
    index: chainLength,
    prevHash: Blockchain.blocks[chainLength - 1].hash,
    data: TextData,
    timestamp: Date.now(),
    hash: blockHash(
      JSON.stringify({
        index: chainLength,
        prevHash: Blockchain.blocks[chainLength - 1].hash,
        data: TextData,
        timestamp: Date.now(),
      })
    ),
  });
}
function createChain(Data) {
  for (let i = 0; i < Data.length; i++) {
    createBlock(Data[i]);
  }
}
createChain(poem);
console.log(Blockchain);

function blockHash(bl) {
  return crypto.createHash("sha256").update(bl).digest("hex");
}

function verifyBlock(block) {
  // Verify Genesis block
  if (block.index === 0) {
    return block.hash === "000000";
  }

  // Verify regular blocks
  const expectedHash = blockHash(
    JSON.stringify({
      index: block.index,
      prevHash: block.prevHash,
      data: block.data,
      timestamp: block.timestamp,
    })
  );

  return block.hash === expectedHash;
}

console.log(verifyBlock(Blockchain.blocks[1]));

function verifyChain(Chain) {
  for (let i = 0; i < Chain.blocks.length; i++) {
    const block = Chain.blocks[i];
    if (!verifyBlock(block)) {
      console.log(`Chain is invalid at block ${i}`);
      return false;
    }
  }
  console.log("The chain is valid");
  return true;
}

verifyChain(Blockchain);
