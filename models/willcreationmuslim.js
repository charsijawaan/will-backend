const mongoose = require("mongoose");

const WillCreationMuslim = mongoose.Schema(
    {
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

        wivesDetails: [{}],

        childrenDetails: [{}],

        otherFamilyMembers: [{}],

        guardianDetails: [{}],

        executorDetails: [{}],
        step7Question: { type: String },
        addAltExec: { type: String },
        isRenumerated: { type: String },
        execRenumeration: { type: String },

        beneficiaryAssets: [{}],
        beneficiary: { type: String },
        beneficiaryName: { type: String },
        beneficiaryAddress: { type: String },
        beneficiaryEmail: { type: String },
        beneficiaryPhone: { type: String },
        selectedChild: { type: String },
        selectedWife: { type: String },

        priorityArray: [{}],

        otherTransferBeneficiary: { type: String },
        otherGiftMadeTo: { type: String },
        otherName: { type: String },
        otherRelationship: { type: String },
        otherAddress: { type: String },
        otherContest: { type: String },
        otherTrusteeName: { type: String },
        otherTrusteeAdd: { type: String },

        giftToPet: { type: String },
        petName: { type: String },
        petDescription: { type: String },
        petAmount: { type: String },
        petCaretaker: { type: String },
        petCareTakerName: { type: String },
        petAddress: { type: String },

        burialDescription: { type: String },

        additionalInstructions: [{}],
        isLiterate: { type: String },
        additionalName: { type: String },
        additionalAddress: { type: String },

        signingDetails: [{}],

        selfie1: { type: String },
        selfie2: { type: String },
        selfie3: { type: String },
        
        userID: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("willcreationmuslim", WillCreationMuslim);
