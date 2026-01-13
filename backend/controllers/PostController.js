const { Post, User, Follow, PostReaction, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const redisClient = require("../extensions/redis");
const jwt = require("jsonwebtoken");
const { where, fn, col, Op} = require("sequelize");
const path = require("path");
const fs = require("fs");
const { faker, de } = require("@faker-js/faker");
const { type } = require("os");
const AddPost = async (req, res, next) => {
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

    const { post_title } = req.body;

    const filePath = req.file;
    let typeFile;
    let fileName;
    if (filePath) {
      const mimetype = filePath.mimetype.split("/")[0];
      typeFile = mimetype;
      fileName = filePath.filename;
    } else {
      typeFile = "none";
    }

    await Post.create({
      userId: decoded.id,
      post_url: fileName,
      post_caption: post_title,
      type: typeFile,
    });

    return res.status(200).json({
      message: "Add Successfully",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const posts = await Post.findAll({
      where: { userId, status: "active" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!posts) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    return res.status(200).json({
      message: posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetPostOtherUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const posts = await Post.findAll({
      where: { userId: id, status: "active" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email", "avatar"],
        },
        {
          model: PostReaction,
          required: false,
          attributes: ["reactionType"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!posts) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    return res.status(200).json({
      message: posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const DeletePostUser = async (req, res, next) => {
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

    const { id } = req.params;

    const oldPost = await Post.findOne({
      where: { id },
    });

    if (!oldPost) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    if (oldPost.type !== "none") {
      const oldFilePath = path.join(__dirname, "../uploads", oldPost.post_url);
      console.log("test tại chỗ này", oldFilePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const deletePost = await Post.destroy({
      where: { id },
    });

    return res.status(200).json({
      message: id,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const EditPostUser = async (req, res, next) => {
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

    const { id } = req.params;
    const { post_title } = req.body;
    const filePath = req.file;

    const oldPost = await Post.findOne({
      where: {
        id,
      },
    });

    if (!oldPost) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    let currentFileName;
    let typeFilePath;
    const oldPostPath = oldPost.type;
    if (filePath) {
      currentFileName = filePath.filename;
      const mimeType = filePath.mimetype.split("/")[0];

      if (mimeType === "image") {
        typeFilePath = "image";
      } else if (mimeType === "video") {
        typeFilePath = "video";
      } else {
        typeFilePath = "none";
      }

      if (oldPostPath === "image" || oldPostPath === "video") {
        const oldFilePath = path.join(
          __dirname,
          "../uploads",
          oldPost.post_url
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    } else {
      if (oldPostPath === "image" || oldPostPath === "video") {
        typeFilePath = "none";
        const oldFilePath = path.join(
          __dirname,
          "../uploads",
          oldPost.post_url
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    await Post.update(
      {
        post_url: currentFileName || oldPost.post_url,
        post_caption: post_title || oldPost.post_caption,
        type: typeFilePath || oldPost.type,
      },
      {
        where: { id },
      }
    );

    const updatedPost = await Post.findOne({ where: { id } });

    return res.status(200).json({
      message: updatedPost,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetPostsFollow = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = 10;
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;

    const whereCondition = {
      status: "active",
    };

    if (cursor) {
      whereCondition.id = {
        [Op.lt]: cursor,
      };
    }

    const posts = await Post.findAll({
      where: whereCondition,
      limit,
      distinct: true, 
      include: [
        {
          model: User,
          as: "user",
          required: true,
          include: [
            {
              model: Follow,
              as: "followers",
              required: true,
              where: { followerId: userId },
            },
          ],
        },
        {
          model: PostReaction,
          required: false, 
          attributes: ["id", "userId", "reactionType"],
          where: { userId },
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM PostReactions AS pr
              WHERE pr.postId = Post.id
            )`),
            "reactionCount",
          ],
        ],
      },
      order: [["id", "DESC"]],
    });

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return res.status(200).json({
      data: posts,
      nextCursor,
    });
  } catch (error) {
    next(error);
  }
};

const SharePost = async (req, res, next) => {
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
    const userId = decoded.id;
    const { postId, caption } = req.body;
    const sharedPost = await Post.create({
      userId,
      post_caption: caption,
      shared_post_id: postId,
      type: "share",
    });
    if (!sharedPost) {
      return res.status(400).json({
        message: "Share post failed",
      });
    }
    return res.status(200).json({
      message: postId,
      caption,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetSharePost = async (req, res, next) => {
  try {
    let userId = req.params.userid;

    if (!userId) {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      userId = decoded.id;
    }

    const sharedPosts = await Post.findAll({
      where: { userId, type: "share" },
      include: [
        {
          model: Post,
          as: "sharedPost",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username", "avatar"],
            },
            {
              model: PostReaction,
              attributes: ["id", "userId", "reactionType"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: sharedPosts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const FakePostForUser = async () => {
  try {
    const postCount = await Post.count();

    if (postCount >= 50) {
      console.log(`DB có ${postCount} post, không cần fake thêm.`);
      return;
    }

    const users = await User.findAll({ attributes: ["id"] });
    if (!users.length) {
      console.log("Chưa có user nào trong DB!");
      return;
    }

    const postsToCreate = 60 - postCount;

    for (let i = 0; i < postsToCreate; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      await Post.create({
        userId: randomUser.id,
        post_url: null,
        post_caption: faker.lorem.sentences(2),
        type: "none",
      });
    }

    console.log(
      `Đã tạo ${postsToCreate} bài post giả, tổng số hiện tại: ${60}`
    );
  } catch (error) {
    next(error);
  }
};

const ReportPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({
      where: { id },
    });
    if (!post) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    const currentReport = parseInt(post.report_count);
    await post.update({ report_count: currentReport + 1 });
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  AddPost,
  GetPost,
  GetPostOtherUser,
  DeletePostUser,
  EditPostUser,
  GetPostsFollow,
  FakePostForUser,
  SharePost,
  GetSharePost,
  ReportPost,
};
