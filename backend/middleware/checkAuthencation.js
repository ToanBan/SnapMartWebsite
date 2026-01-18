const jwt = require("jsonwebtoken");
const { Business } = require("../models");

const CheckUserAuthencation = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    const business = await Business.findOne({
      where: { userId: decoded.id },
    });

    req.user = decoded;
    req.business = business;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { CheckUserAuthencation };
