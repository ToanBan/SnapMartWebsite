import React from "react";

const GetProductDetail = async (productId: string) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }
    const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data.message;
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};

export default GetProductDetail;
