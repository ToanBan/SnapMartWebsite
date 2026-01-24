'use client'
import React from 'react'

const DeleteProduct = async(productId:string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include"
    });

    if(res.ok){
      const data = await res.json();
      return data
    }

  } catch (error) {
    console.log("Error deleting product:", error);
    return { success: false, message: "Error deleting product" };
  }
}

export default DeleteProduct
