import React from "react";

const GetProductsSuggesion = async (productsIds: []) => {
  if (!productsIds) return;
  console.log(productsIds);
  try {
    const res = await fetch("http://localhost:5000/api/hello", {
      method: "POST",
      body: JSON.stringify({ productsIds }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      const userId = data.userId;
      if (!userId) return;
      const raw = localStorage.getItem("userActions");
      if (!raw) return;
      const userActionData = JSON.parse(raw);
      delete userActionData[userId];
      localStorage.setItem("userActions", JSON.stringify(userActionData));
      return data.message;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default GetProductsSuggesion;
