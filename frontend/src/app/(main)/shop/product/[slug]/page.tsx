import React from "react";
import styles from "../../page.module.css";
import GetProductDetail from "@/app/api/admin/GetProductDetail";
import Image from "next/image";
import TrackProductView from "@/app/components/TrackProductView";
const ProductDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/`;
  const product = await GetProductDetail(slug);

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
    </>
  );
};

export default ProductDetail;
