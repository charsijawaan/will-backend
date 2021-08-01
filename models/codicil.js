const mongoose = require("mongoose");

const Codicil = mongoose.Schema(
    {
        willID: { type: String },
        userID: { type: String },

        personalDetails: {
            prefix: { type: String },
            firstName: { type: String },
            middleName: { type: String },
            lastName: { type: String },
            address: { type: String },
            town: { type: String },
            country: { type: String },
            telephone: { type: Number },
            email: { type: String },
            gender: { type: String },
            suffix: { type: String },
            county: { type: String },
            maritalStatus: { type: String },
        },

        wivesDetails: [
            {
                type: Object,
            },
        ],

        executorDetails: {
            inputFields: [{ type: Object }],
            isRenumerated: { type: String },
            addAltExec: { type: String },
            execRenumeration: { type: String },
        },
        childrenDetails: [
            {
                type: Object,
            },
        ],
        guardianDetails: [
            {
                type: Object,
            },
        ],
        distributionDetails: {
            inputFields: [{ type: Object }],
            wife: { type: String },
            child: { type: String },
            name: { type: String },
            add: { type: String },
            email: { type: String },
            ph: { type: String },
            tenant: { type: String },
            beneficiary: { type: String },
        },
        remainderDetails: {
            distribute: { type: String },
            leaveTo: { type: String },
            name: { type: String },
            address: { type: String },
        },
        otherDetails: {
            transferBeneficiary: { type: String },
            giftMadeTo: { type: String },
            trusteeAdd: { type: String },
            trusteeName: { type: String },
            name: { type: String },
            address: { type: String },
            relationship: { type: String },
            contest: { type: String },
        },
        petDetails: {
            giftToPet: { type: String },
            name: { type: String },
            description: { type: String },
            amount: { type: Number },
            caretaker: { type: String },
            careTakerName: { type: String },
            address: { type: String },
        },
        burialDetails: {
            description: { type: String },
        },
        additionalDetails: {
            inputFields: [{ type: Object }],
            isLiterate: { type: String },
            name: { type: String },
            address: { type: String },
        },
        signingDetails: [
            {
                type: Object,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("codicil", Codicil);
