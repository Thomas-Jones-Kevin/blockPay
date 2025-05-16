const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    email: { type: String, required: true },
});

const BudgetModel = mongoose.model("Budget", BudgetSchema);
module.exports = BudgetModel;
