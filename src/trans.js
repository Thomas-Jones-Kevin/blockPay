const { Blockchain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

// 🔹 Replace with your real private key (Generated once)
const myKey = ec.keyFromPrivate("e54c6d1e4751869960c46c449f884d240e99b6ca731aa97992a1f10334bcb61c"); 
const myWalletAddress = myKey.getPublic("hex");

const blockchain = new Blockchain();

// Transaction details
const recipient = "steve@bank";
const amount = 500;

// Create and sign the transaction
const tx = new Transaction(myWalletAddress, recipient, amount);
tx.signTransaction(myKey);

// Add transaction to blockchain
blockchain.addTransaction(tx);

// Mine transactions
blockchain.minePendingTransactions();

console.log("✅ Transaction added successfully!");


