import React from "react";

const GetProductsSuggesion = async (productsIds: []) => {
  if (!productsIds) return;
  console.log(productsIds);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hello`, {
      method: "POST",
      body: JSON.stringify({ productsIds }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return data.message;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default GetProductsSuggesion;
