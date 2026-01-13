import React from "react";
import { trackUserAction } from "@/app/components/ActionUser";
const AddCart = async (
  productId: string,
  price: string,
  onSuccess?: () => void
) => {
  try {
    const res = await fetch("http://localhost:5000/api/carts", {
      method: "POST",
      body: JSON.stringify({ productId, price }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to add to cart");
    }

    const data = await res.json();
    trackUserAction({type:"add-cart", productId})
    if (onSuccess) onSuccess();
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, message: "Failed to add to cart" };
  }
};

export default AddCart;
