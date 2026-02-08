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
    
    const userId = req.user.id
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
