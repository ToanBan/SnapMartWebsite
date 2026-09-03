const jwt = require("jsonwebtoken");
const { User, Business } = require("../models");

const CheckBusiness = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== "business" || user.status !== "active") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const business = await Business.findOne({
      where: { userId: user.id, status: "approved" },
    });
    if (!business) {
      return res.status(403).json({ message: "Business is not approved" });
    }

    req.user = decoded;
    req.business = business;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { CheckBusiness };
