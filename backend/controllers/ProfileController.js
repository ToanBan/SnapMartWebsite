const { User } = require("../models");
const bcrypt = require("bcrypt");
const redisClient = require("../extensions/redis");
const jwt = require("jsonwebtoken");
const { where, Op } = require("sequelize");

const GetProfileDetail = async (req, res, next) => {
  try {
  
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id: id,
        is_verified: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Not Found User",
      });
    }

    return res.status(200).json({
      message: user,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const SearchProfile = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
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
    const userId = decoded.id;
    const { query } = req.query;
    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${query}%`,
        },
        id: { [Op.ne]: userId }, 
      },
    });
    return res.status(200).json({
      message: users,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = { GetProfileDetail, SearchProfile };
