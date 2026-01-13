const {
  User,
  Business,
  Product,
  Order,
  OrderItem,
  Message,
} = require("../models");
const bcrypt = require("bcrypt");
const redisClient = require("../extensions/redis");
const jwt = require("jsonwebtoken");
const { where, or, Sequelize, Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const message = require("../models/message");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CheckTeacherId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const business = await Business.findOne({
      where: {
        userId,
      },
    });
    if (!business) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    return res.status(200).json({
      message: business,
    });
  } catch (error) {
    next(error)
  }
};

const RegisterBusiness = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const userId = decoded.id;

    const { businessName, taxCode, phone, address, description, email } =
      req.body;

    const logo = req.files?.logo ? req.files.logo[0].filename : null;
    const licence = req.files?.licence ? req.files.licence[0].filename : null;

    if (
      !businessName ||
      !taxCode ||
      !phone ||
      !address ||
      !description ||
      !logo ||
      !licence ||
      !email
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingBusiness = await Business.findOne({
      where: { userId },
    });

    if (existingBusiness) {
      return res
        .status(400)
        .json({ message: "User has already registered a business" });
    }

    const account = await stripe.accounts.create({
      type: "express",
      email,
      capabilities: {
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/seller/onboarding/refresh`,
      return_url: `${process.env.FRONTEND_URL}/seller/onboarding/success`,
      type: "account_onboarding",
    });

    await Business.create({
      userId,
      businessName,
      taxCode,
      phone,
      email,
      address,
      description,
      logo,
      verificationDocument: licence,
      bank_account_Id: account.id,
    });

    return res.status(200).json({
      message: "Business registered. Complete Stripe onboarding.",
      onboardingUrl: accountLink.url,
    });
  } catch (error) {
    console.error("Error registering business:", error);
    next(error)
  }
};

const AddProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productName, productPrice, productDescription, stock } = req.body;
    const productPath = req.file;
    let productFileName;
    productPath
      ? (productFileName = productPath.filename)
      : (productFileName = null);
    const businessId = req.business.id;

    const product = await Product.create({
      businessId,
      productName,
      price: productPrice,
      description: productDescription,
      image: productFileName,
      stock,
    });
    return res.status(200).json({
      message: "Successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const GetAllProducts = async (req, res, next) => {
  try {
    const businessId = req.business.id;
    const { page } = req.query;
    const numberPage = parseInt(page) || 1;
    const limit = 10;
    const offset = (numberPage - 1) * limit;

    const products = await Product.findAll({
      where: {
        businessId,
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
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
    next(error)
  }
};

const DeleteProductById = async (req, res, next) => {
  try {
    const businessId = req.business.id;
    const productId = req.params.id;
    const product = await Product.findOne({
      where: {
        id: productId,
        businessId,
      },
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.image) {
      const imagePath = path.join(__dirname, "../uploads", product.image);
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(imagePath, (err) => {
            if (err) console.error("Error deleting product image:", err);
          });
        }
      });
    }
    await product.destroy();
    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const EditProductById = async (req, res, next) => {
  try {
    const businessId = req.business.id;
    const productId = req.params.id;
    const product = await Product.findOne({
      where: {
        id: productId,
        businessId,
      },
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const { productName, productPrice, productDescription } = req.body;
    const productPath = req.file;
    let productFileName;
    productPath
      ? (productFileName = productPath.filename)
      : (productFileName = null);

    if (productFileName && product.image) {
      const oldImagePath = path.join(__dirname, "../uploads", product.image);
      console.log("Old image path:", oldImagePath);
      fs.access(oldImagePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
        }
      });
    }
    const updateProduct = await product.update({
      productName: productName || product.productName,
      price: productPrice || product.price,
      description: productDescription || product.description,
      image: productFileName || product.image,
    });
    return res.status(200).json({
      message: "Product updated successfully",
      data: updateProduct,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const GetOrders = async (req, res, next) => {
  try {
    const businessId = req.business.id;

    const { page } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limit = 5;
    const offset = (pageNumber - 1) * limit;

    const orders = await Order.findAll({
      limit,
      offset,
      subQuery: false, // ⭐ BẮT BUỘC
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "items",
          required: true,
          include: [
            {
              model: Product,
              as: "product",
              where: { businessId },
              required: true,
            },
          ],
        },
        {
          model: User,
          as: "user",
          required: true,
        },
      ],
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found for this business",
      });
    }

    return res.status(200).json({
      message: orders,
    });
  } catch (error) {
    console.error("GetOrders error:", error);
    next(error)
  }
};

const ChangeStatusOrder = async (req, res, next) => {
  try {
    const businessId = req.business.id;
    const business = await Business.findOne({
      where: {
        id: businessId,
      },
    });
    if (!business) {
      return res.status(404).json({
        message: "Internal Server Error",
      });
    }

    const { id } = req.params;
    console.log("Order ID:", id);
    const order = await Order.findOne({
      where: {
        id,
      },
    });

    const { status } = req.body;

    if (!order) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    await order.update({ status: status });

    return res.status(200).json({
      success: true,
      message: order,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const GetUserProducts = async (req, res, next) => {
  try {
    const businessId = req.business.id;
    const business = await Business.findOne({
      where: {
        id: businessId,
      },
    });

    if (!business) return res.status(404).json({ message: "not found" });

    const data = await User.findAll({
      attributes: ["id", "username", "email", "avatar", "role"],
      include: [
        {
          model: Order,
          as: "orders",
          required: true,
          attributes: ["id", "createdAt", "phone_number"],
          include: [
            {
              model: OrderItem,
              as: "items",
              attributes: ["id", "quantity", "price"],
              include: [
                {
                  model: Product,
                  as: "product",
                  attributes: ["id", "productName", "price", "image", "stock"],
                  where: { businessId },
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });

    let products = [];

    const results = data.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,

      products: user.orders.flatMap((order) =>
        order.items.map((item) => ({
          id: order.id,
          quantity: item.quantity,
          productName: item.product.productName,
          productPrice: item.product.price,
          productImage: item.product.image,
          stock: item.product.stock,
        }))
      ),
    }));

    return res.status(200).json({
      message: results,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const GetRevenue = async (req, res, next) => {
  try {
    const businessId = req.business.id;
    const business = await Business.findOne({
      where: {
        id: businessId,
      },
    });
    if (!business) return res.status(404).json({ message: "Not Found" });

    const countProduct = await Product.count({
      where: {
        businessId,
        status: "approved",
      },
    });

    const countOrder = await OrderItem.sum("quantity", {
      include: [
        {
          model: Product,
          as: "product",
          required: true,
          attributes: [], 
          where: {
            businessId: businessId,
          },
        },
      ],
    });

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
              where: {
                businessId: businessId,
              },
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
          where: { businessId },
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
          where: { businessId },
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
              where: {
                businessId,
              },
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
        businessId,
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
          where: { businessId },
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

    return res.status(200).json({
      countProduct,
      countOrder,
      countBuyer,
      totalRevenue,
      monthlyRevenue,
      countOrderNotDelivered,
      unsoldProductCount,
      monthlyAllRevenue,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const GetUnsoldProduct = async (req, res, next) => {
  try {
    const businessId = req.business.id;
    const business = await Business.findOne({
      where: {
        id: businessId,
      },
    });
    if (!business) return res.status(404).json({ message: "Not Found" });
    const { page } = req.query;
    const numberPage = parseInt(page) || 1;
    const limit = 10;
    const offset = (numberPage - 1) * limit;

    const unsoldProducts = await Product.findAll({
      where: {
        businessId,
        id: {
          [Op.notIn]: Sequelize.literal(`
        (SELECT DISTINCT product_id FROM OrderItems)
      `),
        },
      },
      attributes: ["id", "productName", "price", "createdAt"],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: unsoldProducts,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const GetUserSentMessageToBusiness = async (req, res, next) => {
  try {
    const businessUserId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          {
            receiverId: businessUserId,
            receiverType: "business",
          },
          {
            senderId: businessUserId,
            senderType: "business",
          },
        ],
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username", "avatar", "role", "email"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "username", "avatar", "role", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const uniqueConversations = {};
    for (const msg of messages) {
      const otherUser =
        msg.senderId === businessUserId ? msg.receiver : msg.sender;
      if (!uniqueConversations[otherUser.id]) {
        uniqueConversations[otherUser.id] = msg;
      }
    }

    return res.status(200).json({
      message: Object.values(uniqueConversations),
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const GetProductsByBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const business = await Business.findByPk(id);
    if (!business) {
      return res.status(404).json({ message: "Not Found" });
    }

    const products = await Product.findAll({
      where: {
        businessId: id,
        status: "approved",
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  RegisterBusiness,
  CheckTeacherId,
  AddProduct,
  GetAllProducts,
  DeleteProductById,
  EditProductById,
  GetOrders,
  ChangeStatusOrder,
  GetUserProducts,
  GetRevenue,
  GetUnsoldProduct,
  GetUserSentMessageToBusiness,
  GetProductsByBusiness,
};
