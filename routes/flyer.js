
const mongoose = require("mongoose");
const express = require("express");
var route = express.Router();
const Flyer = require('../models/Flyer')
const multer = require("multer");
var fs = require('fs');
var cloudinary = require('cloudinary').v2;
var path = require('path');
var Jimp = require("jimp");
var moment = require('moment');

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

  function moveFile(uploadPath, newPath, fileObject) {
    return new Promise((resolve, reject) => {
      fileObject.mv(uploadPath, function (err) {
        if (err) reject(err);
        else fs.renameSync(uploadPath, newPath);
        resolve();
      });
    });
  }

  async function uploadFile(req) {

    let fileObject = req.files.img;
    let originalName = fileObject.name;
  
    let uploadPath = path.join(
      __dirname,
      "../",
      "public",
      "uploads",
      fileObject.name
    );
  
    let newName = fileObject.name + ".jpg";
    let newPath = path.join(__dirname, "../", "public", "uploads", newName);
  
    let DBPath = path.join("uploads", newName);
  
    await moveFile(uploadPath, newPath, fileObject);
  
    return [originalName, newName];
  }

  // upload flyer
  /// CHANGE THIS ROUTE
  route.post("/uploadFlyer", async (req, res) => {

    const { name , description, type, uploadedBy } = req.body;

    let file;
    if (req.files) {      
      file = await uploadFile(req);
    }

    // const path = req.file && req.file.path
    const uniqueFileName = file[1];
    // console.log(path)
    // var imageCaption = 'Image caption';
    // var loadedImage;

    // Jimp.read(path)
    //   .then(function (image) {
    //     loadedImage = image;
    //     return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    //   })
    //   .then(function (font) {
    //     loadedImage.print(font, 10, 10, imageCaption).write(path);
                   
    // })
    // .catch(function (err) {
    //     console.error(err);
    // });

    try {

      const image = await cloudinary.uploader.upload(
        "public/uploads/" + file[1],
        {
          public_id: `flyer/${uniqueFileName}`,
          tags: "flyer",
        }
      );

      // const image = await cloudinary.uploader.upload(path, {
      //   public_id: `flyer/${uniqueFileName}`,
      //   tags: "flyer",
      // })
      // fs.unlinkSync(path);
      if(image) {
        const newFlyer = new Flyer({
          _id: new mongoose.Types.ObjectId(),
          name,
          description,
          img: image && image.url,  
          type,
          emailedTo:"",
          uploadedBy,
          createdOn: moment().format('LL')
        });
        const response = await newFlyer.save();
        if(response) {
          res.status(201).json({
            success: true,
            data: response,
            message: "Flyer Successfully added",
          });
        }
        else {
          res.status(501).json({
            success: false,
            data: [],
            message: "Error while adding flyer",
          });
        }
      }
    }

    catch (error) {
      res.status(501).json({
        success: false,
        data: [],
        message: error.message,
      });
    }
  })
  

// get route flyer
route.get("/",  async (req, res) => {
  try {
    const flyerData = await Flyer.find();
    if (flyerData.length === 0) {
      res.status(200).send({
        success: true,
        data: flyerData,
        message: "No Flyer uploaded"
      });
    } else {
      res.status(200).send({
        success: true,
        data: flyerData
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
});

// delete flyer
route.delete("/delete/:id", async(req,res)=>{
  const {id} = req.params
  try {
    const result = await Flyer.deleteOne({_id: id});
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Flyer Deleted "
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




// test jimp module
route.get("/test", async(req,res)=>{
  var fileName = './uploads/audio.png';
var imageCaption = 'Image caption';
var loadedImage;

Jimp.read(fileName)
    .then(function (image) {
        loadedImage = image;
        return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    })
    .then(function (font) {
        loadedImage.print(font, 10, 10, imageCaption)
                   .write(fileName);

    })
    .catch(function (err) {
        console.error(err);
    });
})


// email flyer
// email voucher
route.patch("/flyeremail/:id", async(req,res)=>{
  const {id} = req.params
  const {email} = req.body
  try {
    const result = await Flyer.updateOne({
     _id: id,
    },{$push:{
      emailTo: email
      
    }})
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "Flyer updated"
      });
    } else {
      res.status(200).send({
        success: true,
        data: result
      });
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'fa17-bcs-081@cuilahore.edu.pk',
          pass: 'FA17-BCS-081'
        }
      });
      let mailOption={
        from: 'fa17-bcs-081@cuilahore.edu.pk',
        to: email,
        subject: 'form files',
        text:"An Email from will project"
    
    }
      //send email
transporter.sendMail(mailOption,function(err,res){
  if(err){
      console.log("error ",err)
  }
  else{
      console.log("Email sent")
  }
})

    }
    
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
})

// edit flyer
route.patch("/editflyer/:id",async(req,res)=>{
  const {id} = req.params
  
  var update = req.body;
  try {
    const result = await Flyer.updateOne({
      _id: id
    }, {$set:update})
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Flyer Updated"
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

module.exports = route;