"use client";
import React, { useEffect, useState } from "react";
import AddProducts from "@/app/api/business/AddProducts";
import DeleteProduct from "@/app/api/business/DeleteProduct";
import EditProduct from "@/app/api/business/EditProduct";
import Swal from "sweetalert2";
interface ProductsProps {
  id: string;
  productName: string;
  price: number;
  description: string;
  image: string;
  status: string;
  stock: number;
}

const ListProductBusiness = ({
  productsBusiness,
}: {
  productsBusiness: ProductsProps[];
}) => {
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<ProductsProps>>(
    {}
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const imageUrl = "http://localhost:5000/uploads/";
  const [page, setPage] = useState(1);
  const [addedProducts, setAddedProducts] = useState<ProductsProps[]>([]);
  useEffect(() => {
    setProducts([...productsBusiness, ...addedProducts]);
  }, [productsBusiness]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleDeleteProduct = async (productId: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xóa sản phẩm này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xóa ngay",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await DeleteProduct(productId);
        if (response.message === "Product deleted successfully") {
          setProducts((prev) =>
            prev.filter((product) => product.id !== productId)
          );
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
          Swal.fire("Đã xóa!", "Sản phẩm đã được xóa thành công.", "success");
        } else {
          setError(true);
          setTimeout(() => setError(false), 3000);
          Swal.fire("Lỗi!", "Xảy ra lỗi khi xóa sản phẩm.", "error");
        }
      } catch (error) {
        setError(true);
        setTimeout(() => setError(false), 3000);
        Swal.fire("Lỗi!", "Xảy ra lỗi khi xóa sản phẩm.", "error");
      }
    }
  };

  return (
    <>
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
        <h1 className="h3 fw-bold text-dark">Quản Lý Sản Phẩm</h1>
        <button
          onClick={() => {
            setIsEditMode(false);
            setCurrentProduct({});
            setShowModal(true);
          }}
          className="btn btn-gradient fw-semibold rounded-pill mt-3 mt-md-0 px-4 py-2 shadow-lg"
          style={{
            background: "linear-gradient(90deg, #6C63FF, #9A8CFF)",
            border: "none",
            color: "white",
            fontSize: "0.95rem",
          }}
        >
          <i className="bi bi-plus-lg me-2"></i> Thêm Sản Phẩm
        </button>
      </header>

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
                  <th className="text-uppercase small text-muted">Hành Động</th>
                  <th className="text-uppercase small text-muted">
                    Tình Trạng
                  </th>
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
                      <td className="fw-semibold">{product.price} VNĐ</td>
                      <td className="fw-semibold">
                        <button
                          className={`btn btn-primary me-3 ${
                            product.status === "pending" ? "" : "disabled"
                          }`}
                          onClick={() => {
                            setIsEditMode(true);
                            setCurrentProduct(product);
                            setShowModal(true);
                          }}
                        >
                          SỬA
                        </button>
                        <button
                          className={`btn btn-danger me-3 ${
                            product.status === "pending" ? "" : "disabled"
                          }`}
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          XÓA
                        </button>
                      </td>
                      <td>
                        <span
                          className={`badge px-3 py-2 ${
                            product.status === "pending"
                              ? "bg-warning text-dark"
                              : product.status === "rejected"
                              ? "bg-danger"
                              : "bg-success"
                          }`}
                        >
                          {product.status === "pending"
                            ? "Chờ Xét Duyệt"
                            : product.status === "rejected"
                            ? "Bị Từ Chối"
                            : "Đã Duyệt"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content card shadow-lg rounded-4 border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {isEditMode ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body pt-0">
                <form
                  className="mt-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (isEditMode && currentProduct.id) {
                      const res = await EditProduct(currentProduct.id, e);
                      if (res && res.success !== false) {
                        setShowModal(false);
                        Swal.fire(
                          "Thành công!",
                          "Sản phẩm đã được cập nhật.",
                          "success"
                        );
                        setProducts((prev) =>
                          prev.map((product) =>
                            product.id === res.data.id ? res.data : product
                          )
                        );
                      } else {
                        Swal.fire(
                          "Lỗi!",
                          "Cập nhật sản phẩm thất bại.",
                          "error"
                        );
                      }
                    } else {
                      const res = await AddProducts(e);
                      setAddedProducts((prev) => [res.data, ...prev]);
                      setProducts((prev) => [res.data, ...prev]);
                      setShowModal(false);
                    }
                  }}
                >
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label className="form-label small fw-medium text-muted">
                        Tên Sản Phẩm
                      </label>
                      <input
                        name="productName"
                        type="text"
                        className="form-control rounded-3 shadow-sm border-0"
                        placeholder="Tên sản phẩm"
                        defaultValue={currentProduct.productName || ""}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mt-2">
                    <div className="col-md-6">
                      <label className="form-label small fw-medium text-muted">
                        Giá Bán (VNĐ)
                      </label>
                      <input
                        name="productPrice"
                        type="number"
                        className="form-control rounded-3 shadow-sm border-0"
                        placeholder="500000"
                        defaultValue={currentProduct.price || 0}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-medium text-muted">
                        Số Lượng
                      </label>
                      <input
                        name="stock"
                        type="number"
                        className="form-control rounded-3 shadow-sm border-0"
                        placeholder="500000"
                        defaultValue={currentProduct.stock || 0}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium text-muted">
                        Ảnh Sản Phẩm
                      </label>
                      <input
                        name="productImage"
                        type="file"
                        className="form-control rounded-3 shadow-sm border-0"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label small fw-medium text-muted">
                      Mô Tả Ngắn
                    </label>
                    <textarea
                      name="productDescription"
                      rows={3}
                      className="form-control rounded-3 shadow-sm border-0"
                      placeholder="Mô tả sản phẩm"
                      defaultValue={currentProduct.description || ""}
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end pt-4">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 me-2"
                      onClick={handleCloseModal}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn btn-gradient rounded-pill px-4 fw-semibold"
                      style={{
                        background: "linear-gradient(90deg, #6C63FF, #9A8CFF)",
                        color: "white",
                      }}
                    >
                      {isEditMode ? "Lưu Thay Đổi" : "Lưu Sản Phẩm"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListProductBusiness;
