const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    qrData: { type: String, required: true },
    status: { type: String, default: "success" }, // could also be "pending" or "failed"
});

const TransactionModel = mongoose.model("Transaction", TransactionSchema);
module.exports = TransactionModel;
