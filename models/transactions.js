const mongoose= require("mongoose")

const Transactions = mongoose.Schema({
    
    date: {type:String, required: true},
    invoiceID:{type:String, required: true},
    userID:{type: String},
    b2bClient:{type:String},
    quantity:{type:Number},
    discountID:{type:String},
    paymentNumber:{type:String},
    amount:{type:Number},
    processedBy:{type:String},
  });
  
  module.exports = mongoose.model("transactions", Transactions);