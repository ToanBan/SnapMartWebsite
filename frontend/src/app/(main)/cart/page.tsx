"use client";

import React, { useEffect, useState } from "react";
import ListCart from "@/app/components/ListCart";

const CartPage = () => {
  const [carts, setCarts] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carts`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          setCarts([]);
          return;
        }

        const data = await response.json();
        setCarts(Array.isArray(data.message) ? data.message : []);
      } catch (error) {
        console.error("Error getting cart:", error);
        setCarts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  return (
    <>
      <div className="container" style={{marginTop:"8rem"}}>
        <div className="row shadow my-4">
          {isLoading ? <div className="p-4">Loading cart...</div> : <ListCart carts={carts}/>}
          
        </div>
      </div>
    </>
  );
};

export default CartPage;
