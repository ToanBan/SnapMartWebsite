import React from "react";

const ReceiveOrder = async(orderId:string) => {
  try {    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/receive-order`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ orderId }),
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
    return null;
  }
};

export default ReceiveOrder;
