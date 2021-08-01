const mongoose = require("mongoose");
const express = require("express");
var cloudinary = require('cloudinary').v2;
const multer = require("multer");
const path = require("path");
var WillDocument = require("./../models/willDocument");
var registeredWill = require('./../models/registerWill');
var Codicil = require("./../models/codicil");
var Users = require("./../models/users");
var Sales = require("./../models/sales");
var Products = require("./../models/products");
var Discounts =require("./../models/discount");
var Commision = require("./../models/commission");
var voucher_codes = require("voucher-code-generator");
var deedOfGift = require("./../models/deedOfGift");
var LivingTrust = require("./../models/livingTrust");
const moment = require('moment');

var fs=require('fs')
var Will = require('../models/willcreation')
cloudinary.config({
    cloud_name: 'dexn8tnt9',
    api_key: '828443825275634',
    api_secret: 'oYWmlitChe7pZ7K9PatCNZaXfMk'
  });

var route = express.Router();

route.post("/", async (req, res) => {
    let userWills = await Will.find({userID: req.body.id}).sort({createdAt : -1});
    res.send({userWills: userWills});
});

route.post("/get_registered_wills", async (req, res) => {
    let userID = req.body.userID;
    let data = await registeredWill.find({userID: userID}).sort({createdAt : -1});
    res.send({
      registeredWills: data
    })
});


route.post("/getWill", async (req, res) => {
    let will;
    will = await Will.findOne({_id: req.body.willID});
    if(will === null) {
        will = await registeredWill.findOne({_id: req.body.willID});
    }
    console.log(will);
    res.send({will: will});
});

route.post("/get_active_will_id", async (req, res) => {
    let userID = req.body.userID;

    let user = await Users.findOne({_id: userID});
    res.send({
        willID: user.activeWillID
    })
})


// update will means add codicil
route.post("/updateWill", async (req, res) => {
    let willID = req.body.willID;
    let executorDetails = JSON.parse(req.body.executorDetails);
    let distributionDetails = JSON.parse(req.body.distributionDetails);
    let additionalDetails = JSON.parse(req.body.additionalDetails);
    let wivesDetails = JSON.parse(req.body.wivesDetails);
    let childrenDetails = JSON.parse(req.body.childrenDetails);
    let guardianDetails = JSON.parse(req.body.guardianDetails);
    let signingDetails = JSON.parse(req.body.signingDetails);
    let personalDetails = JSON.parse(req.body.personalDetails);
    let remainderDetails = JSON.parse(req.body.remainderDetails);
    let otherDetails = JSON.parse(req.body.otherDetails);
    let petDetails = JSON.parse(req.body.petDetails);
    let userID = req.body.userID;

    let codicil = new Codicil({
        willID: willID,
        userID: userID,
        executorDetails: executorDetails,
        distributionDetails: distributionDetails,
        additionalDetails: additionalDetails,
        wivesDetails: wivesDetails,
        childrenDetails: childrenDetails,
        guardianDetails: guardianDetails,
        signingDetails: signingDetails,
        personalDetails: personalDetails,
        remainderDetails: remainderDetails,
        otherDetails: otherDetails,
        petDetails: petDetails,
    });

    await codicil.save();
    res.send({msg: "Success"});

    // const filter = { _id : willID };
    // const update = {
    //     executorDetails: executorDetails,
    //     distributionDetails: distributionDetails,
    //     additionalDetails: additionalDetails,
    //     wivesDetails: wivesDetails,
    //     childrenDetails: childrenDetails,
    //     guardianDetails: guardianDetails,
    //     signingDetails: signingDetails,
    //     personalDetails: personalDetails,
    //     remainderDetails: remainderDetails,
    //     otherDetails: otherDetails,
    //     petDetails: petDetails
    // };

    // await Will.findOneAndUpdate(filter, update);

    // res.send({msg: "Success"});
});


route.post("/get_registered_will", async (req, res) => {
  let willID = req.body.willID;
  // console.log(willID);
  let data = await registeredWill.findOne({_id: willID});
  console.log(data);
  res.send({
    will: data
  })
})

