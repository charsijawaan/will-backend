const mongoose = require("mongoose");
const express = require("express");
var cloudinary = require("cloudinary").v2;
const multer = require("multer");
var fs = require("fs");
var path = require("path");
const moment = require("moment");

var route = express.Router();
var Will = require("../models/willcreation");
var Users = require("./../models/users");
var WillDocument = require("./../models/willDocument");

cloudinary.config({
  cloud_name: "dexn8tnt9",
  api_key: "828443825275634",
  api_secret: "oYWmlitChe7pZ7K9PatCNZaXfMk",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/JPG" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

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
    step11AnyGiftToPet,
    step11Name,
    step11Desc,
    step11Amount,
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

  let selfie1 = ["", ""];
  let selfie2 = ["", ""];
  let selfie3 = ["", ""];

  if (req.files) {
    if (req.files.selfie1 !== undefined) {
      selfie1 = await uploadGeneric(req.files.selfie1);
    }
    if (req.files.selfie2 !== undefined) {
      selfie2 = await uploadGeneric(req.files.selfie2);
    }
    if (req.files.selfie3 !== undefined) {
      selfie3 = await uploadGeneric(req.files.selfie3);
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
    step11AnyGiftToPet: step11AnyGiftToPet,
    step11Name: step11Name,
    step11Desc: step11Desc,
    step11Amount: step11Amount,
    step11AppointCareTaker: step11AppointCareTaker,
    step11CareTakerName: step11CareTakerName,
    step11CareTakerAddress: step11CareTakerAddress,
    burialDesc: burialDesc,
    step13Desc: JSON.parse(step13Desc),
    step13IsLiterate: step13IsLiterate,
    step13LiterateName: step13LiterateName,
    step13LiterateAddress: step13LiterateAddress,
    step14Witness: JSON.parse(step14Witness),
    selfie1: selfie1[1],
    selfie2: selfie2[1],
    selfie3: selfie3[1],
    userID: userID,
    dateCreated: moment().format("LL"),
  });

  await will.save();

  await Users.findOneAndUpdate({ _id: userID }, { activeWillID: will._id });

  for (var i = 0; i < step7AssetDetails.length; i++) {
    if (req.files[step7AssetDetails[i].assetFileName] !== undefined) {
      let oldAndNewNames = await uploadGeneric(
        req.files[step7AssetDetails[i].assetFileName]
      );
      const doc = new WillDocument({
        willID: will._id,
        originalDocumentName: oldAndNewNames[0],
        newDocumentName: oldAndNewNames[1],
        type: oldAndNewNames[1].split(".").pop(),
        location: step7AssetDetails[i].documentLocation,
        name: step7AssetDetails[i].assetFileName,
        from: "will creation",
        dateCreated: moment().format("LL"),
      });
      await doc.save();
    }
  }

  res.send({
    msg: "success",
  });
});

