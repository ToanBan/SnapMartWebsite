"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddCart from "../api/users/AddCart";
import { notifyCartChange } from "@/hooks/cartEvent";
import GetProductsSuggesion from "../api/users/GetProductsSuggesion";
import AlertSuccess from "./share/AlertSuccess";
import AlertError from "./share/AlertError";
const ListSuggestionProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const imageUrl = "http://localhost:5000/uploads/";
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("productIds");
    console.log(raw);
    if (!raw) return;
    const { ids, createdAt } = JSON.parse(raw);
    if (Date.now() - createdAt > 10 * 60 * 1000) return;
    console.log(ids);
    const fetchProductsSuggesion = async () => {
      const results = await GetProductsSuggesion(ids);
      setProducts(results);
    };
    fetchProductsSuggesion();
  }, []);

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
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3 g-md-4">
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
      </div>

      {success && <AlertSuccess message="Thêm vào giỏ hàng thành công!" />}
      {error && <AlertError message="Thêm vào giỏ hàng thất bại!" />}
    </>
  );
};

export default ListSuggestionProducts;
