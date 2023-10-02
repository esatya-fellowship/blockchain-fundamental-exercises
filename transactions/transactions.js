"use strict";

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const openpgp = require("openpgp");

const KEYS_DIR = path.join(__dirname, "keys");
const PRIV_KEY_TEXT = fs.readFileSync(
  path.join(KEYS_DIR, "priv.pgp.key"),
  "utf8"
);
const PUB_KEY_TEXT = fs.readFileSync(
  path.join(KEYS_DIR, "pub.pgp.key"),
  "utf8"
);

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

addPoem().then(checkPoem).catch(console.log);

// **********************************

async function addPoem() {
  const transactions = [];

  for (let line of poem) {
    const transaction = createTransaction(line);
    await authorizeTransaction(transaction);
    transactions.push(transaction);
  }

  const block = createBlock(transactions);
  Blockchain.blocks.push(block);

  return Blockchain;
}

async function checkPoem(chain) {
  console.log(await verifyChain(chain));
}

function createTransaction(data) {
  const transaction = {
    data,
    hash: transactionHash(data),
  };
  return transaction;
}

async function authorizeTransaction(transaction) {
  transaction.pubKey = PUB_KEY_TEXT;
  transaction.signature = await createSignature(
    JSON.stringify(transaction),
    PRIV_KEY_TEXT
  );
}

function createBlock(data) {
  const block = {
    index: Blockchain.blocks.length,
    prevHash: Blockchain.blocks[Blockchain.blocks.length - 1].hash,
    data,
    timestamp: Date.now(),
  };
  block.hash = blockHash(block);
  return block;
}

function transactionHash(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

async function createSignature(text, privKey) {
  const privKeyObj = openpgp.key.readArmored(privKey).keys[0];
  const options = {
    data: text,
    privateKeys: [privKeyObj],
  };
  return (await openpgp.sign(options)).data;
}

async function verifySignature(signature, pubKey) {
  try {
    const pubKeyObj = openpgp.key.readArmored(pubKey).keys[0];
    const options = {
      message: openpgp.cleartext.readArmored(signature),
      publicKeys: pubKeyObj,
    };
    return (await openpgp.verify(options)).signatures[0].valid;
  } catch (err) {}
  return false;
}

function blockHash(bl) {
  return crypto
    .createHash("sha256")
    .update(
      `${bl.index};${bl.prevHash};${JSON.stringify(bl.data)};${bl.timestamp}`
    )
    .digest("hex");
}

async function verifyTransaction(transaction) {
  if (!transaction.data || !transaction.pubKey || !transaction.signature) {
    return false;
  }

  const calculatedHash = transactionHash(transaction.data);
  if (transaction.hash !== calculatedHash) {
    return false;
  }

  const isValidSignature = await verifySignature(
    transaction.signature,
    transaction.pubKey
  );
  return isValidSignature;
}

async function verifyBlock(bl) {
  if (bl.data == null) return false;
  if (bl.index === 0) {
    if (bl.hash !== "000000") return false;
  } else {
    if (!bl.prevHash) return false;
    if (
      !(
        typeof bl.index === "number" &&
        Number.isInteger(bl.index) &&
        bl.index > 0
      )
    ) {
      return false;
    }
    if (bl.hash !== blockHash(bl)) return false;
    if (!Array.isArray(bl.data)) return false;

    for (let transaction of bl.data) {
      if (!(await verifyTransaction(transaction))) {
        return false;
      }
    }
  }

  return true;
}

async function verifyChain(chain) {
  let prevHash;
  for (let bl of chain.blocks) {
    if (prevHash && bl.prevHash !== prevHash) return false;
    if (!(await verifyBlock(bl))) return false;
    prevHash = bl.hash;
  }

  return true;
}
