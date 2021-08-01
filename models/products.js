const mongoose= require("mongoose")

const products = mongoose.Schema({
    
    basePrice: { type: Number, required: true },
    name:{type: String, required: true},
    updatedBy:{type:String}
   
   
  });
  
  module.exports = mongoose.model("Products", products);