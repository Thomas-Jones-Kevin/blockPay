const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    fromAddr: String,
    toAddr: String,
    amount: Number,
    timestamp: Number,
    signature: String,
}, { _id: false });

const blockSchema = new mongoose.Schema({
    timestamp: Number,
    transactions: [transactionSchema],
    previousHash: String,
    hash: String,
    nonce: Number,
}, { _id: false });

const blockchainSchema = new mongoose.Schema({
    chain: [blockSchema],
    difficulty: Number,
}, { timestamps: true });

const BlockchainModel = mongoose.model("Blockchain", blockchainSchema);
module.exports = BlockchainModel;
