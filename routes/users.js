var express = require("express");
var route = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var voucher_codes = require("voucher-code-generator");
const moment = require("moment");
var cloudinary = require("cloudinary").v2;
const multer = require("multer");
var fs = require("fs");
const nodemailer = require("nodemailer");
var path = require("path");

const User = require("../models/users");
const Products = require("../models/products");
const Vouchers = require("../models/voucher");
const Document = require("../models/regDocument");
const Discount = require("../models/discount");
const Commission = require("../models/commission");
const BalanceReq = require("../models/balanceRequest");
const Sales = require("../models/sales");
const transactions = require("../models/transactions");

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

const upload = multer({ storage: storage, fileFilter: fileFilter });

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
  let fileObject = req.files.selfie;
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

/* GET users listing. */
route.get("/", async (req, res) => {
  try {
    const userData = await User.find();
    if (userData.length === 0) {
      res.status(200).send({
        success: true,
        data: userData,
        message: "No User registered",
      });
    } else {
      res.status(200).send({
        success: true,
        data: userData,
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

//Login user route
route.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  try {
    const getUser = await User.find({
      email,
      password,
    });

    if (getUser[0].status === "Disable") {
      res.status(400).send({
        success: false,
        message: "User is disabled!",
      });
    } else {
      if (getUser.length > 0) {
        let token = jwt.sign(
          {
            id: getUser[0]._id,
            name: getUser[0].name,
            email: getUser[0].email,
            isAdmin: getUser[0].isAdmin,
            type: getUser[0].type,
            code: getUser[0].code,
          },
          "secret_key"
        );
        res.header("auth-token", token).status(200).send({
          data: getUser,
          message: "Successfully login",
          token,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "User not found!",
        });
      }
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

//Register the user route
route.post("/register/:role", async (req, res) => {
  const { email, password, phoneNo, add1, add2, town, country, name } = req.body;
  console.log(email);
  const { role } = req.params;

  let file;
  if (req.files) {
    file = await uploadFile(req);
  }

  //const path = req.file && req.file.path;

  const uniqueFileName = phoneNo;
  const code = voucher_codes.generate({
    length: 5,
    count: 1,
  });

  try {
    const image = await cloudinary.uploader.upload(
      "public/uploads/" + file[1],
      {
        public_id: `selfie/${uniqueFileName}`,
        tags: "selfie",
      }
    );

    fs.unlinkSync("public/uploads/" + file[1]);

    if (image) {
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        password,
        phoneNo,
        add1,
        add2,
        town,
        country,
        name,
        selfie: image && image.url,
        type: role,
        isAdmin: false,
        status: "Active",
        code: code[0],
      });
      const response = await newUser.save();
      if (response) {
        res.status(201).json({
          success: true,
          data: response,
          message: "User Successfully added",
        });
      } else {
        res.status(501).json({
          success: false,
          data: [],
          message: "Error while registering user",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({
      success: false,
      data: [],
      message: error.message,
    });
  }
});

// disable user

// register will document
route.post("/register-document", async (req, res) => {
  const {
    docDate,
    docName,
    docType,
    docNo,
    docDesc,
    docLoc,
    activeWillId,
    issuer,
  } = req.body;

  const newDocument = new Document({
    _id: new mongoose.Types.ObjectId(),
    activeWillId,
    docDate,
    docName,
    docType,
    docNo,
    docDesc,
    docLoc,
    issuer,
  });

  newDocument
    .save()
    .then((response) => {
      res.status(200).send({
        success: true,
        message: "Successfully Registered",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "error registering document",
        Error: err,
      });
    });
});

// setup discount
route.post("/setup-discount", async (req, res) => {
  const {
    type,
    fromNoQty,
    toNoQty,
    discountPercentage,
    commissionPercentage,
    amount,
    updatedBy,
  } = req.body;
  const code = voucher_codes.generate({
    length: 8,
    count: 1,
  });
  const newDiscount = new Discount({
    type,
    fromNoQty,
    toNoQty,
    discountPercentage,
    commissionPercentage,
    discountCode: code[0],
    amount,
    updatedBy,
    date: moment().format("LL"),
  });
  newDiscount
    .save()
    .then((response) => {
      res.status(200).send({
        success: true,
        message: "Discount Added",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "Discount failed",
        Error: err,
      });
    });
});

// get discounts listing
route.get("/discounts", async (req, res) => {
  try {
    const discounts = await Discount.find();
    if (discounts.length === 0) {
      res.status(200).send({
        success: true,
        data: discounts,
        message: "No discounts to show",
      });
    } else {
      res.status(200).send({
        success: true,
        data: discounts,
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});
// disable users
route.patch("/disable/:id", async (req, res) => {
  const { id } = req.params;
  let lastUpdatedBy = req.body.lastUpdatedBy;

  try {
    const result = await User.updateOne(
      { _id: id },
      { $set: { status: "Disable", lastUpdatedBy: lastUpdatedBy, lastUpdateDate: moment().format('LL') } }
    );
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No User disabled",
      });
    } else {
      res.status(200).send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// activate user
route.patch("/activate/:id", async (req, res) => {
  const { id } = req.params;
  let lastUpdatedBy = req.body.lastUpdatedBy;

  try {
    const result = await User.updateOne(
      { _id: id },
      { $set: { status: "Activate", lastUpdatedBy: lastUpdatedBy, lastUpdateDate: moment().format('LL') } }
    );
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No User disabled",
      });
    } else {
      res.status(200).send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// generate vouchers
route.post("/vouchers", async (req, res) => {
  const { userID, b2bClient } = req.body;

  const codes = voucher_codes.generate({
    length: 8,
    count: 1,
  });

  const newVoucher = new Vouchers({
    date: moment().format("LL"),
    userID: userID,
    voucherCode: codes[0],
    status: "Not Used",
    b2bClient: b2bClient,
    emailTo: "",
  });

  newVoucher
    .save()
    .then((response) => {
      res.status(200).send({
        success: true,
        message: "Voucher Created",
        data: response,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: false,
        message: "Voucher creation failed",
        Error: err,
      });
    });
});

// post transaction
route.post("/transaction", async (req, res) => {
  const {
    userID,
    discountID,
    paymentNumber,
    quantity,
    b2bClient,
    processedBy,
    amount,
  } = req.body;

  const invoice = voucher_codes.generate({
    length: 5,
    count: 1,
    charset: "0123456789",
  });

  const newTransaction = new transactions({
    date: moment().format("LL"),
    userID: userID,
    discountID,
    paymentNumber: paymentNumber,
    quantity: quantity,
    invoiceID: invoice[0],
    b2bClient: b2bClient,
    amount: amount,
    processedBy: processedBy,
  });
  newTransaction
    .save()
    .then((response) => {
      res.status(200).send({
        success: true,
        message: "Transaction Added",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "Transaction failed",
        Error: err,
      });
    });
});

route.post("/add_payment_number_to_transaction", async (req, res) => {

  // Part 1
  let transactionID = req.body.transactionID;
  let paymentNumber = req.body.paymentNumber;
  let processedBy = req.body.processedBy;


  // Part 2
  await transactions.updateOne({_id: transactionID}, {paymentNumber: paymentNumber, processedBy: processedBy});

  let transactionToProcess = await transactions.findOne({_id: transactionID});

  const codes = voucher_codes.generate({
    length: 8,
    count: transactionToProcess.quantity,
  });

  for(let i = 0; i < transactionToProcess.quantity; i++) {
    const newVoucher = new Vouchers({
      date: moment().format("LL"),
      userID: transactionToProcess.userID,
      voucherCode: codes[i],
      status: "Not Used",
      b2bClient: transactionToProcess.b2bClient,
      emailTo: "",
      paymentNumber: transactionToProcess.paymentNumber
    });
    await newVoucher.save();
  }

  // Part 3
  const code = voucher_codes.generate({
    length: 5,
    count: 1,
    charset: "0123456789",
  });
  const newSales = new Sales({
    salesID: code[0],
    date: moment().format("LL"),
    productName: "Employee Voucher",
    transactionID: transactionToProcess.paymentNumber,
    amount: transactionToProcess.amount,
    userID: processedBy,
  });
  newSales.save();

  // Part 4

  res.send({
    salesID: code[0]
  })
})

route.post("/record_sale_of_b2b_client_voucher", async (req, res) => {
  let {transactionID, amount, userID} = req.body;
  const code = voucher_codes.generate({
    length: 5,
    count: 1,
    charset: "0123456789",
  });
  const newSales = new Sales({
    salesID: code[0],
    date: moment().format("LL"),
    productName: "Employee Voucher",
    transactionID: transactionID,
    amount: amount,
    userID: userID,
  });
  newSales.save();
  res.send({
    salesID: code[0]
  })
})


// get specific voucher detail
route.get("/voucherdetail/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await Vouchers.findById(id);
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Voucher registered",
      });
    } else {
      res.status(200).send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// get vouchers listing
route.get("/voucherslist", async (req, res) => {
  try {
    const vouchers = await Vouchers.find();
    if (vouchers.length === 0) {
      res.status(200).send({
        success: true,
        data: vouchers,
        message: "No vouchers to show",
      });
    } else {
      res.status(200).send({
        success: true,
        data: vouchers,
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

route.post("/get_user_email_by_id", async (req, res) => {
  let userID = req.body.userID;
  // console.log(typeof(userID))
  let user = await User.findOne({_id: userID});
  res.send({
    name: user.email
  });
});

route.post("/match_promo_code", async (req, res) => {
  let promoCode = req.body.promoCode;

  let user = await User.findOne({code: promoCode});

  res.send({
    user: user
  });
  
});

// get b2b voucher transactions
route.get("/transactionlist", async (req, res) => {
  try {
    const transaction = await transactions.find();
    if (transaction.length === 0) {
      res.status(200).send({
        success: true,
        data: transaction,
        message: "No transaction to show",
      });
    } else {
      res.status(200).send({
        success: true,
        data: transaction,
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// add products
route.post("/addproduct", async (req, res) => {
  const { name, basePrice, updatedBy } = req.body;

  const newProduct = new Products({
    name,
    basePrice,
    updatedBy,
  });
  newProduct
    .save()
    .then((response) => {
      res.status(200).send({
        success: true,
        message: "Product Created",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "Error: failed",
        Error: err,
      });
    });
});

// update pricing of products
route.patch("/updateproduct", async (req, res) => {
  var { product, amount } = req.body;
  console.log(req.body);

  try {
    const result = await Products.updateOne(
      {
        name: product,
      },
      {
        $set: {
          basePrice: amount,
        },
      }
    );
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Product Updated",
      });
    } else {
      res.status(200).send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// get products listing
route.get("/products", async (req, res) => {
  try {
    const products = await Products.find();
    if (products.length === 0) {
      res.status(200).send({
        success: true,
        data: products,
        message: "No products to show",
      });
    } else {
      res.status(200).send({
        success: true,
        data: products,
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

route.post("/get_discount_commision_of_organisational_user", async (req, res) => {
    let d = await Discount.findOne({type: "Organisation User B2B Discount"});
    console.log(d);
    res.send({
      discountAndCommision: d
    })
})

// invoice generation by admin
/*route.post("/generate-invoice",async(req,res)=>{
  const { b2bClient, noOfVoucher , amount, processedBy} = req.body
  console.log(req.body)
  const codes = voucher_codes.generate({
    length: 4,
    count: 1,
    charset: "0123456789"
});
const codes1 = voucher_codes.generate({
  length: 8,
  count: 1,
});
  const newInvoice = new Invoice({
    invoiceID: codes[0],
    date: moment().format('LL'),
    b2bClient: b2bClient,
    amount: amount,
    processedBy: processedBy,
    quantity: noOfVoucher,
    status: "Not Used",
    paymentID:"",
    voucherCode: codes1[0]

  })
  newInvoice
  .save()
  .then(response => {
    res.status(200).send({
      success: true,
      message: "Product Created",
      data: response
    });
  })
  .catch(err => {
    res.status(400).send({
      success: false,
      message: "Error: failed",
      Error: err
    });
  });
})

// get invoice listing
/*route.get("/invoice",async(req,res)=>{
  try {
    const invoice = await Invoice.find();
    if (invoice.length === 0) {
      res.status(200).send({
        success: true,
        data: invoice,
        message: "No products to show"
      });
    } else {
      res.status(200).send({
        success: true,
        data: invoice
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
})
*/

// add commission
route.post("/generate-commission", async (req, res) => {
  const {
    willAmbID,
    userID,
    commissionEarned,
    commissionBalance,
    productName,
    userName,
    salesID,
  } = req.body;

  const newCommission = new Commission({
    date: moment().format("LL"),
    willAmbID: willAmbID,
    userID: userID,
    commissionEarned: commissionEarned,
    commissionBalance: commissionBalance,
    commissionStatus: "Unpaid",
    balanceReq: "",
    productName: productName,
    userName: userName,
    salesID: salesID,
  });
  newCommission
    .save()
    .then((response) => {
      res.status(200).send({
        success: true,
        message: "Commission Added",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "Error: failed",
        Error: err,
      });
    });
});

// get commission listing
route.get("/commission/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Commission.find({ willAmbID: id });
    if (products.length === 0) {
      res.status(200).send({
        success: true,
        data: products,
        message: "No commission to show",
      });
    } else {
      res.status(200).send({
        success: true,
        data: products,
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// update commission table
route.patch("/commissions/:id", async (req, res) => {
  const { id } = req.params;
  var { balanceReqID } = req.body;

  try {
    const result = await Commission.updateMany(
      {
        willAmbID: id,
        commissionStatus: "Unpaid",
      },
      {
        $set: {
          commissionStatus: "Pending Payment",
          balanceReq: balanceReqID,
        },
      }
    );
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Invoice Updated",
      });
    } else {
      res.status(200).send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// generate balance req

route.post("/generate-balancereq", async (req, res) => {
  const { userName, bankName, bankAccountName, commissionBalance, bankAccNo } =
    req.body;

  const newbalanceReq = new BalanceReq({
    reqDate: moment().format("LL"),
    userName: userName,
    userID: userID,
    bankName: bankName,
    bankAccountName: bankAccountName,
    bankAccNo: bankAccNo,
    commissionBalance: commissionBalance,
    reqStatus: "Unpaid",
  });
  newbalanceReq
    .save()
    .then((response) => {
      res.status(200).send({
        success: true,
        message: "Balance Req Added",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "Error: failed",
        Error: err,
      });
    });
});

//update invoice status
route.patch("/invoice/:id", async (req, res) => {
  const { id } = req.params;
  var { paymentID } = req.body;
  try {
    const result = await transactions.updateOne(
      {
        invoiceID: id,
      },
      {
        $set: {
          paymentNumber: paymentID,
        },
      }
    );
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Invoice Updated",
      });
    } else {
      res.status(200).send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// update user
route.patch("/editprofile/:id", async (req, res) => {
  const { id } = req.params;

  var update = req.body;
  console.log(update);
  try {
    const result = await User.updateOne(
      {
        _id: id,
      },
      { $set: update }
    );
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Profile Updated",
      });
    } else {
      res.status(200).send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// add sales
route.post("/sales", async (req, res) => {
  const { product, amount, transactionID, promoCode } = req.body;
  const code = voucher_codes.generate({
    length: 5,
    count: 1,
    charset: "0123456789",
  });
  const newSales = new Sales({
    salesID: code[0],
    date: moment().format("LL"),
    productName: product,
    amount,
    transactionID,
    promoCode,
  });
  newSales
    .save()
    .then((response) => {
      res.status(200).send({
        success: true,
        message: "Sale Added",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: "Sale failed",
        Error: err,
      });
    });
});

// get discounts listing
route.get("/discounts", async (req, res) => {
  try {
    const discounts = await Discount.find();
    if (discounts.length === 0) {
      res.status(200).send({
        success: true,
        data: discounts,
        message: "No discounts to show",
      });
    } else {
      res.status(200).send({
        success: true,
        data: discounts,
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// get all sales

route.get("/sales", async (req, res) => {
  try {
    const sales = await Sales.find();
    if (sales.length === 0) {
      res.status(200).send({
        success: true,
        data: sales,
        message: "No sales to show",
      });
    } else {
      res.status(200).send({
        success: true,
        data: sales,
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// email voucher
route.patch("/voucheremail/:id", async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const result = await Vouchers.updateOne(
      {
        _id: id,
      },
      {
        $push: {
          emailTo: email,
        },
      }
    );
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "Flyer updated",
      });
    } else {
      res.status(200).send({
        success: true,
        data: result,
      });
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "fa17-bcs-081@cuilahore.edu.pk",
          pass: "FA17-BCS-081",
        },
      });
      let mailOption = {
        from: "fa17-bcs-081@cuilahore.edu.pk",
        to: email,
        subject: "form files",
        text: "An Email from will project",
      };
      //send email
      transporter.sendMail(mailOption, function (err, res) {
        if (err) {
          console.log("error ", err);
        } else {
          console.log("Email sent");
        }
      });
    }
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// delete discounts
route.delete("/delete-discount/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Discount.deleteOne({ _id: id });
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Discount Deleted ",
      });
    } else {
      res.status(200).send({
        success: true,
        data: result,
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

// edit discounts

route.patch("/editdiscount/:code", async (req, res) => {
  const { code } = req.params;

  var update = req.body;
  try {
    const result = await Discount.updateOne(
      {
        discountCode: code,
      },
      { $set: update }
    );
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Discount Updated",
      });
    } else {
      res.status(200).send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error",
    });
  }
});

route.post("/getindividualuserdetails", async (req, res) => {
  let userID = req.body.userID;

  let userDetails = await User.findOne({
    _id: userID,
  });

  res.send({
    userDetails: userDetails,
  });
});

route.post("/updateindividualuser", async (req, res) => {
  const filter = { _id: req.body.user.userID };

  const update = {
    email: req.body.user.email,
    name: req.body.user.name,
    password: req.body.user.password,
    phoneNo: req.body.user.phoneNo,
    town: req.body.user.town,
    add1: req.body.user.add1,
    add2: req.body.user.add2,
    country: req.body.user.country,
  };

  await User.findOneAndUpdate(filter, update);

  res.send({ msg: "Success" });
});

route.post("/get_single_transaction_detail_from_id", async (req, res) => {
  let transactionID = req.body.tID;
  let data = await transactions.findOne({_id: transactionID});
  res.send({
    transactionData: data
  })
})

route.post("/send_voucher_code", async (req, res) => {

 let { email, code } = req.body;

 var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'te807722@gmail.com',
      pass: 'ABC!@#456'
    } 
  });

  var mailOptions = {
    from: 'te807722@gmail.com',
    to: email,
    subject: 'Voucher Code',
    text: 'Your Voucher Code is ' + code
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
    else {
      console.log('Email sent: ' + info.response);
      res.send({
        status: 200
      })
    }
  });

})

route.post("/change_voucher_status", async (req, res) => {
  let { code, status, name, email } = req.body;
  await Vouchers.findOneAndUpdate({ voucherCode: code }, { status: status });

  if(status === "Emailed") {
    await Vouchers.findOneAndUpdate({ voucherCode: code }, { name : name , updateDate : moment().format('LL'), emailedTo: email });
  }
  else if(status === "Printed") {
    await Vouchers.findOneAndUpdate({ voucherCode: code }, { name : "" , updateDate : moment().format('LL'), emailedTo: "" });
  }

  res.send({
    status: 200
  });
})

route.post("/getuserdetails", async (req, res) => {
  let { userID } = req.body;
  let user = await User.findOne({_id : userID });
  res.send({
    userDetails: user
  })
});

route.post("/updateuser", async (req, res) => {

  let { userID, name, email, password, add1, add2, town, phoneNo, country } = req.body;

  let update = {
    name: name,
    email: email,
    password: password,
    add1: add1,
    add2: add2,
    town: town,
    phoneNo: phoneNo,
    country: country
  }

  console.log(update);

  await User.findOneAndUpdate({_id:userID}, update);

  res.send({
    status: 200
  });

});


module.exports = route;
