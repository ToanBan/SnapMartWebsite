const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { where } = require("sequelize");

const CheckAdmin = async (req, res, next) => {
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

    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return;
  }
};

module.exports = { CheckAdmin };
