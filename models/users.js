const mongoose = require("mongoose");

const user = mongoose.Schema({
  
  type: {type:String, required: true},
  name:{type:String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  selfie :{type: String, required: true},
  phoneNo:{type:String, required: true, unique: true},
  add1:{type:String, required: true},
  add2:{type:String},
  town:{type:String, required: true},
  country:{type: String, required: true},
  isAdmin:{type:Boolean, required: true},
  status:{type:String},
  code:{type:String},
  lastUpdatedBy:{type:String},
  lastUpdateDate:{type:String},
  activeWillID:{type:String},
});

module.exports = mongoose.model("Users", user);
