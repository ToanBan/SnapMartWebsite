import React from "react";



const VerifyProduct = async (productId: string, status: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/product/verify`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ productId, status }),
      headers:{
        "Content-Type": "application/json",
      }
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error(error);
    return;
  }
};



export default VerifyProduct;
