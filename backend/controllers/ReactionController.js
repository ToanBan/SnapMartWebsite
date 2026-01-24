const { User, PostReaction, Post } = require("../models");
const sendMail = require("../extensions/mail");
const bcrypt = require("bcrypt");
const redisClient = require("../extensions/redis");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const path = require("path");
const fs = require("fs");
const { count } = require("console");

const ToggleReaction = async (req, res, next) => {
  try {
   
    const userId = req.user.id
    const { valueReaction, postId } = req.body;

    const existReaction = await PostReaction.findOne({
      where: { userId, postId },
    });

    let countReactions;

    if (existReaction) {
      if (existReaction.reactionType === valueReaction) {
        await existReaction.destroy();
        countReactions = await PostReaction.count({
          where: {
            postId,
          },
        });
        return res.status(200).json({ reactionType: null, countReactions });
      } else {
        existReaction.reactionType = valueReaction;
        countReactions = await PostReaction.count({
          where: {
            postId,
          },
        });
        await existReaction.save();
        return res
          .status(200)
          .json({ reactionType: existReaction.reactionType, countReactions});
      }
    } else {
      const newReaction = await PostReaction.create({
        userId,
        postId,
        reactionType: valueReaction,
      });

      countReactions = await PostReaction.count({
        where: {
          postId,
        },
      });
      return res.status(200).json({ reactionType: newReaction.reactionType, countReactions});
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const GetCountLikeForPost = async (req, res, next) => {
  try {
    const { id } = req.params;  
    const countReactions = await PostReaction.count({
      where: {
        postId: id,
      },
    });
    return res.status(200).json({
      message: countReactions,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const CheckDisplayReaction = async (req, res, next) => {
  try {
    
    const userId = req.user.id
    const { id } = req.params;
    const existReaction = await PostReaction.findOne({
      where: {
        userId,
        postId: id,
      },
    });

    if (!existReaction) {
      return res.status(404).json({
        message: "No Reaction Post Id",
      });
    }

    return res.status(200).json({
      typeReaction: existReaction.reactionType,
      postId: existReaction.postId,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = { ToggleReaction, GetCountLikeForPost, CheckDisplayReaction };
