const mongoose= require("mongoose")

const Invoice = mongoose.Schema({
    
    date: {type:String, required: true},
    invoiceID:{type: String},
    b2bClient:{type:String},
    quantity:{type: Number},
    amount:{type:Number},
    processedBy:{type:String},
    status:{type:String},
    paymentID:{type:String},
    voucherCode:{type:String}
   
   
  });
  
  module.exports = mongoose.model("invoice", Invoice);