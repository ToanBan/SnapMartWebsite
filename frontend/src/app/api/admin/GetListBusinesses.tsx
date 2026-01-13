import React from "react";

const GetListBusinesses = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/businesses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch businesses");
    }

    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default GetListBusinesses;
