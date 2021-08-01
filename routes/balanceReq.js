var express = require('express');
var route = express.Router();
const mongoose = require("mongoose");
const BalanceReq = require("../models/balanceRequest")
const moment = require('moment')
var voucher_codes = require('voucher-code-generator');
const Commission = require('../models/commission')
const User = require('../models/users')

//gnerate balance 
route.post("/generateBalance", async (req, res) => {
    
    const {   user , bankName, bankAccountName, bankAccNo, commissionBalance} = req.body;

    const code = voucher_codes.generate({
      length: 5,
      count: 1,
      charset:"0123456789"
    });

    const userID = await User.findOne({_id: user })
    .populate("userID", { name: 1 }).then((user)=>{ return user})

    console.log("XXX");
    console.log(userID);

    const newBalanceReq = new BalanceReq({
      
      _id: new mongoose.Types.ObjectId(),
      balanceReqID: code[0],
      reqDate: moment().format('LL'),
      reqStatus: "Pending",
      userName: userID.name,
      userType: userID.type,
      bankAccNo,
      bankAccountName,
      bankName,
      commissionBalance,
      refNo: "",
      clearedBy:""
  
    });
  
    newBalanceReq
      .save()
      .then(response => {
        res.status(200).send({
          success: true,
          message: "Balance req generated",
          data: response
        });
      })
      .catch(err => {
        res.status(400).send({
          success: false,
          message: "Balane already registered",
          Error: err
        });
      });
  });

// get balance requests
route.get("/balancerequests", async(req,res)=>{
  try {
    const balance = await BalanceReq.find();
    if (balance.length === 0) {
      res.status(200).send({
        success: true,
        data: balance,
        message: "No balance to show"
      });
    } else {
      res.status(200).send({
        success: true,
        data: balance
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }

}
)

// update commission table
route.patch("/commissions/:id",async(req,res)=>{
  const {id} = req.params
  //var {balanceReqID} = req.body;
  
  try {
    const result = await Commission.updateMany({
     balanceReq: id,
     commissionStatus:"Pending Payment"
    },{$set:{
      commissionStatus: "Paid",
      
      
    }})
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Request Updated"
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

// updte balance req id status

route.patch("/balance/:id",async(req,res)=>{
  const {id} = req.params
  //var {balanceReqID} = req.body;
  const {refNo, clearedBy} = req.body
  console.log(clearedBy)
  try {
    const result = await BalanceReq.updateMany({
     balanceReqID: id,
     reqStatus:"Pending"
    },{$set:{
      reqStatus: "Paid",
      refNo,
      clearedBy,
      dateOfClearance: moment().format('LL')
      
    }})
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Request Updated"
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