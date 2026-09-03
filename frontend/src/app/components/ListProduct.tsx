"use client";

import React, { useState } from "react";
import Link from "next/link";
import AddCart from "../api/users/AddCart";
import AlertSuccess from "./share/AlertSuccess";
import AlertError from "./share/AlertError";
import { notifyCartChange } from "@/hooks/cartEvent";
const ListProduct = ({ products }: { products: any }) => {
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/`;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const handleAddToCart = async (productId: string, price: string) => {
    if (addingProductId) return;
    setAddingProductId(productId);
    const result = await AddCart(productId, price);
    if (
      result.message === "Cart item added" ||
      result.message === "Cart item updated"
    ) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      notifyCartChange(result.count);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
    setAddingProductId(null);
  };

  return (
    <>
      {products && products.length > 0 ? (
        products.filter((product: any) => product?.id).map((product: any) => (
          <div className="col-md-6 col-lg-3" key={product.id}>
            <div className="product-card shadow-sm h-100">
              <Link className="text-decoration-none text-dark" href={`/shop/product/${product.id}`}>
                <div className="product-img-wrapper">
                <img
                  style={{ width: "250px", height: "250px", objectFit: "cover" }}
                  src={`${imageUrl}${product.image}`}
                  alt={`${product.productName}`}
                />
                </div>
                <div className="p-4">
                  <h5 className="fw-bold mb-2">{product.productName}</h5>
                  <p className="text-muted small mb-2">
                    Cửa hàng: {product.business?.businessName || "Đang cập nhật"}
                  </p>
                  <p className="fw-bold text-primary fs-5 mb-0">
                    {Number(product.price).toLocaleString("vi-VN")} VND
                  </p>
                </div>
              </Link>
              <div className="px-4 pb-4 d-flex flex-column gap-2">
                <Link href={`/shop/product/${product.id}`} className="btnDetail text-center text-decoration-none">
                  XEM CHI TIẾT
                </Link>
                <button
                  onClick={() => handleAddToCart(product.id, String(product.price))}
                  className="btnCart"
                  disabled={addingProductId === product.id}
                >
                  {addingProductId === product.id ? "ĐANG THÊM..." : "THÊM GIỎ HÀNG"}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p></p>
      )}

      {success && <AlertSuccess message="Thêm vào giỏ hàng thành công!" />}
      {error && <AlertError message="Thêm vào giỏ hàng thất bại!" />}

      <style>
        {`.btnDetail {
  background: linear-gradient(135deg, #5C6BC0, #3F51B5);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 0;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(63, 81, 181, 0.3);
  width: 100%;
}

.btnDetail:hover {
  background: linear-gradient(135deg, #3F51B5, #1A237E);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(63, 81, 181, 0.45);
}

.btnCart {
  background: linear-gradient(135deg, #FFA726, #FB8C00);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 0;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(251, 140, 0, 0.3);
}

.btnCart:hover {
  background: linear-gradient(135deg, #FB8C00, #EF6C00);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(251, 140, 0, 0.45);
}
  
`}
      </style>
    </>
  );
};

export default ListProduct;
