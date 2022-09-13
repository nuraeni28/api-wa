const { check,validationResult } = require("express-validator")

exports.runValidation = (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
		return res.status(400).json({
            status:'failed',
            errors : errors.array()
        })
	}
    next();

}

exports.validationLogin = [
    check('username','username cannot empty').notEmpty(),
    check('password','password cannot empty').notEmpty(),
]