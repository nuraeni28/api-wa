
const { checkToken } = require('../auth/verify');
const { getUsers,login, getUsername, register, verifyOTP} = require('../controllers/users');
const { validationLogin, runValidation } = require('../middleware/middleware');


const router = require("express").Router();

// router.post('/register',register);
router.get("/user",checkToken,getUsers);
router.post("/login", validationLogin,runValidation, login);
router.post("/verify",  verifyOTP);


module.exports = router;