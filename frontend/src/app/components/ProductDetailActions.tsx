"use client";

import { useState } from "react";
import { ShoppingCart, Zap } from "lucide-react";
import AddCart from "@/app/api/users/AddCart";
import { notifyCartChange } from "@/hooks/cartEvent";

const ProductDetailActions = ({
  productId,
  price,
}: {
  productId: string;
  price: string | number;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      const result = await AddCart(productId, String(price));
      const success =
        result.message === "Cart item added" ||
        result.message === "Cart item updated";
      setMessage(success ? "Đã thêm vào giỏ hàng" : "Không thể thêm vào giỏ hàng");
      if (success) notifyCartChange(result.count);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setMessage("Không thể thêm vào giỏ hàng");
    } finally {
      setIsAdding(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
    <div>
      <div className="d-flex gap-3 mb-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className="btn btn-lg px-4 btn-outline-primary"
        >
          <ShoppingCart size={18} className="me-2" />
          {isAdding ? "Đang thêm..." : "Thêm vào Giỏ hàng"}
        </button>
        <button type="button" className="btn btn-lg px-4 btn-danger">
          <Zap size={18} className="me-2" /> MUA NGAY
        </button>
      </div>
      {message && <div className="small text-success fw-semibold">{message}</div>}
    </div>
  );
};

export default ProductDetailActions;
