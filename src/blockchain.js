const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const fs = require("fs");
const mongoose = require("mongoose");
const ec = new EC("secp256k1");

const BlockchainModel = require("D:\\Sashi\\projects\\Project VI\\website\\backend\\models\\Blockchain.js"); // MongoDB model

const path = "./blockchain.json"; // Local file for backup

class Transaction {
    constructor(fromAddr, toAddr, amount) {
        this.fromAddr = fromAddr;
        this.toAddr = toAddr;
        this.amount = amount;
        this.timestamp = Date.now();
        this.signature = null;
    }

    calculateHash() {
        return SHA256(this.fromAddr + this.toAddr + this.amount + this.timestamp).toString();
    }

    signTransaction(signingKey) {
        if (!signingKey || !signingKey.getPublic) {
            throw new Error("Invalid signing key!");
        }

        if (signingKey.getPublic("hex") !== this.fromAddr) {
            throw new Error("You cannot sign transactions for other wallets!");
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, "base64");
        this.signature = sig.toDER("hex");
    }

    isValid() {
        if (this.fromAddr === "System") return true;
        if (!this.signature) throw new Error("Transaction not signed");
        const publicKey = ec.keyFromPublic(this.fromAddr, "hex");
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = "") {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`✅ Block Mined: ${this.hash}`);
    }

    hasValidTransactions() {
        return this.transactions.every(tx => tx.isValid());
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 2;
        this.pendingTransactions = [];
    }

    async initialize() {
        const savedChain = await BlockchainModel.findOne();
        if (savedChain) {
            this.chain = savedChain.chain;
            this.difficulty = savedChain.difficulty || 2;
        } else {
            const genesisBlock = this.createGenesisBlock();
            this.chain = [genesisBlock];
            await this.saveBlockchain();
        }
    }

    createGenesisBlock() {
        return new Block("20/03/2025", [new Transaction("System", "admin@bank", 10000)], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        if (!transaction.isValid()) {
            throw new Error("Invalid transaction!");
        }
        this.pendingTransactions.push(transaction);
    }

    async minePendingTransactions() {
        if (this.pendingTransactions.length === 0) {
            console.log("❌ No transactions to mine");
            return;
        }

        const block = new Block(Date.now(), [...this.pendingTransactions], this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        this.chain.push(block);
        this.pendingTransactions = [];

        await this.saveBlockchain();
        this.saveToFile();
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const curr = this.chain[i];
            const prev = this.chain[i - 1];

            if (!curr.hasValidTransactions() || curr.hash !== curr.calculateHash() || curr.previousHash !== prev.hash) {
                return false;
            }
        }
        return true;
    }

    async saveBlockchain() {
        await BlockchainModel.findOneAndUpdate(
            {},
            { chain: this.chain, difficulty: this.difficulty },
            { upsert: true, new: true }
        );
        console.log("📦 Blockchain saved to MongoDB");
    }

    saveToFile() {
        const data = {
            chain: this.chain,
            difficulty: this.difficulty,
        };
        fs.writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");
        console.log("🗂️ Blockchain backup saved to file");
    }
}

class Wallet {
    constructor(upiID) {
        this.keyPair = ec.genKeyPair();
        this.privateKey = this.keyPair.getPrivate("hex");
        this.publicKey = this.keyPair.getPublic("hex");
        this.upiID = upiID;
    }
}

module.exports = { Blockchain, Transaction, Wallet };
