const { Blockchain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

// Generate a key pair
const myKey = ec.keyFromPrivate("f1d495be5f5861a02116b69fe558a6f9d0d154b90c199b38fdf27b04f65ee0a1");
const myWalletAddress = myKey.getPublic("hex");

// Create a new blockchain instance
let tomc = new Blockchain();

// Creating and signing a transaction
console.log("\nCreating a transaction...");
const tx1 = new Transaction(myWalletAddress, "receiver-public-key", 10);
tx1.signTransaction(myKey);
tomc.addTransaction(tx1);

// ✅ First mine: This mines the first transaction
console.log("\nStarting the mining process...");
tomc.minePendingTransactions(myWalletAddress);

// ✅ Second mine: This mines the reward for the miner
console.log("\nMining the reward...");
tomc.minePendingTransactions(myWalletAddress);

// Checking balance
console.log("\nTom's Balance:", tomc.getBalanceOfAddress(myWalletAddress));





