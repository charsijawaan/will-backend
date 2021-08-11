const mongoose = require("mongoose");

const Codicil = mongoose.Schema({},{ strict: false, timestamps: true });

module.exports = mongoose.model("codicil", Codicil);
