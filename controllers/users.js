const bcrypt = require("bcryptjs");
const { create ,getUsers, getUserByUsername, getWa} = require("../models/user_models");
const { sign } = require("jsonwebtoken");
const { compare } = require("bcrypt");
const koneksi = require("../config/database");

module.exports = {
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        status: "success",
        data: results,
      });
    });
  },
  // getUsername: (req, res) => {
  //   const body = req.body;
  //   getUserByUsername(body.username,(err, results) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(400).json({
  //         message: "Failed",
  //         data: results,
  //       });;
  //     }
  //     return res.status(200).json({
  //       message: "Success",
  //       data: results,
  //     });
  //   });
  // },
  login: (req, res) => {
    const body = req.body;
    getUserByUsername(body.username, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.status(400).json({
          status: "Failed",
          message: "Invalid username"
        });
      }
      const result = bcrypt.compareSync(body.password, results.password);
      if(result){
        if(results.verified==0){
          return res.status(400).json({
            status: "Failed",
            message: "Your account has not been activated"
          });
        }
        results.password = undefined;
        const jwtoken = sign({result:results},"secret",{
        })
        return res.status(200).json({
          status:"Success",
          message:"Login sukses",
          token:jwtoken
        })
       
      }
      else{
        return res.status(400).json({
          status:"Failed",
          message:"Invalid password"
          
        })
      }
      
    });
  },

  verifyOTP: (req, res) => {
    const body = req.body;
    getWa(body.wa, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.status(400).json({
          status: "Failed",
          message: "Invalid wa"
        });
      }
     else if(results.otp == body.otp || results.otp==0){
      if(results.otp==0){  
        return res.status(400).json({
          status: "Failed",
          message: "Your otp are expired. Please send request to send back otp!"
          
        })
      }
      koneksi.query( `update user set verified = 1`);
      return res.status(400).json({
        status:"Success",
        message:"Your registration successfully",

      })
     }
      else{
        
        return res.status(400).json({
          status: "Failed",
          message: "Invalid OTP"
          
        })
      }
      
    });
  },
}

// const express = require('express');
// const router = express.Router();
// const db  = require('../config/database.js');
// const { signupValidation } = require('../utils/validation.js');
// const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// router.post('/register', signupValidation, (req, res, next) => {
//   db.query(
//     `SELECT * FROM user WHERE LOWER(email) = LOWER(${db.escape(
//       req.body.email
//     )});`,
//     (err, result) => {
//       if (result.length) {
//         return res.status(409).send({
//           msg: 'This user is already in use!'
//         });
//       } else {
//         // username is available
//         bcrypt.hash(req.body.password, 10, (err, hash) => {
//           if (err) {
//             return res.status(500).send({
//               msg: err
//             });
//           } else {
//             // has hashed pw => add to database
//             db.query(
//               `INSERT INTO user (nama, wa, email, password) VALUES ('${req.body.nama}','${req.body.wa}' ${db.escape(
//                 req.body.email)}, ${db.escape(hash)})`,
//               (err, result) => {
//                 if (err) {
//                   throw err;
//                   return res.status(400).send({
//                     msg: err
//                   });
//                 }
//                 return res.status(201).send({
//                   msg: 'The user has been registerd with us!'
//                 });
//               }
//             );
//           }
//         });
//       }
//     }
//   );
// });
// module.exports = router;