route.post("/createwill/muslim", async (req, res) => {
  let {
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
    executorDetails,
    step7Question,
    addAltExec,
    isRenumerated,
    execRenumeration,
    beneficiaryAssets,
    beneficiary,
    beneficiaryName,
    beneficiaryAddress,
    beneficiaryEmail,
    beneficiaryPhone,
    selectedChild,
    selectedWife,
    priorityArray,
    otherTransferBeneficiary,
    otherGiftMadeTo,
    otherName,
    otherRelationship,
    otherAddress,
    otherContest,
    otherTrusteeName,
    otherTrusteeAdd,
    giftToPet,
    petName,
    petDescription,
    petAmount,
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

  let selfie1 = ["", ""];
  let selfie2 = ["", ""];
  let selfie3 = ["", ""];

  if (req.files) {
    if (req.files.selfie1 !== undefined) {
      selfie1 = await uploadGeneric(req.files.selfie1);
    }
    if (req.files.selfie2 !== undefined) {
      selfie2 = await uploadGeneric(req.files.selfie2);
    }
    if (req.files.selfie3 !== undefined) {
      selfie3 = await uploadGeneric(req.files.selfie3);
    }
  }

  var wm = new Will({
    _id: new mongoose.Types.ObjectId(),

    type: "Muslim",

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

    executorDetails: JSON.parse(executorDetails),
    step7Question: step7Question,
    addAltExec: addAltExec,
    isRenumerated: isRenumerated,
    execRenumeration: execRenumeration,

    beneficiaryAssets: JSON.parse(beneficiaryAssets),
    beneficiary: beneficiary,
    beneficiaryName: beneficiaryName,
    beneficiaryAddress: beneficiaryAddress,
    beneficiaryEmail: beneficiaryEmail,
    beneficiaryPhone: beneficiaryPhone,
    selectedChild: selectedChild,
    selectedWife: selectedWife,

    priorityArray: JSON.parse(priorityArray),

    otherTransferBeneficiary: otherTransferBeneficiary,
    otherGiftMadeTo: otherGiftMadeTo,
    otherName: otherName,
    otherRelationship: otherRelationship,
    otherAddress: otherAddress,
    otherContest: otherContest,
    otherTrusteeName: otherTrusteeName,
    otherTrusteeAdd: otherTrusteeAdd,

    giftToPet: giftToPet,
    petName: petName,
    petDescription: petDescription,
    petAmount: petAmount,
    petCaretaker: petCaretaker,
    petCareTakerName: petCareTakerName,
    petAddress: petAddress,

    burialDescription: burialDescription,

    additionalInstructions: JSON.parse(additionalInstructions),
    isLiterate: isLiterate,
    additionalName: additionalName,
    additionalAddress: additionalAddress,

    signingDetails: JSON.parse(signingDetails),

    selfie1: selfie1[1],
    selfie2: selfie2[1],
    selfie3: selfie3[1],

    dateCreated: moment().format("LL"),

    userID: userID,
  });

  await wm.save();

  await Users.findOneAndUpdate({ _id: userID }, { activeWillID: wm._id });

  res.send({
    msg: "success",
  });
});

function renameFileWithUniqueName(previousName) {
  let dots = previousName.split(".");
  let dt = new Date();
  let newFileName = "";
  for (let i = 0; i < dots.length - 1; i++) {
    newFileName += dots[i];
  }
  newFileName += "12121212";
  newFileName += dt.getTime();
  newFileName += "." + dots[dots.length - 1];
  return newFileName;
}

async function uploadGeneric(obj) {
  let fileObject = obj;
  let originalName = fileObject.name;

  let uploadPath = path.join(
    __dirname,
    "../",
    "public",
    "uploads",
    fileObject.name
  );

  let newName = renameFileWithUniqueName(fileObject.name);
  let newPath = path.join(__dirname, "../", "public", "uploads", newName);

  let DBPath = path.join("uploads", newName);

  await moveFile(uploadPath, newPath, fileObject);

  return [originalName, newName];
}

function moveFile(uploadPath, newPath, fileObject) {
  return new Promise((resolve, reject) => {
    fileObject.mv(uploadPath, function (err) {
      if (err) reject(err);
      else fs.renameSync(uploadPath, newPath);
      resolve();
    });
  });
}

async function uploadFiles(req) {
  let filePaths = [];

  if (req.files.selfies.length === undefined) {
    let fileObject = req.files.refereeDocuments;
    let uploadPath = path.join(
      __dirname,
      "../",
      "public",
      "uploads",
      fileObject.name
    );

    let newName = renameFileWithUniqueName(fileObject.name);
    let newPath = path.join(__dirname, "../", "public", "uploads", newName);

    let DBPath = path.join("public", "uploads", newName);
    filePaths.push(DBPath);

    await moveFile(uploadPath, newPath, fileObject);
    return filePaths;
  }

  for (let i = 0; i < req.files.selfies.length; i++) {
    let fileObject = req.files.selfies[i];
    let uploadPath = path.join(
      __dirname,
      "../",
      "public",
      "uploads",
      fileObject.name
    );

    let newName = renameFileWithUniqueName(fileObject.name);
    let newPath = path.join(__dirname, "../", "public", "uploads", newName);

    let DBPath = path.join("public", "uploads", newName);
    filePaths.push(DBPath);

    await moveFile(uploadPath, newPath, fileObject);
  }
  return filePaths;
}

module.exports = route;
