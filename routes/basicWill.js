var express = require('express');
var route = express.Router();
const mongoose = require("mongoose");
const moment = require('moment');
const BasicWill = require('../models/registerWill')
const Users = require("./../models/users");
const Document = require("../models/regDocument")
const Search = require("../models/search")
const ExecWill = require("../models/executorWill")
var cloudinary = require('cloudinary').v2;
const multer = require("multer");
var fs = require('fs');
var path = require('path');
const probateReg = require('../models/probateReg');

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

const upload = multer({ storage: storage, fileFilter: fileFilter });
// basic will registeration route
route.post("/willregisteration/", async (req, res)=>{
  const {
    requesterTitle,
    requesterFname,
    requesterLname,
    requesterMname,
    requesterAdd,
    requesterEmail,
    requesterPhNo,
    requesterAddLine1,
    requesterAddLine2,
    requesterTown,
    requesterCountry,
    requesterPostCode,
    promotionCode,
    willOwnerTitle,
    willOwnerFname,
    willOwnerSurname,
    willOwnerEmail,
    willOwnerMname,
    willOwnerDob,
    willOwnerGender,
    willOwnerAddLine1,
    willOwnerAddLine2,
    willOwnerCity,
    willOwnerCountry,
    willOwnerPostcode,
    willOwnerPhNo,
    executorName,
    executorEmailAdd,
    executorPhoneNo,
    executorAddLine1,
    executorAddLine2,
    executorCity,
    executorCountry,
    storedWillAdd,
    additionalIns,
    lastRemDate,
    nextRemDate,
    createdWillPDF,
    discountCode,
    discountAmount,
    willSource,
    createdBy,
    willRefNo,
    willStorageRefNo,
    userID
  } = req.body;

    let selfieURL = "";
    let PDFURL = "";

    if(req.files) {
        if(req.files.requesterSelfie) {
          let fileObject = req.files.requesterSelfie;
          let originalName = fileObject.name;
          let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name);
          let newName = renameFileWithUniqueName(fileObject.name);
          let newPath = path.join(__dirname, '../','public', 'uploads', newName);
          let DBPath = path.join('public', 'uploads', newName);
          await moveFile(uploadPath, newPath, fileObject);
          const selfie = await cloudinary.uploader.upload(DBPath);
          selfieURL = selfie.url;
          fs.unlinkSync(DBPath);
        }
        if(req.files.willPDF) {
          let fileObject = req.files.willPDF;
          let originalName = fileObject.name;
          let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name);
          let newName = renameFileWithUniqueName(fileObject.name);
          let newPath = path.join(__dirname, '../','public', 'uploads', newName);
          let DBPath = path.join('uploads', newName);
          await moveFile(uploadPath, newPath, fileObject);
          PDFURL = DBPath;
        }
    }

    const newBasicWill = new BasicWill({
      _id: new mongoose.Types.ObjectId(),
      requesterTitle: requesterTitle,
      requesterFname: requesterFname,
      requesterLname: requesterLname,
      requesterMname: requesterMname,
      requesterAdd: requesterAdd,
      requesterEmail: requesterEmail,
      requesterPhNo: requesterPhNo,
      requesterAddLine1: requesterAddLine1,
      requesterAddLine2: requesterAddLine2,
      requesterTown: requesterTown,
      requesterCountry: requesterCountry,
      requesterPostCode: requesterPostCode,
      promotionCode: promotionCode,
      willOwnerTitle: willOwnerTitle,
      willOwnerFname: willOwnerFname,
      willOwnerSurname: willOwnerSurname,
      willOwnerEmail: willOwnerEmail,
      willOwnerMname: willOwnerMname,
      willOwnerDob: willOwnerDob,
      willOwnerGender: willOwnerGender,
      willOwnerAddLine1: willOwnerAddLine1,
      willOwnerAddLine2: willOwnerAddLine2,
      willOwnerCity: willOwnerCity,
      willOwnerCountry: willOwnerCountry,
      willOwnerPostcode: willOwnerPostcode,
      willOwnerPhNo: willOwnerPhNo,
      executorName: executorName,
      executorEmailAdd: executorEmailAdd,
      executorPhoneNo: executorPhoneNo,
      executorAddLine1: executorAddLine1,
      executorAddLine2: executorAddLine2,
      executorCity: executorCity,
      executorCountry: executorCountry,
      storedWillAdd: storedWillAdd,
      additionalIns: additionalIns,
      lastRemDate: lastRemDate,
      nextRemDate: nextRemDate,
      createdWillPDF: createdWillPDF,
      discountCode: discountCode,
      discountAmount: discountAmount,
      requesterSelfie: selfieURL,
      willPDF: PDFURL,
      willStatus:"Active",
      dateCreated: moment().format('LL') ,
      willSource: willSource,
      createdBy: createdBy,
      willRefNo: willRefNo,
      willStorageRefNo: willStorageRefNo,
      userID: userID,
    });

    await newBasicWill.save();

    await Users.findOneAndUpdate({ _id: userID }, { activeWillID: newBasicWill._id });

    res.send({
      msg: "Success"
    })

  })

    async function uploadFile (req, file) {

        let fileObject = req.files.myFile;
        let originalName = fileObject.name;

        let uploadPath = path.join(__dirname, '../','public', 'uploads', fileObject.name);

        let newName = renameFileWithUniqueName(fileObject.name);
        let newPath = path.join(__dirname, '../','public', 'uploads', newName);

        let DBPath = path.join('uploads', newName);

        await moveFile(uploadPath, newPath, fileObject);

        return [originalName, newName];

    }

