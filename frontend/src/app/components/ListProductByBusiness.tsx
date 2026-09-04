"use client";

import React from "react";
import Pagination from "./share/Pagination";
import { Plus } from "lucide-react";
import Link from "next/link";
import AddCart from "../api/users/AddCart";
import { useState } from "react";
import { getMediaUrl } from "@/lib/mediaUrl";
interface ProductProps {
  id: string;
  productName: string;
  price: string;
  description: string;
  image: string;
}

const ListProductByBusiness = ({
  products,
  shopId,
  page,
}: {
  products: ProductProps[];
  shopId: string;
  page: number;
}) => {
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleAddToCart = async (product: ProductProps) => {
    if (addingProductId) return;
    setAddingProductId(product.id);
    const result = await AddCart(product.id, product.price);
    setMessage(
      result.message === "Cart item added" || result.message === "Cart item updated"
        ? "Đã thêm vào giỏ hàng"
        : "Không thể thêm vào giỏ hàng",
    );
    setAddingProductId(null);
    setTimeout(() => setMessage(""), 2500);
  };
  return (
    <>
      <section className="py-5 mt-5" id="products">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
          </div>
          <div className="row g-4">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <div className="product-card shadow-sm h-100">
                    <Link className="text-decoration-none text-dark" href={`/shop/product/${product.id}`}>
                    <div className="product-card shadow-sm">
                      <div className="product-img-wrapper">
                        <img
                          style={{
                            width: "250px",
                            height: "250px",
                          }}
                          src={getMediaUrl(product.image)}
                          alt={`${product.productName}`}
                        />
                      </div>
                      <div className="p-4">
                        <h5 className="fw-bold mb-2">{product.productName}</h5>
                        <p className="text-muted small">
                          {product.description}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="fw-bold text-primary fs-5">
                            {product.price} VND
                          </span>
                          <span className="btn btn-sm btn-outline-primary">
                            <Plus size={24} />
                          </span>
                        </div>
                      </div>
                    </div>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-primary w-100 mt-2"
                      disabled={addingProductId === product.id}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addingProductId === product.id ? "Đang thêm..." : "Thêm giỏ hàng"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
          {message && <div className="alert alert-info mt-4 text-center">{message}</div>}
        </div>
      </section>

      <Pagination
        page={page}
        pathName={`${process.env.NEXT_PUBLIC_API_URL_FE}/shop/${shopId}?page=`}
      />
    </>
  );
};

export default ListProductByBusiness;
