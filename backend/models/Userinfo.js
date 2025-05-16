const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  mobile: String,
  walletAddress: String,
  balance: {
    type: Number,
    default: 0,  
  },
  password: String,
  linkedUPI: String,
  emergencyContact: String,
});

const UserInfoModel = mongoose.model("UserInfo",userInfoSchema);
module.exports = UserInfoModel;


