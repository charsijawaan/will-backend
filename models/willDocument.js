const mongoose = require("mongoose");

const WillDocument = mongoose.Schema(
    {
        willID: { type: String },
        originalDocumentName: { type: String },
        newDocumentName: { type: String },
        name: { type: String },
        type: { type: String },
        desc: { type: String },
        location: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("willdocument", WillDocument);
