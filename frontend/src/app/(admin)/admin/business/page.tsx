"use client";

import React, { useEffect, useState } from "react";
import GetListBusinesses from "../../../api/admin/GetListBusinesses";
import Image from "next/image";
import VerifyProduct from "@/app/api/admin/VerifyProducts";
import AlertSuccess from "@/app/components/share/AlertSuccess";
import AlertError from "@/app/components/share/AlertError";
interface Product {
  id: string;
  productName: string;
  price: number;
  description: string;
  image: string;
  status: string;
}

interface BusinessProduct {
  id: string;
  businessName: string;
  taxCode: string;
  phone: string;
  email: string | null;
  address: string;
  description: string;
  logo: string;
  status: string;
  verificationDocument: string;
  products: Product[];
}

const BusinessPage = () => {
  const imageUrl = "http://localhost:5000/uploads/";
  const [businesses, setBusinesses] = useState<BusinessProduct[]>([]);
  const [expandedBusinessId, setExpandedBusinessId] = useState<string | null>(
    null
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const fetchBusinesses = async () => {
    const businesses = await GetListBusinesses();
    setBusinesses(businesses);
  };
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const toggleProducts = (businessId: string) => {
    setExpandedBusinessId(
      expandedBusinessId === businessId ? null : businessId
    );
  };

  const handleVerify = async (productId: string, status: string) => {
    try {
      const message = await VerifyProduct(productId, status);
      if (message) {
        setSuccess(true);
        fetchBusinesses();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(true);
        setSuccess(false);
        setTimeout(() => setError(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setSuccess(false);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="container-xl py-5">
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-body p-4">
          <h2 className="h5 fw-semibold text-dark mb-4">
            Danh Sách Doanh Nghiệp
          </h2>

          <div className="table-responsive">
            <table className="table table-hover align-middle text-center mb-0">
              <thead className="bg-light rounded-4">
                <tr>
                  <th style={{ width: "80px", textAlign: "center" }}>Logo</th>
                  <th style={{ width: "200px", textAlign: "left" }}>
                    Tên Doanh Nghiệp
                  </th>
                  <th style={{ width: "150px", textAlign: "left" }}>
                    Mã Số Thuế
                  </th>
                  <th style={{ width: "150px", textAlign: "left" }}>
                    Số Điện Thoại
                  </th>
                  <th style={{ width: "120px", textAlign: "center" }}>
                    Hành Động
                  </th>
                </tr>
              </thead>

              <tbody>
                {businesses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-muted py-3">
                      Chưa có sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  businesses.map((business) => (
                    <React.Fragment key={business.id}>
                      <tr style={{ verticalAlign: "middle" }}>
                        <td style={{ textAlign: "center" }}>
                          <Image
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                            width={60}
                            height={60}
                            className="rounded-3 shadow-sm"
                            alt={business.businessName}
                            src={
                              business.logo
                                ? `${imageUrl}${business.logo}`
                                : "https://img.freepik.com/free-vector/add-new-user_78370-4710.jpg?semt=ais_hybrid&w=740&q=80"
                            }
                          ></Image>
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {business.businessName}
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {business.taxCode}
                        </td>
                        <td style={{ textAlign: "left" }}>{business.phone}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => toggleProducts(business.id)}
                          >
                            {expandedBusinessId === business.id
                              ? "Ẩn Sản Phẩm"
                              : "Các Sản Phẩm"}
                          </button>
                        </td>
                      </tr>

                      {/* Row sản phẩm */}
                      {expandedBusinessId === business.id &&
                        business.products.length > 0 && (
                          <tr>
                            <td colSpan={5} style={{ padding: "0" }}>
                              <table className="table mb-0">
                                <thead>
                                  <tr className="table-secondary">
                                    <th>Tên Sản Phẩm</th>
                                    <th>Giá</th>
                                    <th>Mô Tả</th>
                                    <th>Trạng Thái</th>
                                    <th>Ảnh</th>
                                    <th>Hành Động</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {business.products.map((product) => (
                                    <tr key={product.id}>
                                      <td>{product.productName}</td>
                                      <td>{product.price.toLocaleString()}₫</td>
                                      <td>{product.description}</td>
                                      <td>{product.status}</td>
                                      <td>
                                        <img
                                          src={
                                            product.image
                                              ? `${imageUrl}${product.image}`
                                              : "/default-image.png"
                                          }
                                          alt={product.productName}
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <div className="status-dropdown">
                                          <button className="btn btn-sm btn-outline-primary">
                                            Change Status
                                          </button>
                                          <div className="status-menu">
                                            <div
                                              className="status-item"
                                              onClick={() =>
                                                handleVerify(
                                                  product.id,
                                                  "approval"
                                                )
                                              }
                                            >
                                              Approved
                                            </div>
                                            <div
                                              className="status-item"
                                              onClick={() =>
                                                handleVerify(
                                                  product.id,
                                                  "rejected"
                                                )
                                              }
                                            >
                                              Rejected
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {success && <AlertSuccess message="Cập nhật trạng thái thành công!" />}
      {error && <AlertError message="Có lỗi xảy ra, vui lòng thử lại!" />}
      <style>
        {`.status-dropdown {
  position: relative;
  display: inline-block;
}

.status-dropdown .status-menu {
  display: none; /* ẩn menu mặc định */
  position: absolute;
  top: 100%; /* bên dưới nút */
  left: 0;
  min-width: 120px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 10;
}

.status-dropdown:hover .status-menu {
  display: block; /* hover là hiện menu */
}

.status-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.status-item:hover {
  background-color: #f0f0f0;
}
`}
      </style>
    </div>
  );
};

export default BusinessPage;
