const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const UserModel = require("./models/Users");
const BudgetModel = require("./models/Budget");
const BarcodeModel = require("./models/Budget");
const TransactionModel = require("./models/Transaction");
const UserInfoModel = require("./models/Userinfo");
const BlockchainModel = require("./models/Blockchain");

const { Blockchain, Transaction, Wallet } = require("D:\\Sashi\\projects\\Project VI\\blockchain\\src\\blockchain.js");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/BlockPay");

// Get user info by email
app.post("/userInfo", async (req,res) => {
    const email = req.body.email;
    const mode = req.body.mode;

    console.log(mode);
    console.log(email);

    if(mode == "fetch"){
        const user = await UserInfoModel.findOne({email})
        
        if(user){
            res.status(200).json(user);
        }else{
            res.json("getInfo");
        }
    }else if(mode == "save"){
        console.log(req.body);
        const data = req.body;
        const user = await UserInfoModel.findOne({email});
        if(user){
            const updatedUser = await UserInfoModel.findOneAndUpdate(
                {email},
                {
                    name:data.name,
                    mobile:data.mobile,
                    walletAddress:data.walletAddress,
                    password:data.pass,
                    linkedUPI:data.linkedUPI,
                    emergencyContact:data.emergencyContact
                },
                {new:true}
            )
            console.log(updatedUser);
            res.json("updated");
        }else{
            await UserInfoModel.create({
                email,
                name:data.name,
                mobile:data.mobile,
                walletAddress:data.walletAddress,
                password:data.pass,
                linkedUPI:data.linkedUPI,
                emergencyContact:data.emergencyContact
            })
            res.json("saved");
        }
    }else if(mode == "addBalance"){
        const amount = req.body.amount;
        const balance = req.body.balance;
        console.log(amount,balance);

        const updateuser = await UserInfoModel.findOneAndUpdate(
            {email},
            {$set: {balance:balance+amount}},
            {new:true}
        );

        console.log(updateuser);
        res.status(200).json("added");

    }
})

// Multer config for image uploads
const upload = multer({ dest: "uploads/" });

app.post("/getAmt", async (req,res) => {
    const email = req.body.email;
    console.log(email);
    const user = await UserInfoModel.findOne({email});
    console.log(user);
    res.json(user.balance);
});

// Upload QR Image & Handle Transaction
app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image received" });
    }

    const imagePath = path.resolve(__dirname, req.file.path);
    console.log("Image received:", imagePath);

    const pythonProcess = spawn("python", ["D:\\Sashi\\projects\\Project VI\\IOT\\QRdecoder.py", imagePath], {
        cwd: __dirname,
    });

    let qrData = "";

    pythonProcess.stdout.on("data", (data) => {
        qrData += data.toString();
    });

    pythonProcess.stderr.on("data", (error) => {
        console.error("Python error:", error.toString());
    });

    pythonProcess.on("close", async (code) => {
        console.log(`Python script exited with code ${code}`);

        fs.unlink(imagePath, (err) => {
            if (err) console.error("Failed to delete image:", err);
        });

        qrData = qrData.trim();

        if (!qrData || qrData === "No QR code detected") {
            return res.status(400).json({ error: "No QR code detected" });
        }

        try {

            if (qrData.startsWith("upi://pay?")) {
                const queryString = qrData.split("?")[1];
                const params = new URLSearchParams(queryString);

                const receiverUPI = params.get("pa") || "Unknown";
                const receiverName = params.get("pn") || "Unknown";
                const amount = parseFloat(params.get("am")) || 1000;

                const senderUPI = "sashi@upi.co"; // 🔒 Replace with logged-in user dynamically
                const enteredPIN = 1234;

                const user = await UserInfoModel.findOne({ linkedUPI: senderUPI });
                if (!user) return res.status(404).json({ error: "Sender not found" });
                if (user.pin !== enteredPIN) return res.status(401).json({ error: "Incorrect PIN" });
                if (user.balance < amount) return res.status(400).json({ error: "Insufficient Balance" });

                user.balance -= amount;
                await user.save();

                const newTransaction = new TransactionModel({
                    sender: senderUPI,
                    receiver: receiverUPI,
                    amount,
                    qrData,
                    status: "success",
                });
                await newTransaction.save();

                const blockchain = new Blockchain();
                await blockchain.initialize();

                const senderWallet = new Wallet(senderUPI);
                const transaction = new Transaction(senderWallet.publicKey, receiverUPI, amount);
                transaction.signTransaction(senderWallet.keyPair);

                try {
                    blockchain.addTransaction(transaction);
                    await blockchain.minePendingTransactions(); // Now saves to DB + file
                } catch (error) {
                    console.error("❌ Blockchain error:", error.message);
                }

                return res.status(201).json({
                    message: "QR Code scanned & Transaction successful",
                    qrData,
                    transaction: newTransaction,
                    remainingBalance: user.balance,
                });
            }

            return res.status(201).json({
                message: "QR Code saved",
                data: qrData,
            });

        } catch (err) {
            console.error("❌ Error processing QR:", err);
            res.status(500).json({ error: "Failed to process QR data" });
        }
    });
});


// Fetch all transactions
app.post("/transactions", async (req, res) => {
    try {
        console.log(req.body.email);
        const email = req.body.email;

        const user = await UserInfoModel.findOne({email});
        const name = user.linkedUPI;

        const transactions = await TransactionModel.find({sender:name}).sort({ timestamp: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// Login
app.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            if (user.pass === pass) {
                res.status(200).json({ message: "Login successful" });
            } else {
                res.status(401).json({ message: "Invalid password" });
            }
        } else {
            res.status(404).json({ message: "User not found. Please sign up." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred during login" });
    }
});


// Signup
app.post("/signup", async (req, res) => {
    try {
        const { name, email, pass } = req.body;
        const newUser = new UserModel({ name, email, pass });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

app.post("/getBudget", async(req,res) => {
    const email = req.body.email;
    console.log(email);

    const budmodel = await BudgetModel.findOne({email});
    res.status(200).json(budmodel.amount);
})

app.post("/saveBudget", async(req,res) => {
    const email = req.body.email;
    const budget = req.body.budget;
    console.log(email);
    console.log(budget);

    let budmodel = await BudgetModel.findOne({email});
    if (!budmodel) {
        // If not found, create a new document
        budmodel = new BudgetModel({ email, amount: budget });
      } else {
        // Update existing budget
        budmodel.amount = budget;
      }
    await budmodel.save();
    res.status(200).json("budget updated");
     
});

app.post("/spent", async (req,res) => {
    const email = req.body.email;
    console.log(email);

    const user = await UserInfoModel.findOne({email});
    let spent = 0;

    const Transactions = await TransactionModel.find({sender:user.linkedUPI});

    for(let i=0;i<Transactions.length;i++){
        spent += Transactions[i].amount;
    }

    console.log(spent);
    res.status(200).json({spent});
})

app.post("/blockchain", async (req, res) => {
    console.log("🚀 POST /blockchain route hit");
  
    try {
      const chainData = await BlockchainModel.findOne();
      console.log("📦 Blockchain data fetched from DB:", chainData);
  
      if (!chainData) {
        console.log("❌ Blockchain not found in DB");
        return res.status(404).json({ error: "Blockchain not found" });
      }
  
      res.status(200).json(chainData);
    } catch (err) {
      console.error("🔥 Error fetching blockchain:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
