"use client";
import React from "react";

const EditProduct = async (
  productId: string,
  e: React.FormEvent<HTMLFormElement>
) => {
  try {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.log("Error editing product:", error);
    return { success: false, message: "Error editing product" };
  }
};

export default EditProduct;
