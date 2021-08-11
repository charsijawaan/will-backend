const mongoose= require("mongoose")

const LivingTrust = mongoose.Schema({
    
    areYouOver18: { type: String },
    areYouOfSaneMind: { type: String },
    doYouOwnThePropertyVested: { type: String },
    areYouCreatingARevocableOrIrrevocable: { type: String },

    name: { type: String },
    city: { type: String },
    zipCode: { type: String },
    state: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },

    isTheGrantorNotTheTrustee: { type: String },
    trusteeType: { type: String },
    organisationConfirmation: { type: String },
    individuaConfirmation: { type: String },
    trusteeName: { type: String },
    trusteeCity: { type: String },
    trusteeZipCode: { type: String },
    trusteeState: { type: String },
    trusteeAddress: { type: String },
    doYouWantCotrustee: { type: String },
    CotrusteeCity: { type: String },
    CotrusteeZipCode: { type: String },
    CotrusteeState: { type: String },
    CotrusteeName: { type: String },
    CotrusteeAddress: { type: String },
    wouldYouLikeToNameTheTrust: { type: String },
    trustName: { type: String },

    step4Gifts: [{}],
    step4GiftsCount: { type: Number },

    beneficiariesNames: [{ type: String }],
    beneficiariesCount: { type: String },
    giveToAlt: [{}],
    giveToAltCount: { type: Number },
    // giveTheFollowingItems: { type: String },
    // to: { type: String },
    // alternateRecipient: { type: String },

    step5Charities: [{}],
    step5CharityCount: { type: Number },
    
    // nameOfCharity: { type: String },
    // gift: { type: String },

    subtrustQuestion: { type: String },
    subtrustName: { type: String },
    subtrustAge: { type: String },

    pourOverWillQuestion: { type: String },
    // pourOverWillFile: { type: String },

    additionalInstructionOne:  { type: String },
    additionalInstructionTwo:  { type: String },

    remunerationQuestion: { type: String },
    remunerationInstruction: { type: String },
    remunerationAmount: { type: String },
    remunerationPeriod: { type: String },

    signature: { type: String },
    selfie: { type: String },
    signatureGrantor: { type: String },
    signatureTrustee: { type: String },
    signatureSuccessor: { type: String },
    // affidavit: { type: String },
    date: { type: String },
    place: { type: String },
    time: { type: String },

    willID: {type:String},
    userID: {type:String},
    dateCreated: {type:String},
   
  }, {timestamps: true});
  
  module.exports = mongoose.model("livingtrust", LivingTrust);