const mongoose= require("mongoose")

const Sales = mongoose.Schema({
    
  
    salesID: {type:String, required: true},
    productName:{type: String},
    date:{type:String},
    amount:{type: Number},
    transactionID:{type:Number},
    promoCode:{Type:String},
    userID:{type:String}
   
  });
  
  module.exports = mongoose.model("sales", Sales);