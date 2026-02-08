import React from "react";
import styles from "../../page.module.css";
import GetProductDetail from "@/app/api/admin/GetProductDetail";
import Image from "next/image";
import TrackProductView from "@/app/components/TrackProductView";
import Link from "next/link";
const ProductDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/`;
  const product = await GetProductDetail(slug);
  console.log(product);
  return (
    <>
      <TrackProductView productId={slug} />
      <div
        className={`product-container p-4 p-md-5 ${styles.productContainer}`}
      >
        <div className="container">
          <div className="row g-5">
            <div className="col-md-6 text-center">
              <img
                className={`main-image w-100 mb-3 shadow-sm ${styles.mainImage}`}
                src={`${imageUrl}${product.image}`}
                alt={product.productName}
              />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="col-md-6">
              <h2 className="fw-bold mb-3 text-dark">{product.productName}</h2>
              <p className="text-muted mb-4">{product.description}</p>

              <div className="bg-light p-3 rounded-lg mb-4">
                <p className="text-muted text-decoration-line-through mb-1">
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                <span className={styles.priceHuge}>
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                <span className="badge bg-danger ms-2 align-middle fs-6">
                  GIẢM 20%
                </span>
              </div>

              <div className="d-flex gap-3 mb-4">
                <button className={`btn btn-lg px-4 ${styles.btnAddCart}`}>
                  <i className="fas fa-cart-plus me-2"></i> Thêm vào Giỏ hàng
                </button>
                <button className={`btn btn-lg px-4 ${styles.btnBuyNow}`}>
                  <i className="fas fa-bolt me-2"></i> MUA NGAY
                </button>
              </div>

              {/* Tabs */}
              <ul
                className={`nav nav-tabs border-0 ${styles.navTabs}`}
                id="productTabs"
              >
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="desc-tab"
                    data-bs-toggle="tab"
                    href="#description"
                  >
                    Mô tả
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="specs-tab"
                    data-bs-toggle="tab"
                    href="#specifications"
                  >
                    Thông số kỹ thuật
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="reviews-tab"
                    data-bs-toggle="tab"
                    href="#reviews"
                  >
                    Đánh giá
                  </a>
                </li>
              </ul>

              <div className="tab-content mt-3">
                <div
                  className="tab-pane fade show active"
                  id="description"
                  role="tabpanel"
                >
                  <p>{product.description}</p>
                </div>

                <div
                  className="tab-pane fade"
                  id="specifications"
                  role="tabpanel"
                >
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">CPU: AMD Ryzen 7 6800H</li>
                    <li className="list-group-item">RAM: 16GB DDR5</li>
                    <li className="list-group-item">SSD: 1TB NVMe</li>
                    <li className="list-group-item">
                      GPU: NVIDIA GeForce RTX 4060
                    </li>
                    <li className="list-group-item">
                      Màn hình: 15.6" FHD 165Hz
                    </li>
                  </ul>
                </div>

                {/* <div
                className="tab-pane fade show active"
                id="reviews"
                role="tabpanel"
              >
                <div className={styles.reviewBox}>
                  <h5 className="fw-semibold mb-3">Bình luận của khách hàng</h5>

                  <form className={styles.commentForm}>
                    <textarea
                      className="form-control mb-2"
                      placeholder="Nhập nội dung bình luận..."
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button
                      type="submit"
                      className={`btn btn-sm px-3 ${styles.btnAddCart}`}
                    >
                      Gửi bình luận
                    </button>
                  </form>

                  <div className="mt-4">
                    {comments.map((c, i) => (
                      <div key={i} className={styles.commentItem}>
                        <strong>{c.name}</strong>
                        <p className="mb-1">{c.text}</p>
                        <hr />
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
                {/* --- END BÌNH LUẬN --- */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN GIỚI THIỆU CỬA HÀNG --- */}
      <div className="container mb-5 mt-4">
        <div
          className="store-wrapper"
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            border: "1px solid #f0f0f0",
            transition: "all 0.3s ease",
          }}
        >
          <div className="row align-items-center g-4">
            {/* Cột 1: Ảnh đại diện & Thông tin cơ bản */}
            <div className="col-lg-5 col-md-6">
              <div className="d-flex align-items-center">
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "50%",
                      padding: "3px",
                      background:
                        "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/11648/11648580.png" // Thay bằng logo thật của bạn
                      alt="Store Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #fff",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      right: "5px",
                      width: "15px",
                      height: "15px",
                      background: "#2ecc71",
                      border: "2px solid #fff",
                      borderRadius: "50%",
                    }}
                  ></span>
                </div>

                <div className="ms-4">
                  <h4
                    style={{
                      fontWeight: "700",
                      margin: 0,
                      color: "#2d3436",
                      fontSize: "1.25rem",
                    }}
                  >
                    {product.business.businessName}{" "}
                    <i
                      className="fas fa-check-circle ms-1"
                      style={{ color: "#0984e3", fontSize: "1rem" }}
                    ></i>
                  </h4>
                  <p
                    style={{
                      color: "#636e72",
                      fontSize: "0.9rem",
                      marginBottom: "8px",
                    }}
                  >
                    Online 5 phút trước
                  </p>
                  <div className="d-flex gap-2">
                    <Link
                      href={`/shop/${product.business.id}`}
                      style={{
                        padding: "6px 15px",
                        fontSize: "0.85rem",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        background: "#fff",
                        color: "#555",
                        fontWeight: "500",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Xem Shop
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-lg-7 col-md-6"
              style={{ borderLeft: "1px solid #eee" }}
            >
              <div className="row text-center text-md-start">
                <div className="col-4 mb-3">
                  <div style={{ fontSize: "0.9rem", color: "#888" }}>
                    Đánh giá
                  </div>
                  <div style={{ fontWeight: "600", color: "#ee4d2d" }}>
                    4.9 / 5.0
                  </div>
                </div>
                <div className="col-4 mb-3">
                  <div style={{ fontSize: "0.9rem", color: "#888" }}>
                    Sản phẩm
                  </div>
                  <div style={{ fontWeight: "600", color: "#ee4d2d" }}>
                    150+
                  </div>
                </div>
                <div className="col-4 mb-3">
                  <div style={{ fontSize: "0.9rem", color: "#888" }}>
                    Tỉ lệ phản hồi
                  </div>
                  <div style={{ fontWeight: "600", color: "#ee4d2d" }}>98%</div>
                </div>
                <div className="col-4">
                  <div style={{ fontSize: "0.9rem", color: "#888" }}>
                    Tham gia
                  </div>
                  <div style={{ fontWeight: "600", color: "#2d3436" }}>
                    2 năm trước
                  </div>
                </div>
                <div className="col-4">
                  <div style={{ fontSize: "0.9rem", color: "#888" }}>
                    Người theo dõi
                  </div>
                  <div style={{ fontWeight: "600", color: "#2d3436" }}>
                    12.5k
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
