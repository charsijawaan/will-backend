const mongoose= require("mongoose")

const Search = mongoose.Schema({

    log: {type:String, required: true},
    paymentStatus:{type: String, required: true},
    ambCode:{type:String},
    discountAmount:{type: Number},
    amountPaid:{type:Number, required: true},
    matchedID:{type:String, required: true},
    willRegNo:{type:String},
    nameOfWillOwner:{type:String},
    willOwnerPh:{type:String},
    willOwnerDob:{type:String},
    relationship:{type:String, required: true},
    reasons:{type:String, required: true},
    reqTitle:{type:String, required: true},
    reqFname: {type:String, required: true},
    reqMname: {type:String},
    reqLname: {type:String, required: true},
    reqAdd: {type:String, required: true},
    reqEmail: {type:String, required: true},
    reqPhNo: {type:String, required: true},
    reqAddLine1: {type:String, required: true},
    reqAddLine2: {type:String},
    reqTown: {type:String, required: true},
    reqCountry: {type:String, required: true},
    reqPostCode: {type:String, required: true},
    promotionCode: {type:String, required: true},
   reqSelfie: {type:String, required: true}
   
   
  });
  
  module.exports = mongoose.model("search", Search);