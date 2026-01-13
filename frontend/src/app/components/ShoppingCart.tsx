"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { subscribeCart, notifyCartChange } from "@/hooks/cartEvent";
const ShopCart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setCartItems(data.message || []);
      localStorage.setItem("count", data.count);
    } catch (error) {
      console.error(error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart(); 
    const unsub = subscribeCart((count) => {
      fetchCart();
    });
    return () => unsub();
  }, []);

  return (
    <div
      className="offcanvas offcanvas-end shadow-lg border-start"
      tabIndex={-1}
      id="cart"
      aria-labelledby="cartLabel"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title fw-bold" id="cartLabel">
          <ShoppingCart className="me-2" size={30} /> Giỏ Hàng
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        />
      </div>
      <div className="offcanvas-body">
        {cartItems.length > 0 ? (
          cartItems.map((cartItem) => (
            <div
              key={cartItem.id}
              className="d-flex align-items-center justify-content-between p-2 mb-3 rounded border"
            >
              <div className="d-flex align-items-center">
                <div
                  className="bg-success-subtle text-success-emphasis rounded p-2 text-center me-3"
                  style={{ minWidth: 80 }}
                >
                  <small className="d-block">
                    {cartItem.product.productName}
                  </small>
                </div>
                <div>
                  <div className="fw-semibold">
                    {cartItem.product.productName}
                  </div>
                  <div className="text-muted">
                    {cartItem.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      <div className="offcanvas-footer">
        <Link href={"/cart"} className="btn btn-primary w-100 mt-3">
          Xem Giỏ Hàng
        </Link>
      </div>
    </div>
  );
};

export default ShopCart;
