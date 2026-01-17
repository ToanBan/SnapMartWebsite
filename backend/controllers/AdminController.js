const {
  User,
  Product,
  Business,
  Order,
  OrderItem,
  Post,
  PostReaction,
  ErrorLog,
} = require("../models");
const sendMail = require("../extensions/mail");
const bcrypt = require("bcrypt");
const redisClient = require("../extensions/redis");
const jwt = require("jsonwebtoken");
const { where, Sequelize, Op, fn, col } = require("sequelize");
const path = require("path");
const fs = require("fs");
const user = require("../models/user");
const message = require("../models/message");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const GetVerifyBusinesses = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const businesses = await Business.findAll({
      where: { status: "pending" },
    });

    const result = [];

    for (const business of businesses) {
      let stripeCondition = false;

      if (business.bank_account_Id) {
        try {
          const account = await stripe.accounts.retrieve(
            business.bank_account_Id
          );

          stripeCondition = account.charges_enabled && account.payouts_enabled;
        } catch (err) {
          console.error("Stripe retrieve error:", err.message);
        }
      }

      result.push({
        ...business.toJSON(),
        stripeReady: stripeCondition,
      });
    }

    return res.status(200).json({ message: result });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const VerifyBusiness = async (req, res, next) => {
  try {
    const { businessId, status } = req.body;
    const business = await Business.findOne({ where: { id: businessId } });
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (status === "approval") {
      business.status = "approved";
      const userVerified = await User.findOne({
        where: {
          id: business.userId,
        },
      });
      userVerified.role = "business";
      await business.save();
      await userVerified.save();
    } else if (status === "rejected") {
      business.status = "rejected";
      await business.save();
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }
    return res.status(200).json({
      businessId,
      status,
      userId: business.userId,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetProductsPending = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        status: "pending",
      },
    });

    if (!products) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    return res.status(200).json({
      message: products,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const VerifyProduct = async (req, res, next) => {
  try {
    const { productId, status } = req.body;
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (status === "approval") {
      product.status = "approved";
      await product.save();
    } else if (status === "rejected") {
      product.status = "rejected";
      await product.save();
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }

    const business = await Business.findOne({
      where: {
        id: product.businessId,
      },
    });

    if (!business) {
      return res.status(404).json({
        message: "not found",
      });
    }

    return res.status(200).json({
      message: status,
      userId: business.userId,
    });
  } catch (error) {
    next(error);
  }
};

const GetProductsApproved = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const cacheKey = `products:approved:page:${page}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit");
      return res.status(200).json({
        message: JSON.parse(cachedData),
      });
    }

    const products = await Product.findAll({
      where: { status: "approved" },
      limit,
      offset,
      include: [
        {
          model: Business,
          as: "business",
          attributes: ["id", "businessName", "email", "phone", "address"],
        },
      ],
    });

    await redisClient.setEx(cacheKey, 120, JSON.stringify(products));

    return res.status(200).json({ message: products });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetProductDetails = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const cacheKey = `product_detail:${productId}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit for product", productId);
      return res.status(200).json({ message: JSON.parse(cachedData) });
    }
    const product = await Product.findOne({
      where: {
        id: productId,
      },
      include: [
        {
          model: Business,
          as: "business",
          attributes: ["id", "businessName", "email", "phone", "address"],
        },
      ],
    });
    await redisClient.setEx(cacheKey, 60, JSON.stringify(product));
    return res.status(200).json({ message: product });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.findAll({
      include: [
        {
          model: Product,
          as: "products",
          required: false,
        },
      ],
    });
    return res.status(200).json({
      message: businesses,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetRevenueAdmin = async (req, res, next) => {
  try {
    const countProduct = await Product.count({
      where: {
        status: "approved",
      },
    });

    const countOrder = await OrderItem.sum("quantity");

    const countBuyer = await Order.count({
      distinct: true,
      col: "user_id",
      include: [
        {
          model: OrderItem,
          as: "items",
          required: true,
          include: [
            {
              model: Product,
              as: "product",
              required: true,
            },
          ],
        },
      ],
    });

    const revenueResult = await OrderItem.findOne({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("OrderItem.quantity * OrderItem.price")
          ),
          "totalRevenue",
        ],
      ],
      include: [
        {
          model: Product,
          as: "product",
          required: true,
          attributes: [],
        },
        {
          model: Order,
          as: "order",
          required: true,
          attributes: [],
          where: { payment_status: "paid" },
        },
      ],
      raw: true,
    });

    const totalRevenue = revenueResult?.totalRevenue || 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const monthlyRevenueResult = await OrderItem.findOne({
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("OrderItem.quantity * OrderItem.price")
          ),
          "monthlyRevenue",
        ],
      ],
      include: [
        {
          model: Product,
          as: "product",
          required: true,
          attributes: [],
        },
        {
          model: Order,
          as: "order",
          required: true,
          attributes: [],
          where: {
            payment_status: "paid",
            createdAt: {
              [Op.between]: [startOfMonth, endOfMonth],
            },
          },
        },
      ],
      raw: true,
    });

    const monthlyRevenue = monthlyRevenueResult?.monthlyRevenue || 0;

    const countOrderNotDelivered = await Order.count({
      include: [
        {
          model: OrderItem,
          as: "items",
          required: true,
          include: [
            {
              model: Product,
              as: "product",
              required: true,
            },
          ],
        },
      ],
      where: {
        status: {
          [Op.ne]: "delivered",
        },
      },
    });

    const unsoldProductCount = await Product.count({
      where: {
        [Op.and]: Sequelize.literal(`
      NOT EXISTS (
        SELECT 1
        FROM OrderItems oi
        WHERE oi.product_id = Product.id
      )
    `),
      },
    });

    const monthlyAllRevenue = await OrderItem.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("order.createdAt"), "%m"),
          "month",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("OrderItem.quantity * OrderItem.price")
          ),
          "revenue",
        ],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: [],
        },
        {
          model: Order,
          as: "order",
          attributes: [],
          where: {
            payment_status: "paid",
          },
        },
      ],
      group: [Sequelize.literal("month")],
      order: [[Sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    const countAllPosts = await Post.count();
    const countAllUsers = await User.count();
    const todayPosts = await Post.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          [Op.lt]: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    return res.status(200).json({
      countProduct,
      countOrder,
      countBuyer,
      totalRevenue,
      monthlyRevenue,
      countOrderNotDelivered,
      unsoldProductCount,
      monthlyAllRevenue,
      countAllPosts,
      countAllUsers,
      todayPosts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetUserAdmin = async (req, res, next) => {
  try {
    const { page } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limit = 10;
    const offset = (pageNumber - 1) * limit;

    const users = await Business.findAll({
      limit,
      offset,
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (!users) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    const data = users.map((user) => ({
      id: user.user.id,
      username: user.user.username,
      email: user.user.email,
      role: user.user.role,
    }));

    return res.status(200).json({
      message: data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const ChangeRoleUser = async (req, res, next) => {
  try {
    const { role, userId } = req.body;
    const business = await Business.findOne({
      where: {
        userId,
      },
    });

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (business && role == "user") {
      await business.update({ status: "rejected" });
      await user.update({ role });
    } else if (business && role == "business") {
      await business.update({ status: "approved" });
      await user.update({ role });
    } else if (!business && role == "business") {
      await Business.create({
        businessName: "Default",
        status: "approved",
        userId,
      });
      await user.update({ role });
    } else {
      return res.status(409).json({
        message: "User is a user",
      });
    }
  } catch (error) {
    next(error);
  }
};

const GetPostsAdmin = async (req, res, next) => {
  try {
    const { page } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limit = 10;
    const offset = (pageNumber - 1) * limit;

    const posts = await Post.findAll({
      limit,
      offset,
      order: [["report_count", "DESC"]],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
          SELECT COUNT(*)
          FROM PostReactions AS pr
          WHERE pr.postId = Post.id
        )`),
            "reactionCount",
          ],
        ],
      },
    });

    if (!posts)
      return res.status(404).json({
        message: "Not Found",
      });

    return res.status(200).json({
      message: posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetAllUsersAdmin = async (req, res, next) => {
  try {
    const { page } = req.query;
    const limit = 10;
    const pageNumber = parseInt(page) || 1;
    const offset = (pageNumber - 1) * limit;
    const users = await User.findAll({
      where: {
        role: {
          [Op.ne]: "admin",
        },
        is_verified: true,
      },
      attributes: ["id", "username", "email", "createdAt", "role", "status"],
      limit,
      offset,
    });

    if (!users) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    return res.status(200).json({
      message: users,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const ChangeStatusUsers = async (req, res, next) => {
  try {
    const { userId, status } = req.body;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    if (status == "active") {
      await user.update({ status });
    } else {
      await user.update({ status });
    }

    return res.status(200).json({
      message: "Update Successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetOrdersAdmin = async (req, res, next) => {
  try {
    const { page } = req.query;
    const limit = 4;
    const pageNumber = parseInt(page) || 1;
    const offset = (pageNumber - 1) * limit;
    const orders = await Order.findAll({
      attributes: ["id", "total_amount", "payment_status", "createdAt"],
      limit,
      offset,
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: ["id", "price"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "productName", "description"],
            },
          ],
        },
      ],
    });

    if (!orders) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    return res.status(200).json({
      message: orders,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const ChangeStatusPost = async (req, res, next) => {
  try {
    const { postId, status } = req.body;
    const post = await Post.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    await post.update({ status });
    return res.status(200).json({
      data: post,
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetErrors = async (req, res, next) => {
  try {
    const { page } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limit = 10;
    const offset = (pageNumber - 1) * limit;
    const errors = await ErrorLog.findAll({
      limit,
      offset,
      attributes: ["id", "message", "url", "method", "statusCode", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    if (!errors) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    const countErrors = await ErrorLog.count();
    return res.status(200).json({
      data: errors,
      countErrors,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  VerifyBusiness,
  GetVerifyBusinesses,
  GetProductsPending,
  VerifyProduct,
  GetProductsApproved,
  GetProductDetails,
  GetBusinesses,
  GetRevenueAdmin,
  GetUserAdmin,
  ChangeRoleUser,
  GetPostsAdmin,
  GetAllUsersAdmin,
  ChangeStatusUsers,
  GetOrdersAdmin,
  ChangeStatusPost,
  GetErrors,
};
