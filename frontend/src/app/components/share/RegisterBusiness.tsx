"use client";
import React, { useState } from "react";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";
import { set } from "zod";
//ts-ignore
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const RegisterBusiness = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleRegisterBusiness = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const res = await fetch("http://localhost:5000/api/business/register", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        AlertSuccess({ message: "Đăng ký doanh nghiệp thành công!" });
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
        window.location.href = data.onboardingUrl;
      } else {
        setError(true);
        AlertError({ message: "Đăng ký doanh nghiệp thất bại!" });
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      console.log("Đăng ký doanh nghiệp thất bại:", error);
      return;
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="modalRegisterBusiness"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">
                🏢 Đăng ký doanh nghiệp / cửa hàng
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleRegisterBusiness}>
                {/* Tên doanh nghiệp */}
                <div className="row mb-3 align-items-center">
                  <label
                    htmlFor="businessName"
                    className="col-sm-3 col-form-label"
                  >
                    Tên doanh nghiệp
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="row mb-3 align-items-center">
                  <label htmlFor="address" className="col-sm-3 col-form-label">
                    Địa chỉ
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      id="address"
                      className="form-control"
                      name="address"
                      required
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="row mb-3 align-items-center">
                  <label htmlFor="phone" className="col-sm-3 col-form-label">
                    Số điện thoại
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="tel"
                      id="phone"
                      className="form-control"
                      name="phone"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label htmlFor="email" className="col-sm-3 col-form-label">
                    Số điện thoại
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      name="email"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label htmlFor="taxCode" className="col-sm-3 col-form-label">
                    Mã Số Thuế
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      id="taxCode"
                      className="form-control"
                      name="taxCode"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label htmlFor="bankName" className="col-sm-3 col-form-label">
                    Tên Ngân Hàng
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      id="bankName"
                      className="form-control"
                      name="bankName"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label htmlFor="bankNumber" className="col-sm-3 col-form-label">
                    Số Tài Khoản Ngân Hàng
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      id="bankNumber"
                      className="form-control"
                      name="bankNumber"
                      required
                    />
                  </div>
                </div>

                {/* Logo / Hình ảnh cửa hàng */}
                <div className="row mb-3 align-items-center">
                  <label htmlFor="logo" className="col-sm-3 col-form-label">
                    Logo / Ảnh cửa hàng
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="file"
                      id="logo"
                      className="form-control"
                      name="logo"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label htmlFor="licence" className="col-sm-3 col-form-label">
                    Giấy phép kinh doanh
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="file"
                      id="licence"
                      className="form-control"
                      name="licence"
                      required
                    />
                  </div>
                </div>

                {/* Mô tả doanh nghiệp */}
                <div className="row mb-3 align-items-center">
                  <label
                    htmlFor="description"
                    className="col-sm-3 col-form-label"
                  >
                    Mô tả
                  </label>
                  <div className="col-sm-9">
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      rows={3}
                      placeholder="Giới thiệu ngắn gọn về cửa hàng, sản phẩm, dịch vụ..."
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" data-bs-dismiss="modal">
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-success">
                    Đăng ký doanh nghiệp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {success && <AlertSuccess message="Đăng ký doanh nghiệp thành công!" />}
      {error && <AlertError message="Đăng ký doanh nghiệp thất bại!" />}
    </>
  );
};

export default RegisterBusiness;
