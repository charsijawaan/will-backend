const mongoose = require("mongoose");
const express = require("express");
var cloudinary = require('cloudinary').v2;
const multer = require("multer");
var fs=require('fs');
var path = require("path");

var route = express.Router();
var Will = require('../models/willcreation')
var Users = require("./../models/users");

cloudinary.config({
  cloud_name: 'dexn8tnt9',
  api_key: '828443825275634',
  api_secret: 'oYWmlitChe7pZ7K9PatCNZaXfMk'
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
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

// const upload = multer({ storage: storage, fileFilter: fileFilter });
// add products
route.post("/createwill", async (req,res) => {

    var {personalDetails, wivesDetails, executorDetails, childrenDetails, guardianDetails,
          distributionDetails, remainderDetails, otherDetails, petDetails, burialDetails,additionalDetails,
          signingDetails, userID} = req.body;


    let filePaths = [];
    let urls = []

    let image=''
    if(req.method==='POST') {

      try {
        if(req.files) {
            filePaths = await uploadFiles(req);
            console.log(filePaths);
            for(let i = 0; i < filePaths.length; i++) {
              image = await cloudinary.uploader.upload(filePaths[i]);
              urls.push(image.url);
              fs.unlinkSync(filePaths[i]);
            }
        }

    const p = JSON.parse(personalDetails)
    const w = JSON.parse(wivesDetails)
    const exe = JSON.parse(executorDetails)
    const c = JSON.parse(childrenDetails)
    const g = JSON.parse(guardianDetails)
    const d = JSON.parse(distributionDetails)
    const r = JSON.parse(remainderDetails)
    const o = JSON.parse(otherDetails)
    const pet = JSON.parse(petDetails)
    const b = JSON.parse(burialDetails)
    const a = JSON.parse(additionalDetails)
    const s = JSON.parse(signingDetails)
    //
    //
      const newProduct = new Will({
        _id: new mongoose.Types.ObjectId(),
        personalDetails: p,
        wivesDetails: w,
        executorDetails: exe,
        childrenDetails: c,
        guardianDetails:g,
        distributionDetails:d,
        remainderDetails:r,
        otherDetails:o,
        petDetails: pet,
        burialDetails:b,
        additionalDetails:a,
        signingDetails:s,
        selfies: urls,
        userID: userID,
      })
       await newProduct.save();

       await Users.findOneAndUpdate({ _id: userID }, { activeWillID: newProduct._id });
    //
     }
     catch (error) {
      console.log(error)
     }
    res.status(200).json({
      message: 'images uploaded successfully',
      data: urls
    })

  }
  else{
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }



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

  async function uploadFiles (req) {
    let filePaths = []

    if(req.files.selfies.length === undefined) {
        let fileObject = req.files.refereeDocuments
        let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name)

        let newName = renameFileWithUniqueName(fileObject.name)
        let newPath = path.join(__dirname, '../','public', 'uploads', newName)

        let DBPath = path.join('public', 'uploads', newName)
        filePaths.push(DBPath)

        await moveFile(uploadPath, newPath, fileObject)
        return filePaths
    }

    for(let i = 0; i < req.files.selfies.length; i++) {
        let fileObject = req.files.selfies[i]
        let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name)

         let newName = renameFileWithUniqueName(fileObject.name)
         let newPath = path.join(__dirname, '../','public', 'uploads', newName)

         let DBPath = path.join('public', 'uploads', newName)
         filePaths.push(DBPath)

         await moveFile(uploadPath, newPath, fileObject)
    }
    return filePaths
}

module.exports= route
