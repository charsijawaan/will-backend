const mongoose= require("mongoose")

const LivingTrust = mongoose.Schema({
    
    areYouOver18: { type: String },
    areYouOfSaneMind: { type: String },
    doYouOwnThePropertyVested: { type: String },
    areYouCreatingARevocableOrIrrevocable: { type: String },

    name: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },

    isTheGrantorNotTheTrustee: { type: String },
    trusteeType: { type: String },
    organisationConfirmation: { type: String },
    individuaConfirmation: { type: String },
    trusteeName: { type: String },
    trusteeAddress: { type: String },
    doYouWantCotrustee: { type: String },
    CotrusteeName: { type: String },
    CotrusteeAddress: { type: String },
    wouldYouLikeToNameTheTrust: { type: String },
    trustName: { type: String },

    assetType: { type: String },
    realEstateAddress: { type: String },
    realEstateType: { type: String },
    financialAccountName: { type: String },
    financialAccountType: { type: String },
    financialAccountNumber: { type: String },
    stockAndBondStockName: { type: String },
    stockAndBondStockNumberOfShares: { type: String },
    stockAndBondStockCertificateNumber: { type: String },
    stockAndBondStockDescription: { type: String },
    stockAndBondBondName: { type: String },
    stockAndBondBondValue: { type: String },
    stockAndBondBondCertificateNumber: { type: String },
    stockAndBondBondDescription: { type: String },
    businessName: { type: String },
    businessDescription: { type: String },
    titleOfContract: { type: String },
    nameOfOtherParty: { type: String },
    dateOfContract: { type: String },
    contarctDescription: { type: String },
    lifeAssuranceName: { type: String },
    lifeAssuranceDescription: { type: String },
    lifeAssuranceNumber: { type: String },
    retirementProceedName: { type: String },
    retirementProceedDescription: { type: String },
    retirementProceedNumber: { type: String },
    personalPropertyQuestion: { type: String },
    personalPropertyDescription: { type: String },

    beneficiariesNames: [{ type: String }],
    beneficiariesCount: { type: String },
    giveTheFollowingItems: { type: String },
    to: { type: String },
    alternateRecipient: { type: String },

    nameOfCharity: { type: String },
    gift: { type: String },

    subtrustQuestion: { type: String },
    subtrustName: { type: String },
    subtrustAge: { type: String },

    pourOverWillQuestion: { type: String },
    pourOverWillFile: { type: String },

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
    affidavit: { type: String },
    date: { type: String },
    place: { type: String },
    time: { type: String },

    willID: {type:String},
    userID: {type:String},
    dateCreated: {type:String},
   
  }, {timestamps: true});
  
  module.exports = mongoose.model("livingtrust", LivingTrust);