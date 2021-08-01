const mongoose= require("mongoose")

const regDoc = mongoose.Schema({

   activeWillId : {type: String},
   docDate: {type: String},
   docName:{type:String,required: true},
   docType:{type:String, required: true},
   docNo:{type: String, required: true},
   docDesc:{type:String, required: true},
   docLoc:{type:String, required: true},
   issuer:{type:String, required: true}
   
  });
  
module.exports = mongoose.model("RegDoc", regDoc);