
// const { verify } = require('jsonwebtoken');
const koneksi = require('../config/database');


module.exports = {
    create: (data, callBack) => {
      koneksi.query(
        `insert into user(nama,wa, username,password,otp) 
                  values(?,?,?,?,?)`,
        [
          data.nama,
          data.wa,
          data.username,
          data.password,
          data.otp,
         
        ],
        (error, results, fields) => {
          if (error) {
           return callBack(error);
          }
          return callBack(null, results);
        }
      );
    },
    getUsers: callBack => {
      koneksi.query(
        `select id,nama,wa,username,password from user`,
        [],
        (error, results, fields) => {
          if (error) {
            callBack(error);
          }
          return callBack(null, results);
        }
      );
    },
    getUserByUsername: (username, callBack) => {
      koneksi.query(
        `select * from user where username = ?`,
        [username],
        (error, results, fields) => {
          if (error) {
            callBack(error);
          }
          return callBack(null, results[0]);
        }
      );
    },
    isUserNameInUse: (username) => {
      return new Promise((resolve, reject) => {
        koneksi.query( `select count(*) as total from user where username = ?`, [username], function (error, results, fields) {
            if(!error){
                console.log("User COUNT : "+results[0].total);
                return resolve(results[0].total > 0);
            } else {
                return reject(new Error('Database error!!'));
            }
          }
        );
    });
  },
  getWa: (wa, callBack) => {
    koneksi.query(
      `select * from user where wa = ?`,
      [wa],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  isWaInUse: (wa) => {
    return new Promise((resolve, reject) => {
      koneksi.query( `select count(*) as total from user where wa = ?`, [wa], function (error, results, fields) {
          if(!error){
              console.log("Whatsapp COUNT : "+results[0].total);
              return resolve(results[0].total > 0);
          } else {
              return reject(new Error('Database error!!'));
          }
        }
      );
  });
},
}
