const xlsx = require("xlsx");
const readline = require("readline-sync");
const { Blockchain, Transaction, Wallet } = require("./blockchain");

// Load Customer Data
const filePath = "./customer_data.xlsx";
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const customers = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// 🔄 Get Sender and Receiver Info
const senderUPI = readline.question("Enter your UPI ID: ").trim();
const receiverUPI = readline.question("Enter Receiver UPI ID from QR: ").trim();
const amount = parseFloat(readline.question("Enter Amount to Pay: ").trim());
const enteredPIN = parseInt(readline.question("Enter your PIN: ").trim());

// 🔍 Find Sender Customer Record
const senderCustomer = customers.find(row => row["UPI ID"] === senderUPI);

if (!senderCustomer) {
    console.log("❌ Error: Sender UPI ID not found. Transaction Failed.");
    process.exit(1);
}

// ✅ Check PIN
if (senderCustomer.PIN !== enteredPIN) {
    console.log("❌ Incorrect PIN. Transaction Failed.");
    process.exit(1);
}

// 💰 Check Balance
if (senderCustomer["Balance (₹)"] < amount) {
    console.log("❌ Insufficient Balance. Transaction Failed.");
    process.exit(1);
}

// 💸 Deduct Payment
senderCustomer["Balance (₹)"] -= amount;

console.log(`✅ Payment of ₹${amount} to ${receiverUPI} Successful!`);
console.log(`💰 Remaining Balance: ₹${senderCustomer["Balance (₹)"]}`);

// 📝 Update Excel File
const updatedSheet = xlsx.utils.json_to_sheet(customers);
const updatedWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(updatedWorkbook, updatedSheet, sheetName);
xlsx.writeFile(updatedWorkbook, filePath);
console.log("✅ Updated balance saved successfully.");

// 🔗 Store Transaction in Blockchain
const blockchain = new Blockchain();  // Load the existing blockchain from file
const senderWallet = new Wallet(senderUPI); // Sender's Wallet
const transaction = new Transaction(senderWallet.publicKey, receiverUPI, amount); // To receiver

// ✅ Sign with sender's key
transaction.signTransaction(senderWallet.keyPair);

try {
    blockchain.addTransaction(transaction);
    blockchain.minePendingTransactions(); // Mine the transactions

    console.log("✅ Blockchain updated!");
    console.log(JSON.stringify(blockchain, null, 4));  // Print the updated blockchain
} catch (error) {
    console.log("❌ Error storing transaction in blockchain:", error.message);
}