function renameFileWithUniqueName(previousName) {
    let dots = previousName.split('.')
    let dt = new Date();
    let newFileName = ''
    for(let i = 0; i < dots.length - 1; i++) {
        newFileName += dots[i]
    }
    newFileName += '12121212'
    newFileName += dt.getTime()
    newFileName += '.' + dots[dots.length - 1]
    return newFileName
}

function moveFile(uploadPath, newPath, fileObject) {
    return new Promise((resolve, reject) => {
        fileObject.mv(uploadPath, function(err) {
            if (err)
                reject(err)
            else
                fs.renameSync(uploadPath, newPath)
                resolve()
        })
    })
}

async function uploadFile (req) {

    let fileObject = req.files.myFile;
    let originalName = fileObject.name;

    let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name);

    let newName = renameFileWithUniqueName(fileObject.name);
    let newPath = path.join(__dirname, '../','public', 'uploads', newName);

    let DBPath = path.join('uploads', newName);

    await moveFile(uploadPath, newPath, fileObject);

    return [originalName, newName];

}

async function uploadSignature (req) {
    
    let fileObject = req.files.signature;
    let originalName = fileObject.name;

    let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name);

    let newName = renameFileWithUniqueName(fileObject.name);
    let newPath = path.join(__dirname, '../','public', 'uploads', newName);

    let DBPath = path.join('uploads', newName);

    await moveFile(uploadPath, newPath, fileObject);

    return [originalName, newName];

}

async function uploadSelfie (req) {

    let fileObject = req.files.selfie;
    let originalName = fileObject.name;

    let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name);

    let newName = renameFileWithUniqueName(fileObject.name);
    let newPath = path.join(__dirname, '../','public', 'uploads', newName);

    let DBPath = path.join('uploads', newName);

    await moveFile(uploadPath, newPath, fileObject);

    return [originalName, newName];

}

async function uploadGeneric(obj) {
    let fileObject = obj;
    let originalName = fileObject.name;

    let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name);

    let newName = renameFileWithUniqueName(fileObject.name);
    let newPath = path.join(__dirname, '../','public', 'uploads', newName);

    let DBPath = path.join('uploads', newName);

    await moveFile(uploadPath, newPath, fileObject);

    return [originalName, newName];    
}

// old route of documents not using anymore
route.post("/attachdocument", async (req, res) => {
    let willID = req.body.willID;
    let file;
    if(req.files) {
        file = await uploadFile(req);
        console.log(file);
    }

    const willDocument = new WillDocument({
        willID : willID,
        originalDocumentName : file[0],
        newDocumentName : file[1]
    });

    await willDocument.save();

    res.send({
        msg: "Success"
    })

})

// new route of documents
route.post("/adddocument", async (req, res) => {
    let willID = req.body.willID;
    let name = req.body.name;
    let type = req.body.type;
    let desc = req.body.desc;
    let location = req.body.location;

    let file;
    if(req.files) {
        file = await uploadFile(req);
    }

    const willDocument = new WillDocument({
        willID : willID,
        originalDocumentName : file[0],
        newDocumentName : file[1],
        name: name,
        type: type,
        desc: desc,
        location: location,
    });

    await willDocument.save();

    res.send({
        msg: "Success"
    })

})

route.post("/getalldocuments", async (req, res) => {
    let willID = req.body.willID;
    console.log(willID);

    let allWillDocuments = await WillDocument.find({ willID: willID });

    res.send({
        allDocuments: allWillDocuments,
        serverURL: req.protocol + ':\\\\' + req.get('host') + '\\',
    });
})

route.post("/getcodicils", async (req, res) => {
    let codicils = await Codicil.find({willID: req.body.willID}).sort({createdAt : -1});
    res.send({
        codicils: codicils
    })
})

route.post("/getcodicil", async (req, res) => {
    let codicilID = req.body.codicilID;

    let codicil = await Codicil.findOne( { _id: codicilID } );

    res.send({
        codicil: codicil
    })
})

