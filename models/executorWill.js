const mongoose= require("mongoose")

const ExecWill = mongoose.Schema({

    date: {type:String, required: true},
    matchedID:{type:String},
    willOwnerName:{type:String},
    willOwnerDOB:{type:String},
    willOwnerPhNo:{type:String},
    execName: {type:String, required: true},
    execEmail: {type:String, required: true},
    execPhNo: {type:Number, required: true},
    relationship: {type:String, required: true},
    reasons: {type:String, required: true},
    promotionCode: {type:String, required: true},
    requesterSelfie: {type:String, required: true},
    discountApplied:{type:Number, required: true},
    amountPaid:{type:Number, required: true},
    willRefNo:{type:String}
   
   
  });
  
  module.exports = mongoose.model("execWill", ExecWill);