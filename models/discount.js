const mongoose= require("mongoose")

const discount = mongoose.Schema({
    
   // reqDate: { type: String, required: true },
    type: {type:String, required: true},
    fromNoQty:{type: Number},
    toNoQty:{type:Number},
    discountPercentage:{type: Number},
    commissionPercentage:{type:Number},
    discountCode:{type:String, required: true},
    amount:{type:Number},
    updatedBy:{type:String},
    date:{type:String}
   
   
  });
  
  module.exports = mongoose.model("discount", discount);