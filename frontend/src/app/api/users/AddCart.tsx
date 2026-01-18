import React from "react";
import { trackUserAction } from "@/app/components/ActionUser";
import api from "@/app/api/axios";
const AddCart = async (
  productId: string,
  price: string,
  onSuccess?: () => void,
) => {
  try {
    const res = await api.post("/api/carts", {
      productId,
      price,
    });

    const data = res.data;
    trackUserAction({ type: "add-cart", productId });
    if (onSuccess) onSuccess();
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, message: "Failed to add to cart" };
  }
};

export default AddCart;
