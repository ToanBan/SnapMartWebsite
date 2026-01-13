"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddCart from "../api/users/AddCart";
import AlertSuccess from "./share/AlertSuccess";
import AlertError from "./share/AlertError";
import { notifyCartChange } from "@/hooks/cartEvent";
const ListProduct = ({ products }: { products: any }) => {
  const imageUrl = "http://localhost:5000/uploads/";
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleAddToCart = async (productId: string, price: string) => {
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
  };

  return (
    <>
      

      {products && products.length > 0 ? (
        products.map((product: any) => (
          <div className="col" key={product.id}>
            <div className="card product-card rounded-3 shadow-sm h-100">
              <div className="position-relative overflow-hidden rounded-top-3">
                <Image
                  src={`${imageUrl}${product.image}`}
                  alt={product.productName}
                  width={200}
                  height={200}
                  className="card-img-top"
                />

                <span className="badge text-bg-danger position-absolute top-0 start-0 m-2 fw-bold">
                  GIẢM 20%
                </span>
              </div>

              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5
                    className="card-title fs-6 fw-semibold text-truncate mb-1"
                    title="Laptop Gaming Thế Hệ Mới, Màn Hình 120Hz"
                  >
                    {product.productName}
                  </h5>
                  <p className="card-text text-muted small mb-2">
                    <span className="fw-medium">Cửa hàng:</span>{" "}
                    {product.business.businessName}
                  </p>
                </div>

                <p className="price-text text-danger mt-1 mb-2">
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>

                <div className="d-flex flex-column gap-2">
                  <Link href={`shop/product/${product.id}`}>
                    <button className="btnDetail">XEM CHI TIẾT</button>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product.id, product.price)}
                    className="btnCart"
                  >
                    THÊM GIỎ HÀNG
                  </button>
                </div>
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
