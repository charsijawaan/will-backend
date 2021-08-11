const mongoose = require("mongoose");

const WillCreation = mongoose.Schema({},{ strict: false, timestamps: true });

module.exports = mongoose.model("willcreation", WillCreation);
