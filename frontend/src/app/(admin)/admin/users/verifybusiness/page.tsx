"use client";
import React, { use, useEffect, useState } from "react";
import SidebarPage from "@/app/components/share/Sidebar";
import { s } from "framer-motion/client";
import Image from "next/image";
import AlertSuccess from "@/app/components/share/AlertSuccess";
import AlertError from "@/app/components/share/AlertError";
import SendNotification from "@/app/api/users/SendNotification";
interface Business {
  id: string;
  userId: string;
  businessName: string;
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  stripeReady: boolean;
}

const VerifyBusiness = () => {
  const [businesses, setBusinesses] = React.useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | "">("");
  const [success, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const [condition, setCondition] = useState(false);
  const imageUrl = "http://localhost:5000/uploads/";

  useEffect(() => {
    if (typeof window !== "undefined" && selectedBusiness) {
      //@ts-ignore
      import("bootstrap/dist/js/bootstrap.bundle.min.js").then(({ Modal }) => {
        const modalEl = document.getElementById("detailModalStatic");
        if (modalEl) {
          const modal = new Modal(modalEl);
          modal.show();
        }
      });
    }
  }, [selectedBusiness]);

  const closeModal = () => {
    const modalEl = document.getElementById("detailModalStatic");
    if (modalEl) {
      //@ts-ignore
      import("bootstrap/dist/js/bootstrap.bundle.min.js").then(({ Modal }) => {
        const modal = Modal.getInstance(modalEl);
        if (modal) {
          modal.hide();
          // Đợi animation hide kết thúc (khoảng 150-300ms) rồi mới unmount để tránh backdrop bị kẹt
          setTimeout(() => {
            setSelectedBusiness("");
          }, 300);
        } else {
          setSelectedBusiness("");
        }
      });
    } else {
      setSelectedBusiness("");
    }
  };

  const GetVerifyBusinesses = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/verify-businesses",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
      if (Array.isArray(data.message)) {
        setBusinesses(data.message);
      } else {
        console.warn("Dữ liệu trả về không phải là mảng:", data.message);
        setBusinesses([]);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setBusinesses([]);
    }
  };

  const handleVerifyBusiness = async (businessId: string, status: string) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/verify-business",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ businessId, status }),
        }
      );

      if (res.status === 200) {
        const data = await res.json();
        SendNotification(data.userId, "RESPONSE_BUSINESS", `ADMIN ĐÃ ${data.status}`)
        setSucess(true);
        setTimeout(() => {
          setSucess(false);
        }, 3000);
        GetVerifyBusinesses();
        // Đóng modal đúng cách
        closeModal();
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
        // Đóng modal sau khi xử lý thất bại (tùy chọn, có thể bỏ nếu muốn giữ modal mở để thử lại)
        closeModal();
      }
    } catch (error) {
      console.error("Error verifying business:", error);
      // Đóng modal ngay cả khi có lỗi fetch
      closeModal();
      return;
    }
  };

  useEffect(() => {
    GetVerifyBusinesses();
  }, []);

  return (
    <>
      <style>
        {`
            .btn-primary, .bg-primary {
            --bs-btn-bg: #4f46e5;
            --bs-btn-border-color: #4f46e5;
            --bs-btn-hover-bg: #4338ca;
            --bs-btn-hover-border-color: #4338ca;
            --bs-btn-focus-shadow-rgb: 79, 70, 229;
            --bs-bg-opacity: 1;
            background-color: #4f46e5 !important; 
        }
        .text-primary {
            color: #4f46e5 !important;
        }

        /* Hiệu ứng hover cho Card */
        .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .card {
            transition: all 0.3s ease;
        }

        /* Đảm bảo nội dung trong modal có thể cuộn */
        .modal-body-content {
            overflow-y: auto;
            max-height: calc(90vh - 180px); /* 90vh trừ đi chiều cao header và footer */
        }
            `}
      </style>

      <div className="container-xl py-5">
        <div className="d-flex">
          <div className="container py-5">
            <div
              id="business-list"
              className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
            >
              {businesses.length === 0 ? (
                <p className="text-center text-muted">
                  Không có doanh nghiệp nào cần xác minh.
                </p>
              ) : (
                businesses.map((business) => (
                  <div className="col" key={business.id}>
                    <div className="card h-100 shadow-lg border-0 rounded-4">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3 border-bottom pb-3">
                          <div className="flex-shrink-0 me-3">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 shadow-sm"
                              style={{ width: "64px", height: "64px" }}
                            >
                              AT
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h3 className="fs-5 fw-bold text-dark mb-0">
                              {business.businessName}
                            </h3>
                            <p className="text-muted small mb-0">
                              Hồ sơ chờ duyệt
                            </p>
                          </div>
                        </div>

                        <div className="mb-4 text-secondary">
                          <div className="d-flex align-items-start mb-2">
                            <i className="bi bi-geo-alt-fill me-3 mt-1 text-primary"></i>
                            <span className="flex-grow-1">
                              {business.address}
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-telephone-fill me-3 text-primary"></i>
                            <span>{business.phone}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedBusiness(business)}
                          type="button"
                          className="btn btn-outline-primary w-100 fw-medium d-flex align-items-center justify-content-center shadow-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#detailModalStatic"
                        >
                          <i className="bi bi-search me-2"></i>
                          Xem Chi Tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedBusiness && (
            <div
              className="modal fade"
              id="detailModalStatic"
              tabIndex={-1}
              aria-labelledby="detailModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content rounded-4 shadow-lg">
                  <div className="modal-header bg-light border-bottom rounded-top-4">
                    <h2
                      className="modal-title fs-4 fw-bold text-primary"
                      id="detailModalLabel"
                    >
                      Thông Tin Chi Tiết Doanh Nghiệp
                    </h2>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={closeModal}
                    ></button>
                  </div>

                  <div className="modal-body p-4 modal-body-content">
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <h3 className="fs-5 fw-semibold mb-3 text-secondary border-bottom pb-2">
                          Thông Tin Chung
                        </h3>

                        <div className="mb-3">
                          <p className="mb-1 text-muted small fw-semibold">
                            Điều kiện
                          </p>

                          <span
                            className={`badge px-3 py-2 fs-6 ${
                              selectedBusiness.stripeReady
                                ? "bg-success-subtle text-success border border-success"
                                : "bg-danger-subtle text-danger border border-danger"
                            }`}
                            style={{ borderRadius: "12px" }}
                          >
                            {selectedBusiness.stripeReady
                              ? "✔ Đủ điều kiện"
                              : "✖ Chưa đủ điều kiện"}
                          </span>
                        </div>

                        <div className="mb-3">
                          <p className="mb-0 text-muted small">
                            Tên Doanh Nghiệp:
                          </p>
                          <p className="fs-5 fw-bold text-dark">
                            {selectedBusiness.businessName}
                          </p>
                        </div>

                        <div className="mb-3">
                          <p className="mb-0 text-muted small">Mã Số Thuế:</p>
                          <p className="fs-5 fw-semibold text-dark">
                            {selectedBusiness.taxCode}
                          </p>
                        </div>

                        <div className="mb-3">
                          <p className="mb-0 text-muted small">
                            Số Điện Thoại:
                          </p>
                          <p className="fs-5 text-dark">
                            {selectedBusiness.phone}
                          </p>
                        </div>

                        <div className="mb-3">
                          <p className="mb-0 text-muted small">Email:</p>
                          <p className="fs-5 text-dark">
                            {selectedBusiness.email}
                          </p>
                        </div>

                        <div className="mb-3">
                          <p className="mb-0 text-muted small">Địa Chỉ:</p>
                          <p className="fs-5 text-dark">
                            {selectedBusiness.address}
                          </p>
                        </div>

                        <div className="mb-3">
                          <p className="mb-0 text-muted small">Mô Tả:</p>
                          <p className="text-secondary">
                            {selectedBusiness.description}
                          </p>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <h3 className="fs-5 fw-semibold mb-3 text-secondary border-bottom pb-2">
                          Hình Ảnh Giấy Phép Kinh Doanh
                        </h3>
                        <div
                          className="w-100 bg-light border border-dashed border-secondary-subtle rounded-3 d-flex flex-column align-items-center justify-content-center p-3"
                          style={{ height: "380px" }}
                        >
                          <Image
                            src={`${imageUrl}${selectedBusiness.logo}`}
                            alt="avatar-profile"
                            width={250}
                            height={250}
                            className="img-fluid rounded shadow-sm w-100 h-100 object-fit-cover"
                          />
                        </div>
                        <p className="mt-2 text-muted small text-center">
                          Tài liệu đã được quét và tải lên hệ thống.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer p-4 bg-light d-flex justify-content-end gap-3 rounded-bottom-4 border-top">
                    <button
                      onClick={() =>
                        handleVerifyBusiness(selectedBusiness.id, "rejected")
                      }
                      type="button"
                      className="btn btn-outline-danger btn-lg shadow-sm"
                    >
                      <i className="bi bi-x-circle-fill me-2"></i> Từ Chối
                    </button>
                    <button
                      onClick={() =>
                        handleVerifyBusiness(selectedBusiness.id, "approval")
                      }
                      type="button"
                      className="btn btn-success btn-lg shadow-sm"
                    >
                      <i className="bi bi-check-circle-fill me-2"></i> Chấp Nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {success && <AlertSuccess message="Xác minh doanh nghiệp thành công!" />}
      {error && <AlertError message="Xác minh doanh nghiệp thất bại!" />}
    </>
  );
};

export default VerifyBusiness;