/* GET  basic will listing. */
route.get("/", async (req, res) => {
    try {
      const willData = await BasicWill.find();
      if (willData.length === 0) {
        res.status(200).send({
          success: true,
          data: willData,
          message: "No User registered"
        });
      } else {
        res.status(200).send({
          success: true,
          data: willData
        });
      }
    } catch (err) {
      res.status(503).send({
        success: false,
        message: "Server error"
      });
    }
  });

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



// store basic result search
route.post("/search", upload.single('reqSelfie'), async(req,res)=>{
  const {
willRegNo,
nameOfWillOwner,
willOwnerDob,
willOwnerPh,
relationship,
reasons,
reqTitle,
reqFname,
reqMname,
reqLname,
reqAdd,
reqEmail,
reqPhNo,
reqAddLine1,
reqAddLine2,
reqTown,
reqCountry,
reqPostCode,
promotionCode
} = req.body
const path = req.file && req.file.path
  const uniqueFileName = reqFname
  if(willRegNo!==""){
  searchedWill = await BasicWill.find({willRefNo: willRegNo })
  }
  else if(willOwnerPh!=="") {
     searchedWill = await BasicWill.find({ willOwnerPhNo: willOwnerPh})

  }

  try{

    const image = await cloudinary.uploader.upload(path, {
      public_id: `search/${uniqueFileName}`,
      tags: "search",
    })
    fs.unlinkSync(path);
    if(image){
  const newSearch = new Search({
   log: new Date(),
   paymentStatus:"Unpaid", ambCode:"", discountAmount:0,
  amountPaid:0,
matchedID: searchedWill[0]._id,
willRegNo,
nameOfWillOwner,
willOwnerDob,
willOwnerPh,
relationship,
reasons,
reqTitle,
reqFname,
reqMname,
reqLname,
reqAdd,
reqEmail,
reqPhNo,
reqAddLine1,
reqAddLine2,
reqTown,
reqCountry,
reqPostCode,
promotionCode,
    reqSelfie: image && image.url
  })
  const response = await newSearch.save();
  if(response){
    res.status(201).json({
      success: true,
      data: response,
      message: "Flyer Successfully added",
  });
 } else{
  res.status(501).json({
    success: false,
    data: [],
    message: "Error while adding flyer",
  });
 }
}
}
catch(error){
  res.status(501).json({
    success: false,
    data: [],
    message: error.message,
  });
}

})

// update search
route.patch("/updatesearch/:id", async(req,res)=>{
  var update = req.body;
  const {id} = req.params

  try {
    const result = await Search.updateOne({
      _id: id
    }, {$set:update})
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Search Res Updated"
      });
    } else {
      res.status(200).send({
        success: true,
        data: result
      });
    }

  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
})


/* GET  registered documents listing against each will */
route.get("/registeredDocuments/:id", async (req, res) => {
  const {id} = req.params
  try {
    const docData = await Document.find();
    const result = docData.filter(x=> x.activeWillId === id)
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No User registered"
      });
    } else {
      res.status(200).send({
        success: true,
        data: result
      });
    }

  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
});

/* GET each registered document  */
route.get("/documentdetails/:id", async (req, res) => {
  const {id} = req.params
  try {
    const docData = await Document.findById(id);
    //console.log(docData)
    if (docData.length === 0) {
      res.status(200).send({
        success: true,
        data: docData,
        message: "No Document registered"
      });
    } else {
      res.status(200).send({
        success: true,
        data: docData
      });
    }

  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
});

// delete a document
route.delete("/deleteDoc/:id",async(req,res)=>{
  const {id}= req.params;
  try {
    const result = await Document.deleteOne({_id: id});
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Document Deleted "
      });
    } else {
      res.status(200).send({
        success: true,
        data: result
      });
    }

  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }

})


// edit an exisiting document
route.patch("/edit/:id", async(req,res)=>{
  var update = req.body;
  const {id} = req.params

  try {
    const result = await Document.updateOne({
      _id: id
    }, {$set:update})
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Document Updated"
      });
    } else {
      res.status(200).send({
        success: true,
        data: result
      });
    }

  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
})

