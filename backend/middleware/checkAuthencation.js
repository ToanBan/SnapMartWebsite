const jwt = require("jsonwebtoken");
const { Business } = require("../models");
const CheckUserAuthencation = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN,
      (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
          }
          return res.status(403).json({ message: "Invalid token" });
        }
        return decoded;
      }
    );
    const business = await Business.findOne({
      where: {
        userId: decoded.id,
      },
    });
    req.business = business;
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return;
  }
};

module.exports = { CheckUserAuthencation };
