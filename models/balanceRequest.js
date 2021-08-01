const mongoose = require("mongoose");

const balanceRequest = mongoose.Schema({
    balanceReqID: { type: String },
    reqDate: { type: String, required: true },
    reqStatus: { type: String, required: true },
    userName: { type: String },
    userType: { type: String },
    bankName: { type: String },
    bankAccountName: { type: String },
    bankAccNo: { type: String },
    commissionBalance: { type: Number },
    refNo: { type: String },
    clearedBy: { type: String },
    dateOfClearance: { type: String },
});

module.exports = mongoose.model("balanceRequest", balanceRequest);
