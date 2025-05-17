const { Blockchain, Transaction } = require("./blockchain");
const { verifyPIN } = require("./pin_verification");
const prompt = require("prompt-sync")();

let tomc = new Blockchain();

function processTransaction(fromAddr, toAddr, amount) {
    let userPIN = "1234"; // Set a dummy PIN (Replace with real PIN storage)
    console.log(`Transaction Request: Send ₹${amount} to ${toAddr}`);

    if (verifyPIN(userPIN)) {
        let tx = new Transaction(fromAddr, toAddr, amount);
        tomc.addTransaction(tx);
        console.log("✅ Transaction Added to Blockchain!");
        tomc.minePendingTransactions();
        console.log("Transaction successfully stored in blockchain.");
    } else {
        console.log("❌ Transaction Canceled.");
    }
}

module.exports = { processTransaction };
