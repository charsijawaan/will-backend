const mongoose= require("mongoose")

const ProbateRegistry = mongoose.Schema({

    date: {type:String, required: true},
    matchedID:{type:String},
    willOwnerName:{type:String},
    willOwnerDOB:{type:String},
    willOwnerPhNo:{type:String},
    reqName: {type:String, required: true},
    reqEmail: {type:String, required: true},
    reqPhNo: {type:Number, required: true},
    relationship: {type:String, required: true},
    reasons: {type:String, required: true},
    promotionCode: {type:String, required: true},
    requesterSelfie: {type:String, required: true},
    discountApplied:{type:Number, required: true},
    amountPaid:{type:Number, required: true},
    willRefNo:{type:String}
   
   
  });
  
  module.exports = mongoose.model("ProbateRegistry", ProbateRegistry);