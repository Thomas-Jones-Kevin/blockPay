const express = require("express");
const bodyParser = require("body-parser");
const {Blockchain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const app = express();
app.use(bodyParser.json());

// Blockchain instance
let tomc = new Blockchain();

// Generate a wallet for mining
const myKey = ec.keyFromPrivate("f1d495be5f5861a02116b69fe558a6f9d0d154b90c199b38fdf27b04f65ee0a1");
const myWalletAddress = myKey.getPublic("hex");

// ✅ API: Create a transaction from the IoT device
app.post("/transaction", (req, res) => {
    const { fromAddr, toAddr, amount, privateKey } = req.body;

    if (!fromAddr || !toAddr || !amount || !privateKey) {
        return res.status(400).send("Missing transaction details");
    }

    try {
        const key = ec.keyFromPrivate(privateKey);
        const tx = new Transaction(fromAddr, toAddr, amount);
        tx.signTransaction(key);
        tomc.addTransaction(tx);

        // Auto-mine the transaction
        console.log("\nMining transaction...");
        tomc.minePendingTransactions(myWalletAddress);

        res.send("Transaction added & mined successfully!");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// ✅ API: Get balance of a wallet
app.get("/balance/:address", (req, res) => {
    const balance = tomc.getBalanceOfAddr(req.params.address);
    res.send(`Balance: ${balance}`);
});

// ✅ API: Get full blockchain
app.get("/blockchain", (req, res) => {
    res.json(tomc);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
