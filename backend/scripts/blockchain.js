const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
    constructor(fromAddr, toAddr, amount) {
        this.fromAddr = fromAddr;
        this.toAddr = toAddr;
        this.amount = amount;
        this.signature = null;
    }

    calculateHash() {
        return SHA256(this.fromAddr + this.toAddr + this.amount).toString();
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic("hex") !== this.fromAddr) {
            throw new Error("You cannot sign transactions for other wallets");
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, "base64");
        this.signature = sig.toDER("hex");
    }

    isValid() {
        if (this.fromAddr === null) {
            return true; // Mining rewards transactions
        }
        if (!this.signature || this.signature.length === 0) {
            throw new Error("No signature in this transaction");
        }
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
        console.log("Block Mined: " + this.hash);
    }

    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("20/03/2025", [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        // Create a new block with all pending transactions
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        
        // Mine the block
        block.mineBlock(this.difficulty);
        
        console.log("Block successfully mined!");
        
        // Add the mined block to the blockchain
        this.chain.push(block);
    
        // ✅ Ensure the miner gets the reward *before* resetting pending transactions
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions = [rewardTx];
    }
    

    addTransaction(transaction) {
        if (!transaction.fromAddr || !transaction.toAddr) {
            throw new Error("Transaction must include from and to addresses");
        }
        if (!transaction.isValid()) {
            throw new Error("Cannot add invalid transactions to the chain");
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddr === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddr === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;


