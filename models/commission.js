const mongoose= require("mongoose")

const Commission = mongoose.Schema({
    
    date: { type: String, required: true },
    userID:{type: String},
    userName:{type:String},
    balanceReq : {type:String},
    commissionEarned:{type:Number},
    commissionBalance:{type:Number},
    willAmbID :{type:String},
    commissionStatus:{type:String},
    productName:{type:String},
    salesID:{type:String}
   
   
  });
  
  module.exports = mongoose.model("commission", Commission);