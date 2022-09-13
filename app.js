const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const express = require('express');
const app = express();
const {  check, validationResult,} = require('express-validator');
// const { Client,MessageMedia, LocalAuth } = require('whatsapp-web.js');
const bcrypt = require("bcryptjs");
const { create , isUserNameInUse, isWaInUse,} = require("./models/user_models");

const { phoneNumberFormatter } = require('./helper/formatter');
const router = require('./routes/route')
const cors = require('cors');
const server = http.createServer(app);
require("@adiwajshing/baileys")
const io = socketIO(server);
const port = process.env.PORT || 8088;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/",router);
app.use(cors())



const {
	default: makeWASocket,
   
	// BufferJSON,
	// initInMemoryKeyStore,
	// makeWALegacySocket,
    DisconnectReason,
	// AnyMessageContent,
        makeInMemoryStore,
	useSingleFileAuthState,
    extractMessageContent,
	// delay
    // useSingleFileLegacyAuthState
} = require("@adiwajshing/baileys")
// const store = makeInMemoryStore({});

// setInterval(() => store.writeToFile('./dataStore.json'), 10_000);
// store.readFromFile('./dataStore.json');

// const contactsList = store.contacts;

// console.log('Contact list: ', contactsList);

const { Boom } = require('@hapi/boom');

const { off } = require('process');
const { state, saveState } = useSingleFileAuthState('./auth_info.json');
const store = makeInMemoryStore({});

setInterval(() => store.writeToFile('./dataStore.json'), 10_000);


    async function startBot(){
      const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: false, 
        auth: state
    })
    sock.ev.on("connection.update", (update) => {
        console.log(update);
        const { connection, lastDisconnect ,qr} = update;
        if (qr) {
          io.on('connection', function(socket){
            socket.emit('message', 'Connecting..');
          qrcode.toDataURL(qr, (err, url) => {
            socket.emit("qr", url);
            socket.emit("message", "QR Code received, scan please!");
          });
        })};
        if (connection === "close") {
          const shouldReconnect = (lastDisconnect.error =
            Boom?.output?.statusCode !== DisconnectReason.loggedOut);
          console.log(
            "connection closed due to ",
            lastDisconnect.error,
            ", reconnecting ",
            shouldReconnect
          );
          // reconnect if not logged out
          if (shouldReconnect) {
            startBot();
          }
       
          
        } else if (connection === "open") {
          console.log("opened connection");
        }
      }); 
      // sock.ev.on("contacts.upsert", async (contacts) => {
      //   console.log(contacts);
      // });
      sock.ev.on("creds.update", saveState);
      store.bind(sock.ev);
            
      store.readFromFile('./dataStore.json');

      const contactsList = store.contacts;

      console.log('Contact list: ', contactsList);
    
      app.post('/api/register', [
        check('nama','name cannot empty').notEmpty(),
        check('wa').notEmpty().withMessage('wa cannot empty')
                    .custom(async wa => {
                        const value = await isWaInUse(wa);
                        if (value) {
                            throw new Error('Whassapp Number is already exists!!!');
                        }
                        else{
                            return value
                        }
                    }),
        check('username').notEmpty().withMessage('username cannot empty' )
                        .custom(async username => {
                            const value = await isUserNameInUse(username);
                            if (value) {
                                throw new Error('Username is already exists!!!');
                            }
                            else{
                                return value
                            }
                        }),
        check('password').notEmpty().withMessage('password cannot empty')
                        .isLength({min:8}).withMessage('password must be at last 8 characters')
                        .matches( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/).withMessage('Password must be contain at least one uppercase, at least one lower case and  at least one special character'),
        check('cpassword').notEmpty().withMessage('confirm password cannot be empty')
                          .custom((value, {req}) => {
                            if (value !== req.body.password){
                                throw new Error('Password confirm does not match password')
                            }else{
                                return value;
                            }
                          })
                          
    ],(req,res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()})
    
        }
        const body = req.body;
        const salt = bcrypt.genSaltSync(10);
        body.password = bcrypt.hashSync(body.password,salt);
        body.otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        const number = phoneNumberFormatter(body.wa);
        // body.createdAt = Date.now();
        // body.expiredAt = Date.now();
        create(body, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json	({
              success: "Failed",
              message: "Database connection error"
            })
    
          }
        const pesan = 'Verifikasi kode register '+body.otp ;
        sock.sendMessage(number,{text:pesan});
          return res.status(201).json({
            message:"Success",
            data: req.body
    
          });
        });
      })
      app.post('/api/send_otp', [
        check('wa').notEmpty().withMessage('wa cannot empty')  
    ],(req,res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()})
    
        }
        const body = req.body;
        body.otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        const number = phoneNumberFormatter(body.wa);
        // body.createdAt = Date.now();
        // body.expiredAt = Date.now();
        
        const pesan = 'Verifikasi kode register '+body.otp ;
        sock.sendMessage(number,{text:pesan});
          return res.status(201).json({
            message:"Success",
            data: req.body
    
          });
        });
    
    }
    
    app.get('/', (req, res) => {
        res.sendFile('index.html', {
          root: __dirname
        });
      });
    
      startBot();
  

  
server.listen(port, function() {
	console.log('App running on : ' + port);
  });