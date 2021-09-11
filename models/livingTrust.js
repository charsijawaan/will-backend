const mongoose= require("mongoose")

const LivingTrust = mongoose.Schema({},{ strict: false, timestamps: true });
  
module.exports = mongoose.model("livingtrust", LivingTrust);