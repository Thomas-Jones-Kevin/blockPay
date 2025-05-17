const prompt = require("prompt-sync")();

function verifyPIN(correctPIN) {
    let enteredPIN = prompt("Enter your PIN: ");
    if (enteredPIN === correctPIN) {
        console.log("✅ PIN Verified!");
        return true;
    } else {
        console.log("❌ Incorrect PIN. Transaction Failed.");
        return false;
    }
}

module.exports = { verifyPIN };
