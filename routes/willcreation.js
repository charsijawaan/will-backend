const mongoose = require("mongoose");
const express = require("express");
var cloudinary = require("cloudinary").v2;

var fs = require("fs");
var path = require("path");
const moment = require("moment");

var route = express.Router();
var Will = require("../models/willcreation");
var Users = require("./../models/users");
var WillDocument = require("./../models/willDocument");
let streamifier = require("streamifier");

// cloudinary.config({
//     cloud_name: "dexn8tnt9",
//     api_key: "828443825275634",
//     api_secret: "oYWmlitChe7pZ7K9PatCNZaXfMk",
// });
cloudinary.config({
    cloud_name: "dtrghklfr",
    api_key: "364324338527693",
    api_secret: "LPimuqz4eLCvXmHyq67dJNTj5us",
});

async function uploadGeneric(obj) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            obj.tempFilePath,
            { unique_filename: true, resource_type: "auto" },
            function (error, result) {
                if (error) reject(error);
                else resolve(result);
            }
        );
    });
}

route.post("/createwill", async (req, res) => {
    let {
        makingFor,
        step1Prefix,
        step1FirstName,
        step1MiddleName,
        step1LastName,
        step1Suffix,
        step1Gender,
        step1Address,
        step1Town,
        step1Country,
        step1County,
        step1PhoneNumber,
        step1Email,
        step1MaritalStatus,
        prefix,
        firstName,
        middleName,
        lastName,
        suffix,
        gender,
        address,
        town,
        country,
        county,
        phoneNumber,
        email,
        maritalStatus,
        step3ExecutorDetails,
        wivesDetails,
        step5Children,
        step6GuardianDetails,
        step7AssetDetails,
        doYouWantToDistributeEqually,
        step9specificIndividuals,
        transferBeneficiary,
        giftMadeTo,
        trusteeName,
        trusteeAddress,
        name,
        relationship,
        step10Address,
        restriction,
        // step11AnyGiftToPet,
        // step11Name,
        // step11Desc,
        // step11Amount,
        step11AppointCareTaker,
        step11CareTakerName,
        step11CareTakerAddress,
        burialDesc,
        step13Desc,
        step13IsLiterate,
        step13LiterateName,
        step13LiterateAddress,
        step14Witness,
        userID,
    } = req.body;

    let selfie1;
    let selfie2;
    let selfie3;

    if (req.files) {
        try {
            if (req.files.selfie1 !== undefined) {
                selfie1 = await uploadGeneric(req.files.selfie1);
            }
            if (req.files.selfie2 !== undefined) {
                selfie2 = await uploadGeneric(req.files.selfie2);
            }
            if (req.files.selfie3 !== undefined) {
                selfie3 = await uploadGeneric(req.files.selfie3);
            }
        } catch (e) {
            console.log(e);
        }
    }

    step7AssetDetails = JSON.parse(step7AssetDetails);

    var will = new Will({
        _id: new mongoose.Types.ObjectId(),
        type: "Standard",
        makingFor: makingFor,
        step1Prefix: step1Prefix,
        step1FirstName: step1FirstName,
        step1MiddleName: step1MiddleName,
        step1LastName: step1LastName,
        step1Suffix: step1Suffix,
        step1Gender: step1Gender,
        step1Address: step1Address,
        step1Town: step1Town,
        step1Country: step1Country,
        step1County: step1County,
        step1PhoneNumber: step1PhoneNumber,
        step1Email: step1Email,
        step1MaritalStatus: step1MaritalStatus,
        prefix: prefix,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        suffix: suffix,
        gender: gender,
        address: address,
        town: town,
        country: country,
        county: county,
        phoneNumber: phoneNumber,
        email: email,
        maritalStatus: maritalStatus,
        step3ExecutorDetails: JSON.parse(step3ExecutorDetails),
        wivesDetails: JSON.parse(wivesDetails),
        step5Children: JSON.parse(step5Children),
        step6GuardianDetails: JSON.parse(step6GuardianDetails),
        step7AssetDetails: step7AssetDetails,
        doYouWantToDistributeEqually: doYouWantToDistributeEqually,
        step9specificIndividuals: JSON.parse(step9specificIndividuals),
        transferBeneficiary: transferBeneficiary,
        giftMadeTo: giftMadeTo,
        trusteeName: trusteeName,
        trusteeAddress: trusteeAddress,
        name: name,
        relationship: relationship,
        step10Address: step10Address,
        restriction: restriction,
        // step11AnyGiftToPet: step11AnyGiftToPet,
        // step11Name: step11Name,
        // step11Desc: step11Desc,
        // step11Amount: step11Amount,
        step11AppointCareTaker: step11AppointCareTaker,
        step11CareTakerName: step11CareTakerName,
        step11CareTakerAddress: step11CareTakerAddress,
        burialDesc: burialDesc,
        step13Desc: JSON.parse(step13Desc),
        step13IsLiterate: step13IsLiterate,
        step13LiterateName: step13LiterateName,
        step13LiterateAddress: step13LiterateAddress,
        step14Witness: JSON.parse(step14Witness),
        selfie1: selfie1 !== undefined ? selfie1.secure_url : null,
        selfie2: selfie2 !== undefined ? selfie2.secure_url : null,
        selfie3: selfie3 !== undefined ? selfie3.secure_url : null,
        userID: userID,
        dateCreated: moment().format("LL"),
    });

    try {
        await will.save();

        await Users.findOneAndUpdate(
            { _id: userID },
            { activeWillID: will._id }
        );

        for (var i = 0; i < step7AssetDetails.length; i++) {
            if (req.files[step7AssetDetails[i].assetFileName] !== undefined) {
                let uploadedFile = await uploadGeneric(
                    req.files[step7AssetDetails[i].assetFileName]
                );
                const doc = new WillDocument({
                    willID: will._id,
                    url: uploadedFile.secure_url,
                    type: uploadedFile.resource_type,
                    location: step7AssetDetails[i].documentLocation,
                    name: step7AssetDetails[i].assetFileName,
                    from: "nonmuslim will creation",
                    assetID: step7AssetDetails[i].assetID,
                    dateCreated: moment().format("LL"),
                });
                await doc.save();
            }
        }
    } catch (e) {
        console.log(e);
    }

    res.send({
        msg: "success",
    });
});

