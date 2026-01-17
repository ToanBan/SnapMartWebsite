"use client";
import React, { useEffect, useState } from "react";
import GetProductsPending from "@/app/api/admin/GetProductsPending";
import VerifyProduct from "@/app/api/admin/VerifyProducts";
import AlertSuccess from "@/app/components/share/AlertSuccess";
import AlertError from "@/app/components/share/AlertError";
import SendNotification from "@/app/api/users/SendNotification";
interface ProductsProps {
  id: string;
  productName: string;
  price: number;
  description: string;
  image: string;
  status: string;
}

const VerifyProductPage = () => {
  const imageUrl = "http://localhost:5000/uploads/";
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await GetProductsPending();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleVerify = async (productId: string, status: string) => {
    try {
      const message = await VerifyProduct(productId, status);
      console.log(message);
      if (message) {
        setSuccess(true);
        SendNotification(
          message.userId,
          "ADMIN",
          `ADMIN ĐÃ ${message.message}`
        );
        fetchProducts();
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
      {success && <AlertSuccess message="Cập nhật trạng thái thành công!" />}
      {error && <AlertError message="Có lỗi xảy ra, vui lòng thử lại!" />}

      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-body p-4">
          <h2 className="h5 fw-semibold text-dark mb-4">Danh Sách Sản Phẩm</h2>
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center mb-0">
              <thead className="bg-light rounded-4">
                <tr>
                  <th
                    className="text-uppercase small text-muted"
                    style={{ width: "80px" }}
                  >
                    Mã SP
                  </th>
                  <th
                    className="text-uppercase small text-muted"
                    style={{ width: "120px" }}
                  >
                    Ảnh
                  </th>
                  <th className="text-uppercase small text-muted text-start">
                    Tên Sản Phẩm
                  </th>
                  <th className="text-uppercase small text-muted">Giá Bán</th>
                  <th className="text-uppercase small text-muted">Mô Tả</th>
                  <th className="text-uppercase small text-muted">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-muted py-3">
                      Chưa có sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product.id} style={{ verticalAlign: "middle" }}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={
                            product.image
                              ? `${imageUrl}${product.image}`
                              : "/default-image.png"
                          }
                          alt={product.productName}
                          className="rounded-3 shadow-sm"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td className="text-start">{product.productName}</td>
                      <td className="fw-semibold">
                        {product.price.toLocaleString()} VNĐ
                      </td>
                      <td className="fw-semibold">{product.description}</td>
                      <td>
                        <div>
                          <button
                            onClick={() => handleVerify(product.id, "rejected")}
                            className="me-2 btn btn-danger"
                          >
                            TỪ CHỐI
                          </button>
                          <button
                            onClick={() => handleVerify(product.id, "approval")}
                            className="btn btn-primary"
                          >
                            ĐỒNG Ý
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyProductPage;