route.post("/add_deed_of_gift", async (req, res) => {
    let {   countryOfGift, stateOfGift, revokeThisGift, dateOfTransfer, typeOfDonor, donorFullName, donorAddress, typeOfDonee,
            doneeFullName, doneeAddress, relationshipDonorDonee, isDoneeMinor, doneeGuardianName, doneeGuardianAddress,
            typeOfGift, giftPossessionTime, descriptionOfGift, purposeOfGift, specificDate, monetaryValue, additionalClauses, agentFullName,
            agentAddress, addAlternateAgent, alternateAgentFullName, alternateAgentAddress, willID, userID } = req.body;


    let signatureFile = ["",""];
    let selfie = ["",""];
    if(req.files) {
        if(req.files.signature !== undefined) {
            signatureFile = await uploadSignature(req);
        }
        if(req.files.selfie !== undefined) {
            selfie = await uploadSelfie(req);
        }
    }

    const d = new deedOfGift({
        countryOfGift: countryOfGift,
        stateOfGift: stateOfGift,
        revokeThisGift: revokeThisGift,
        dateOfTransfer: dateOfTransfer,
        typeOfDonor: typeOfDonor,
        donorFullName: donorFullName,
        donorAddress: donorAddress,
        typeOfDonee: typeOfDonee,
        doneeFullName: doneeFullName,
        doneeAddress: doneeAddress,
        relationshipDonorDonee: relationshipDonorDonee,
        isDoneeMinor: isDoneeMinor,
        doneeGuardianName: doneeGuardianName,
        doneeGuardianAddress: doneeGuardianAddress,
        typeOfGift: typeOfGift,
        giftPossessionTime: giftPossessionTime,
        descriptionOfGift: descriptionOfGift,
        purposeOfGift: purposeOfGift,
        specificDate: specificDate,
        monetaryValue: monetaryValue,
        additionalClauses: JSON.parse(additionalClauses),
        agentFullName: agentFullName,
        agentAddress: agentAddress,
        addAlternateAgent: addAlternateAgent,
        alternateAgentFullName: alternateAgentFullName,
        alternateAgentAddress: alternateAgentAddress,
        willID: willID,
        userID: userID,
        selfie: selfie[1],
        signature: signatureFile[1],        
        dateCreated: moment().format('LL'),
    })

    await d.save();

    res.send({
        msg: "success"
    })

})

route.post("/get_deed_of_gifts", async (req, res) => {
    let { willID, userID } = req.body;
    let deedOfGifts = await deedOfGift.find( {willID: willID, userID: userID} ).sort({createdAt : -1});
    res.send({
        deedOfGifts: deedOfGifts
    })
})

route.post("/get_deed_of_gift", async (req, res) => {
    let { deedID } = req.body;
    let deed = await deedOfGift.findOne({_id: deedID});
    console.log(deed);
    res.send({
        deed: deed
    })
})

route.post("/get_deed_of_gift_base_price", async (req, res) => {
    var product = await Products.findOne({name: "Deed of Gift"});
    res.send({
        basePrice: product.basePrice
    })
})

route.post("/add_deed_of_gift_sale", async (req, res) => {
    let { productName, transactionID, amount, userID } = req.body;
    const code = voucher_codes.generate({
        length: 5,
        count: 1,
    });

    var s = new Sales({
        salesID: code[0],
        date: moment().format('LL'),
        productName: productName,
        transactionID: transactionID,
        amount: amount,
        userID: userID
    })

    await s.save();

    res.send({
        msg: "success",
        salesID: code[0]
    })

})

route.post("/get_discount_amount_by_type", async (req, res) => {  
    let { type } = req.body;
    let d = await Discounts.findOne({type: type});
    res.send({
        discount: d
    })
})

route.post("/add_deed_of_gift_commision", async (req, res) => {
    
    let { salesID, willAmbID, commissionEarned, commissionBalance, userID, userName } = req.body;
    
    let c = new Commision({
        date: moment().format('LL'),
        willAmbID: willAmbID,
        userID: userID,
        commissionEarned: commissionEarned,
        commissionBalance: commissionBalance,
        commissionStatus: "Unpaid",
        productName: "Deed of Gift",
        userName: userName,
        salesID: salesID
    })

    await c.save();

    res.send({
        msg: "success"
    })

})