// post executor will req
route.post("/execwill", upload.single('requesterSelfie') ,async(req,res)=>{
  const {
    willRegNo,
    willOwnerName,
    willOwnerPhNo,
    willOwnerDOB,
    execName,
    execEmail,
    execPhNo,
    relationship,
    reasons,
    promotionCode,
    } = req.body
    const path = req.file && req.file.path
      const uniqueFileName = execName
      if(willRegNo!==""){
      searchedWill = await BasicWill.find({willRefNo: willRegNo })
      }
      else{
         searchedWill = await BasicWill.find({ willOwnerPhNo: willOwnerPh})

      }
      try{

        const image = await cloudinary.uploader.upload(path, {
          public_id: `search/${uniqueFileName}`,
          tags: "search",
        })
        fs.unlinkSync(path);
        if(image){
      const newExec = new ExecWill({
       date: new Date(),
       discountApplied:0,
      amountPaid:0,
    matchedID: searchedWill[0]._id,
    execName,
    execEmail,
    execPhNo,
    relationship,
    reasons,
    promotionCode,
    willOwnerName,
    willOwnerDOB,
    willOwnerPhNo,
    willRefNo:willRegNo,
        requesterSelfie: image && image.url
      })
      const response = await newExec.save();
      if(response){
        res.status(201).json({
          success: true,
          data: response,
          message: "Exec will searched",
      });
     } else{
      res.status(501).json({
        success: false,
        data: [],
        message: "Error while searching will",
      });
     }
    }
    }
    catch(error){
      res.status(501).json({
        success: false,
        data: [],
        message: error.message,
      });
    }


})

// update will reg after payment
route.patch("/updatewill/:id", async(req,res)=>{
  var update = req.body;
  const {id} = req.params

  try {
    const result = await BasicWill.updateOne({
      willRefNo: id
    }, {$set:update})
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Will Updated"
      });
    } else {
      res.status(200).send({
        success: true,
        data: result
      });
    }

  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
})

// update exec will after payment
route.patch("/updateexecwill/:id", async(req,res)=>{
  var update = req.body;
  const {id} = req.params

  try {
    const result = await ExecWill.updateOne({
      willRefNo: id
    }, {$set:update})
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Will Updated"
      });
    } else {
      res.status(200).send({
        success: true,
        data: result
      });
    }

  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
})

//post probate registry request
route.post("/probateregistry", upload.single('requesterSelfie') ,async(req,res)=>{
  const {
    willRegNo,
    willOwnerName,
    willOwnerPhNo,
    willOwnerDOB,
    reqName,
    reqEmail,
    reqPhNo,
    relationship,
    reasons,
    promotionCode,
    } = req.body
    const path = req.file && req.file.path
      const uniqueFileName = reqName
      if(willRegNo!==""){
      searchedWill = await BasicWill.find({willRefNo: willRegNo })
      }
      else{
         searchedWill = await BasicWill.find({ willOwnerPhNo: willOwnerPh})

      }
      try{

        const image = await cloudinary.uploader.upload(path, {
          public_id: `search/${uniqueFileName}`,
          tags: "search",
        })
        fs.unlinkSync(path);
        if(image){
      const newProbReg = new probateReg({
       date: new Date(),
       discountApplied:0,
      amountPaid:0,
    matchedID: searchedWill[0]._id,
    reqName,
    reqEmail,
    reqPhNo,
    relationship,
    reasons,
    promotionCode,
    willOwnerName,
    willOwnerDOB,
    willOwnerPhNo,
    willRefNo:willRegNo,
        requesterSelfie: image && image.url
      })
      const response = await newProbReg.save();
      if(response){
        res.status(201).json({
          success: true,
          data: response,
          message: "Prbate registry stored",
      });
     } else{
      res.status(501).json({
        success: false,
        data: [],
        message: "Error while requesting probate registry",
      });
     }
    }
    }
    catch(error){
      res.status(501).json({
        success: false,
        data: [],
        message: error.message,
      });
    }


})


// update prob will after payment
route.patch("/updateprobwill/:id", async(req,res)=>{
  var update = req.body;
  const {id} = req.params

  try {
    const result = await probateReg.updateOne({
      willRefNo: id
    }, {$set:update})
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Will Updated"
      });
    } else {
      res.status(200).send({
        success: true,
        data: result
      });
    }

  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
})


// find will by will id
route.get("/find/:id", async (req, res) => {
  const {id} = req.params
  try {
    const willData = await BasicWill.find({willRefNo: id});
    if (willData.length === 0) {
      res.status(200).send({
        success: true,
        data: willData,
        message: "No Will"
      });
    } else {
      res.status(200).send({
        success: true,
        data: willData
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = route;
