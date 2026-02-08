const { Follow, User } = require("../models");
const bcrypt = require("bcrypt");
const redisClient = require("../extensions/redis");
const jwt = require("jsonwebtoken");
const { where, Op } = require("sequelize");

const FollowUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const followId = req.params.id;

    const existFollow = await Follow.findOne({
      where: {
        followerId: userId,
        followingId: followId,
      },
    });

    if (!existFollow) {
      await Follow.create({
        followerId: userId,
        followingId: followId,
      });

      return res.status(201).json({
        message: "Follow Successfully",
      });
    }

    await Follow.destroy({
      where: {
        followerId: userId,
        followingId: followId,
      },
    });

    return res.status(200).json({
      message: "Unfollow Successfully",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const CheckFollow = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const followId = req.params.id;

    const checkFollow = await Follow.findOne({
      where: {
        followerId: userId,
        followingId: followId,
      },
    });

    if (!checkFollow) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    return res.status(200).json({
      message: "Found",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const CountFollow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const follower = await Follow.count({
      where: {
        followingId: userId,
      },
    });

    const following = await Follow.count({
      where: {
        followerId: userId,
      },
    });

    return res.status(200).json({
      follower,
      following,
      userId,
      message: userId,
    
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetFriend = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const friends = await Follow.findAll({
      attributes: ["followingId"],
      include: [
        {
          model: Follow,
          as: "friends",
          required: true,
          where: {
            followingId: userId,
          },
        },
        {
          model: User,
          as: "following",
          attributes: ["id", "username", "email", "avatar"],
        },
      ],
      where: { followerId: userId },
    });

    return res.status(200).json({
      message: friends,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { FollowUser, CheckFollow, CountFollow, GetFriend };