route.post("/add_living_trust", async (req, res) => {
    let { areYouOver18, areYouOfSaneMind, doYouOwnThePropertyVested, areYouCreatingARevocableOrIrrevocable,
        name, address, phone, email,
        isTheGrantorNotTheTrustee, trusteeType, organisationConfirmation, individuaConfirmation, trusteeName, trusteeAddress, doYouWantCotrustee, CotrusteeName, CotrusteeAddress, wouldYouLikeToNameTheTrust, trustName,
        assetType, realEstateAddress, realEstateType, financialAccountName, financialAccountType, financialAccountNumber, stockAndBondStockName, stockAndBondStockNumberOfShares, stockAndBondStockCertificateNumber, stockAndBondStockDescription, stockAndBondBondName, stockAndBondBondValue, stockAndBondBondCertificateNumber, stockAndBondBondDescription, businessName, businessDescription, titleOfContract, nameOfOtherParty, dateOfContract, contarctDescription, lifeAssuranceName, lifeAssuranceDescription, lifeAssuranceNumber, retirementProceedName, retirementProceedDescription, retirementProceedNumber, personalPropertyQuestion, personalPropertyDescription,
        beneficiariesNames, beneficiariesCount, giveTheFollowingItems, to, alternateRecipient,
        nameOfCharity, gift,
        subtrustQuestion, subtrustName, subtrustAge,
        pourOverWillQuestion,
        additionalInstructionOne, additionalInstructionTwo,
        remunerationQuestion, remunerationInstruction, remunerationAmount, remunerationPeriod,
        date, place, time, userID, willID } = req.body;    

    let pourOverWillFile = ["",""];
    let signature = ["",""];
    let selfie = ["",""];
    let signatureGrantor = ["",""];
    let signatureTrustee = ["",""];
    let signatureSuccessor = ["",""];
    let affidavit = ["",""];

    if(req.files) {
        if(req.files.pourOverWillFile !== undefined) {
            pourOverWillFile = await uploadGeneric(req.files.pourOverWillFile);
        }
        if(req.files.signature !== undefined) {
            signature = await uploadGeneric(req.files.signature);
        }
        if(req.files.selfie !== undefined) {
            selfie = await uploadGeneric(req.files.selfie);
        }
        if(req.files.signatureGrantor !== undefined) {
            signatureGrantor = await uploadGeneric(req.files.signatureGrantor);            
        }
        if(req.files.signatureTrustee !== undefined) {
            signatureTrustee = await uploadGeneric(req.files.signatureTrustee);            
        }
        if(req.files.signatureSuccessor !== undefined) {
            signatureSuccessor = await uploadGeneric(req.files.signatureSuccessor);            
        }
        if(req.files.affidavit !== undefined) {
            affidavit = await uploadGeneric(req.files.affidavit);            
        }                        
        
    }

    var lt = new LivingTrust({
        areYouOver18: areYouOver18,
        areYouOfSaneMind: areYouOfSaneMind,
        doYouOwnThePropertyVested: doYouOwnThePropertyVested,
        areYouCreatingARevocableOrIrrevocable: areYouCreatingARevocableOrIrrevocable,

        name: name,
        address: address,
        phone: phone,
        email: email,

        isTheGrantorNotTheTrustee: isTheGrantorNotTheTrustee,
        trusteeType: trusteeType,
        organisationConfirmation: organisationConfirmation,
        individuaConfirmation: individuaConfirmation,
        trusteeName: trusteeName,
        trusteeAddress: trusteeAddress,
        doYouWantCotrustee: doYouWantCotrustee,
        CotrusteeName: CotrusteeName,
        CotrusteeAddress: CotrusteeAddress,
        wouldYouLikeToNameTheTrust: wouldYouLikeToNameTheTrust,
        trustName: trustName,
        assetType: assetType,
        realEstateAddress: realEstateAddress,
        realEstateType: realEstateType,
        financialAccountName: financialAccountName,
        financialAccountType: financialAccountType,
        financialAccountNumber: financialAccountNumber,
        stockAndBondStockName: stockAndBondStockName,
        stockAndBondStockNumberOfShares: stockAndBondStockNumberOfShares,
        stockAndBondStockCertificateNumber: stockAndBondStockCertificateNumber,
        stockAndBondStockDescription: stockAndBondStockDescription,
        stockAndBondBondName: stockAndBondBondName,
        stockAndBondBondValue: stockAndBondBondValue,
        stockAndBondBondCertificateNumber: stockAndBondBondCertificateNumber,
        stockAndBondBondDescription: stockAndBondBondDescription,
        businessName: businessName,
        businessDescription: businessDescription,
        titleOfContract: titleOfContract,
        nameOfOtherParty: nameOfOtherParty,
        dateOfContract: dateOfContract,
        contarctDescription: contarctDescription,
        lifeAssuranceName: lifeAssuranceName,
        lifeAssuranceDescription: lifeAssuranceDescription,
        lifeAssuranceNumber: lifeAssuranceNumber,
        retirementProceedName: retirementProceedName,
        retirementProceedDescription: retirementProceedDescription,
        retirementProceedNumber: retirementProceedNumber,
        personalPropertyQuestion: personalPropertyQuestion,
        personalPropertyDescription: personalPropertyDescription,

        beneficiariesNames: JSON.parse(beneficiariesNames),
        beneficiariesCount: beneficiariesCount,
        giveTheFollowingItems: giveTheFollowingItems,
        to: to,
        alternateRecipient: alternateRecipient,

        nameOfCharity: nameOfCharity,
        gift: gift,

        subtrustQuestion: subtrustQuestion,
        subtrustName: subtrustName,
        subtrustAge: subtrustAge,

        pourOverWillQuestion: pourOverWillQuestion,
        pourOverWillFile: pourOverWillFile[1],

        additionalInstructionOne: additionalInstructionOne,
        additionalInstructionTwo: additionalInstructionTwo,

        remunerationQuestion: remunerationQuestion,
        remunerationInstruction: remunerationInstruction,
        remunerationAmount: remunerationAmount,
        remunerationPeriod:remunerationPeriod,

        signature: signature[1],
        selfie: selfie[1],
        signatureGrantor: signatureGrantor[1],
        signatureTrustee: signatureTrustee[1],
        signatureSuccessor: signatureSuccessor[1],
        affidavit: affidavit[1],
        date: date,
        place: place,
        time: time,

        userID: userID,
        willID: willID,
        dateCreated: moment().format('LL'),
    })

    await lt.save();

    res.send({
        msg: "success"
    })

})

