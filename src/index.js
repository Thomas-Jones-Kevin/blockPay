const { Blockchain } = require("./blockchain");

// Initialize blockchain
const blockchain = new Blockchain();

// Mine pending transactions
blockchain.minePendingTransactions();

console.log("✅ Blockchain updated!");
console.log(JSON.stringify(blockchain, null, 4));









