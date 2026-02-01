import React from "react";
import GetOrdersDetail from "@/app/api/users/GetOrderDetail";
import Image from "next/image";
import TrackingOrder from "@/app/components/TrackingOrder";

const OrderPageDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const order = await GetOrdersDetail(slug);
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/`;

  return (
    <>
      <div className="container" style={{ marginTop: "8rem" }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="order-card">
              <TrackingOrder order={order} />

              <div className="p-4 p-md-5 pt-0">
                <div className="row g-4">
                  <div className="col-md-7">
                    <h5 className="fw-bold mb-4">Sản phẩm đã mua</h5>

                    {order.items.length !== 0 ? (
                      order.items.map((item: any) => (
                        <div
                          key={item.id}
                          className="product-item d-flex align-items-center"
                        >
                          <Image
                            width={100}
                            height={100}
                            src={`${imageUrl}${item.product.image}`}
                            className="product-img me-3"
                            alt={item.product.productName}
                          ></Image>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold">
                              {item.product.productName}
                            </h6>
                            <p className="small text-muted mb-0">
                              Màu: Trắng bạc
                            </p>
                            <p className="small fw-bold mt-1">
                              x{item.quantity}
                            </p>
                          </div>
                          <div className="text-end">
                            <span className="fw-bold">
                              {(
                                item.quantity * item.product.price
                              ).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Không có sản phẩm nào</p>
                    )}
                  </div>

                  <div className="col-md-5">
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3">Thông tin nhận hàng</h5>
                      <div className="card border-0 bg-light p-3">
                        <p className="info-label">Người nhận</p>
                        <p className="info-value mb-3">
                          {order.user.username} - {order.phone_number}
                        </p>

                        <p className="info-label">Địa chỉ</p>
                        <p className="info-value mb-0">{order.address}</p>
                      </div>
                    </div>

                    <div className="price-summary">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Tạm tính</span>
                        <span>
                          {order.payout_status === "paid"
                            ? "Đã Thanh Toán"
                            : order.total_amount.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Phí vận chuyển</span>
                        <span>Miễn phí</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">Tổng cộng</span>
                        <span className="fw-bold text-primary fs-5">
                          {order.payout_status === "paid"
                            ? "Đã Thanh Toán"
                            : order.total_amount.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="small text-muted mb-0">
                          <i className="bi bi-credit-card me-2"></i>Thanh toán
                          qua Thẻ tín dụng
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 d-grid gap-2">
                      <button
                        className="btn btn-primary py-2 fw-bold"
                        style={{ borderRadius: "10px" }}
                      >
                        Hỗ trợ đơn hàng
                      </button>
                      <button
                        className="btn btn-outline-secondary py-2"
                        style={{ borderRadius: "10px" }}
                      >
                        Tải hóa đơn (PDF)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-muted small">
                Bạn gặp vấn đề?{" "}
                <a href="#" className="text-primary text-decoration-none">
                  Liên hệ tổng đài 1900 1234
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
            .order-card {
            border: none;
            border-radius: 1.25rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
            background: #ffffff;
            overflow: hidden;
            margin-top: 2rem;
        }

        .order-header {
            background-color: #ffffff;
            border-bottom: 1px solid #f1f5f9;
            padding: 2rem;
        }

        .status-badge {
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .badge-pending { background-color: #fef3c7; color: #92400e; }
        .badge-shipping { background-color: #dbeafe; color: #1e40af; }
        .badge-success { background-color: #d1fae5; color: #065f46; }

        /* Progress Steps */
        .track-container {
            padding: 3rem 1rem;
        }

        .track-steps {
            display: flex;
            justify-content: bween;
            position: relative;
            width: 100%;
        }

        .track-steps::before {
            content: "";
            position: absolute;
            top: 25px;
            left: 0;
            height: 4px;
            width: 100%;
            background: #e2e8f0;
            z-index: 1;
        }

        .track-progress-bar {
            position: absolute;
            top: 25px;
            left: 0;
            height: 4px;
            width: 66%; /* Thay đổi giá trị này tùy theo tiến độ (33%, 66%, 100%) */
            background: var(--primary-color);
            z-index: 2;
            transition: width 0.4s ease;
        }

        .step-item {
            position: relative;
            z-index: 3;
            text-align: center;
            flex: 1;
        }

        .step-icon {
            width: 54px;
            height: 54px;
            background: #ffffff;
            border: 4px solid #e2e8f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 1.25rem;
            color: var(--text-muted);
            transition: all 0.3s ease;
        }

        .step-item.active .step-icon {
            border-color: var(--primary-color);
            color: var(--primary-color);
            background: #ffffff;
            box-shadow: 0 0 0 5px rgba(79, 70, 229, 0.1);
        }

        .step-item.completed .step-icon {
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: #ffffff;
        }

        .step-text {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-muted);
        }

        .step-item.active .step-text, .step-item.completed .step-text {
            color: var(--text-main);
        }

        /* Product List */
        .product-item {
            padding: 1.5rem 0;
            border-bottom: 1px solid #f1f5f9;
        }

        .product-item:last-child {
            border-bottom: none;
        }

        .product-img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 0.75rem;
            background-color: #f8fafc;
        }

        .info-label {
            color: var(--text-muted);
            font-size: 0.85rem;
            margin-bottom: 0.25rem;
        }

        .info-value {
            font-weight: 600;
            color: var(--text-main);
        }

        .price-summary {
            background-color: #f8fafc;
            border-radius: 1rem;
            padding: 1.5rem;
        }

        @media (max-width: 768px) {
            .track-steps {
                flex-direction: column;
                align-items: flex-start;
                padding-left: 2rem;
            }
            .track-steps::before, .track-progress-bar {
                left: 45px;
                top: 0;
                width: 4px;
                height: 100%;
            }
            .step-item {
                flex-direction: row;
                display: flex;
                align-items: center;
                margin-bottom: 2rem;
                text-align: left;
                width: 100%;
            }
            .step-icon {
                margin: 0 1.5rem 0 0;
            }
        }
        `}
      </style>
    </>
  );
};

export default OrderPageDetail;