route.post("/get_living_trusts", async (req, res) => {
    let { willID, userID } = req.body;

    let lts = await LivingTrust.find({willID: willID, userID: userID}).sort({createdAt : -1});

    res.send({
        livingTrusts: lts
    })
})

route.post("/get_living_trust", async (req, res) => {
    let { ltID } = req.body;
    let lt = await LivingTrust.findOne({_id: ltID});
    res.send({
        lt: lt
    })
})

route.post("/get_living_trust_base_price", async (req, res) => {
    var product = await Products.findOne({name: "Living Trust"});
    res.send({
        basePrice: product.basePrice
    })
})

route.post("/add_living_trust_to_sale", async (req, res) => {
    let { productName, transactionID, amount, userID } = req.body;
    const code = voucher_codes.generate({
        length: 5,
        count: 1,
    });

    var s = new Sales({
        salesID: code[0],
        date: moment().format('LL'),
        productName: productName,
        transactionID: transactionID,
        amount: amount,
        userID: userID
    })

    await s.save();

    res.send({
        msg: "success",
        salesID: code[0]
    })

})

route.post("/add_living_trust_commision", async (req, res) => {
    let { salesID, willAmbID, commissionEarned, commissionBalance, userID, userName } = req.body;
    
    let c = new Commision({
        date: moment().format('LL'),
        willAmbID: willAmbID,
        userID: userID,
        commissionEarned: commissionEarned,
        commissionBalance: commissionBalance,
        commissionStatus: "Unpaid",
        productName: "Living Trust",
        userName: userName,
        salesID: salesID
    })

    await c.save();

    res.send({
        msg: "success"
    })

})

module.exports= route
