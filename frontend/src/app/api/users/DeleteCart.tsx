import React from "react";

const DeleteCart = async (cartItemId: string) => {
  try {
    const res = await fetch(`http://localhost:5000/api/carts/${cartItemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache:"no-store"
    });

    if (!res.ok) {
      throw new Error("Failed to delete cart item");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error deleting cart item:", error);
    return null;
  }
};

export default DeleteCart;
