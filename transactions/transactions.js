"use strict";

var path = require("path");
var fs = require("fs");
var crypto = require("crypto");
var openpgp = require("openpgp");

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

addPoem()
  .then(() => checkPoem(Blockchain))
  .catch((e) => console.log("error:: ", e));

// **********************************

async function addPoem() {
  var transactions = [];

  // TODO: add poem lines as authorized transactions
  for (let line of poem) {
    // create and authorize transaction object
    const tar = createTransaction(line);
    const authTar = await authorizeTransaction(tar);

    // store it in the transactions array
    transactions.push(authTar);
  }

  let bl = createBlock(transactions);

  Blockchain.blocks.push(bl);

  return Blockchain;
}

function createTransaction(line) {
  // create transaction object
  // transaction object should have data
  let transaction = {
    data: line,
    hash: "",
  };
  // transaction need a hash field with value returned
  // from transactionHash()

  return {
    ...transaction,
    hash: transactionHash(transaction),
  };
}

async function authorizeTransaction(transaction) {
  // add pubKey field with public text to transaction obj
  // add signature field with the signature created by
  // createSignature()
  let newTransaction = {
    ...transaction,
    pubKey: PUB_KEY_TEXT,
    signature: await createSignature(transaction.data, PRIV_KEY_TEXT),
  };

  return newTransaction;
}

async function checkPoem(chain) {
  console.log(await verifyChain(chain));
}

function createBlock(data) {
  var bl = {
    index: Blockchain.blocks.length,
    prevHash: Blockchain.blocks[Blockchain.blocks.length - 1].hash,
    data,
    timestamp: Date.now(),
  };

  bl.hash = blockHash(bl);

  return bl;
}

function transactionHash(tr) {
  return crypto
    .createHash("sha256")
    .update(`${JSON.stringify(tr.data)}`)
    .digest("hex");
}

async function createSignature(text, privKey) {
  var privKeyObj = openpgp.key.readArmored(privKey).keys[0];

  var options = {
    data: text,
    privateKeys: [privKeyObj],
  };
  return (await openpgp.sign(options)).data;
}

async function verifySignature(signature, pubKey) {
  try {
    let pubKeyObj = openpgp.key.readArmored(pubKey).keys[0];

    let options = {
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

    // TODO: verify transactions in block
    // verifyTransaction(bl);
    return await verifyTransaction(bl);
  }

  return true;
}

async function verifyTransaction(block) {
  for (let transaction of block.data) {
    // hash should match transactionHash()
    if (transaction.hash !== transactionHash(transaction)) return false;
    // should include pubKey and signature
    if (!transaction.pubKey || !transaction.signature) return false;
    // signature should verify correctly with verifySignature
    return await verifySignature(transaction.signature, PUB_KEY_TEXT);
  }
}

async function verifyChain(chain) {
  var prevHash;
  for (let bl of chain.blocks) {
    if (prevHash && bl.prevHash !== prevHash) return false;
    if (!(await verifyBlock(bl))) return false;
    prevHash = bl.hash;
  }

  return true;
}
