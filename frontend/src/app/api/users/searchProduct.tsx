import React from "react";
const searchProduct = async (query: string, page:number) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}`, {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default searchProduct;
