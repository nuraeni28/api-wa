const jwt= require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Invalid Token..."
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: 1,
        message: "Access Denied! Unauthorized User"
      });
    }
  }
};
