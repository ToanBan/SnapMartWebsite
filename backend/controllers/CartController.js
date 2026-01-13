const { CartItem, Product } = require("../models");

const GetCartItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "productName", "price", "image", "description"],
        },
      ],
    });

    return res.status(200).json({ message: cartItems });
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    next(error)
  }
};

const AddCartItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1, price } = req.body;
    const userId = req.user.id;

    const cartItem = await CartItem.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      return res
        .status(200)
        .json({ message: "Cart item updated", cartItem, success: true });
    }
    const newCartItem = await CartItem.create({
      user_id: userId,
      product_id: productId,
      quantity,
      price,
    });

    const countCartItems = await CartItem.count({
      where: {
        user_id: userId, 
      },
    });

    return res
      .status(201)
      .json({
        message: "Cart item added",
        cartItem: newCartItem,
        success: true,
        count:countCartItems
      });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    next(error)
  }
};

const DeleteCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;

    const cartItem = await CartItem.findOne({
      where: {
        id: cartItemId,
        user_id: userId,
      },
    });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    await cartItem.destroy();
    return res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    next(error)
  }
};

module.exports = { AddCartItem, DeleteCartItem, GetCartItems };
