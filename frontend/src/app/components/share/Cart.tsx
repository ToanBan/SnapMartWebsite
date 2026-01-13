"use client";
import React, { useEffect, useState } from "react";
import { subscribeCart } from "@/hooks/cartEvent";

const DisplayCart = () => {
  const [countCart, setCountCart] = useState(0);

  useEffect(() => {
    const count = localStorage.getItem("count");
    setCountCart(Number(count) || 0);
    const unsub = subscribeCart((count) => {
      if (count !== undefined) setCountCart(count);
    });
    return () => unsub(); 
  }, []);

  return (
    <button
      type="button"
      className="nav-link me-3"
      data-bs-toggle="offcanvas"
      data-bs-target="#cart"
    >
      CART ({countCart})
    </button>
  );
};

export default DisplayCart;