route.post("/createwill/muslim", async (req, res) => {
    let {
        makingFor,
        step1Prefix,
        step1FirstName,
        step1MiddleName,
        step1LastName,
        step1Suffix,
        step1Gender,
        step1Address,
        step1Town,
        step1Country,
        step1County,
        step1PhoneNumber,
        step1Email,
        step1MaritalStatus,
        prefix,
        firstName,
        middleName,
        lastName,
        suffix,
        gender,
        address,
        town,
        country,
        county,
        phoneNumber,
        email,
        maritalStatus,
        wivesDetails,
        children,
        otherFamilyMembers,
        guardianDetails,
        step7AssetDetails,
        step8Question,
        step8ExecutorDetails,
        priorityArray,
        otherTransferBeneficiary,
        otherGiftMadeTo,
        otherName,
        otherRelationship,
        otherAddress,
        otherContest,
        otherTrusteeName,
        otherTrusteeAdd,
        petCaretaker,
        petCareTakerName,
        petAddress,
        burialDescription,
        additionalInstructions,
        isLiterate,
        additionalName,
        additionalAddress,
        signingDetails,
        userID,
    } = req.body;

    let selfie1;
    let selfie2;
    let selfie3;

    if (req.files) {
        try {
            if (req.files.selfie1 !== undefined) {
                selfie1 = await uploadGeneric(req.files.selfie1);
            }
            if (req.files.selfie2 !== undefined) {
                selfie2 = await uploadGeneric(req.files.selfie2);
            }
            if (req.files.selfie3 !== undefined) {
                selfie3 = await uploadGeneric(req.files.selfie3);
            }
        } catch (e) {
            console.log(e);
        }
    }

    step7AssetDetails = JSON.parse(step7AssetDetails);

    var wm = new Will({
        _id: new mongoose.Types.ObjectId(),
        type: "Muslim",
        makingFor: makingFor,
        step1Prefix: step1Prefix,
        step1FirstName: step1FirstName,
        step1MiddleName: step1MiddleName,
        step1LastName: step1LastName,
        step1Suffix: step1Suffix,
        step1Gender: step1Gender,
        step1Address: step1Address,
        step1Town: step1Town,
        step1Country: step1Country,
        step1County: step1County,
        step1PhoneNumber: step1PhoneNumber,
        step1Email: step1Email,
        step1MaritalStatus: step1MaritalStatus,
        prefix: prefix,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        suffix: suffix,
        gender: gender,
        address: address,
        town: town,
        country: country,
        county: county,
        phoneNumber: phoneNumber,
        email: email,
        maritalStatus: maritalStatus,
        wivesDetails: JSON.parse(wivesDetails),
        children: JSON.parse(children),
        otherFamilyMembers: JSON.parse(otherFamilyMembers),
        guardianDetails: JSON.parse(guardianDetails),
        step7AssetDetails: step7AssetDetails,
        step8Question: step8Question,
        step8ExecutorDetails: JSON.parse(step8ExecutorDetails),
        priorityArray: JSON.parse(priorityArray),
        otherTransferBeneficiary: otherTransferBeneficiary,
        otherGiftMadeTo: otherGiftMadeTo,
        otherName: otherName,
        otherRelationship: otherRelationship,
        otherAddress: otherAddress,
        otherContest: otherContest,
        otherTrusteeName: otherTrusteeName,
        otherTrusteeAdd: otherTrusteeAdd,
        petCaretaker: petCaretaker,
        petCareTakerName: petCareTakerName,
        petAddress: petAddress,
        burialDescription: burialDescription,
        additionalInstructions: JSON.parse(additionalInstructions),
        isLiterate: isLiterate,
        additionalName: additionalName,
        additionalAddress: additionalAddress,
        signingDetails: JSON.parse(signingDetails),
        selfie1: selfie1 !== undefined ? selfie1.secure_url : null,
        selfie2: selfie2 !== undefined ? selfie2.secure_url : null,
        selfie3: selfie3 !== undefined ? selfie3.secure_url : null,
        dateCreated: moment().format("LL"),
        userID: userID,
    });

    await wm.save();

    await Users.findOneAndUpdate({ _id: userID }, { activeWillID: wm._id });

    for (var i = 0; i < step7AssetDetails.length; i++) {
        if (req.files[step7AssetDetails[i].assetFileName] !== undefined) {
            let uploadedFile = await uploadGeneric(
                req.files[step7AssetDetails[i].assetFileName]
            );
            const doc = new WillDocument({
                willID: wm._id,
                url: uploadedFile.secure_url,
                type: uploadedFile.resource_type,
                location: step7AssetDetails[i].documentLocation,
                name: step7AssetDetails[i].assetFileName,
                from: "muslim will creation",
                assetID: step7AssetDetails[i].assetID,
                dateCreated: moment().format("LL"),
            });
            await doc.save();
        }
    }

    res.send({
        msg: "success",
    });
});

module.exports = route;
