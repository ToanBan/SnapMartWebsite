import React from "react";

const GetProductApproved = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error("Error fetching approved products:", error);
    return [];
  }
};

export default GetProductApproved;
