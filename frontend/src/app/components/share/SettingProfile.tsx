"use client";
import React, { useEffect, useState } from "react";
import { User, Briefcase, Lock, Settings } from "lucide-react";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";
import { useUser } from "@/hooks/useUser";
import { z } from "zod";
import RegisterBusiness from "./RegisterBusiness";
const ChangePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(9, "Mật khẩu phải có ít nhất 9 ký tự")
      .max(32, "Mật khẩu không được vượt quá 32 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một số")
      .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"),
    confirmNewPassword: z
      .string()
      .min(9, "Xác nhận mật khẩu phải có ít nhất 9 ký tự")
      .max(32, "Xác nhận mật khẩu không được vượt quá 32 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["cfnpassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

const SettingProfile = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState<
    Record<string, string>
  >({});
  const { account, isLoading, isError, mutate } = useUser();
  useEffect(() => {
    //@ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      const offcanvasElement = document.getElementById("offcanvasSettings");
      const offcanvas = new bootstrap.Offcanvas(offcanvasElement);

      const modals = [
        "modalEditProfile",
        "modalRegisterBusiness",
        "modalChangePassword",
      ];

      modals.forEach((modalId) => {
        const modalElement = document.getElementById(modalId);
        modalElement?.addEventListener("show.bs.modal", () => {
          offcanvas.hide();
        });
      });
    });
  }, []);

  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("http://localhost:5000/api/user/edit", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        console.log("API response", data.message)
        mutate(data.message, true);
        setMessage("Chỉnh Sửa Hồ Sơ Thành Công");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setMessage("Chỉnh Sửa Hồ Sơ Thất Bại");
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    const result = ChangePasswordSchema.safeParse(values);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0].toString()] = issue.message;
      });
      setValidationError(errors);
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/change-password",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      if (res.ok) {
        setMessage("Đổi Mật Khẩu Thành Công");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setMessage("Đổi Mật Khẩu Thất Bại");
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <>
      <button
        className="btn btn-outline-secondary"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasSettings"
        aria-controls="offcanvasSettings"
      >
        <Settings className="me-2" size={18} />
        Cài Đặt
      </button>

      <div
        className="offcanvas offcanvas-end shadow"
        tabIndex={-1}
        id="offcanvasSettings"
        aria-labelledby="offcanvasSettingsLabel"
        style={{ width: "320px" }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 id="offcanvasSettingsLabel" className="fw-bold">
            ⚙️ Cài đặt tài khoản
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <ul className="list-group list-group-flush">
            {/* Chỉnh sửa hồ sơ */}
            <li
              className="list-group-item list-group-item-action d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#modalEditProfile"
              style={{ cursor: "pointer" }}
            >
              <User className="me-2 text-primary" size={20} />
              Chỉnh sửa hồ sơ
            </li>

            {/* Đăng ký doanh nghiệp */}
            <li
              className="list-group-item list-group-item-action d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#modalRegisterBusiness"
              style={{ cursor: "pointer" }}
            >
              <Briefcase className="me-2 text-success" size={20} />
              Đăng ký doanh nghiệp
            </li>

            {/* Đổi mật khẩu */}
            <li
              className="list-group-item list-group-item-action d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#modalChangePassword"
              style={{ cursor: "pointer" }}
            >
              <Lock className="me-2 text-warning" size={20} />
              Đổi mật khẩu
            </li>
          </ul>
        </div>
      </div>

      {/* Modal: Chỉnh sửa hồ sơ */}
      <div
        className="modal fade"
        id="modalEditProfile"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">✏️ Chỉnh sửa hồ sơ</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditProfile}>
                <div className="row mb-3 align-items-center">
                  <label htmlFor="username" className="col-sm-3 col-form-label">
                    Username
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label htmlFor="avatar" className="col-sm-3 col-form-label">
                    Avatar
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="file"
                      className="form-control"
                      id="avatar"
                      name="avatar"
                    />
                  </div>
                </div>

                <div className="row mb-3 align-items-center">
                  <label
                    htmlFor="description"
                    className="col-sm-3 col-form-label"
                  >
                    Description
                  </label>
                  <div className="col-sm-9">
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      className="form-control"
                    ></textarea>
                  </div>
                </div>

                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu thay đổi
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Đăng ký doanh nghiệp */}
      <RegisterBusiness />

      {/* Modal: Đổi mật khẩu */}
      <div
        className="modal fade"
        id="modalChangePassword"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0 rounded-3">
            {/* Header */}
            <div className="modal-header bg-warning bg-opacity-10 border-0">
              <h5 className="modal-title fw-bold text-warning">
                🔑 Đổi mật khẩu
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <form onSubmit={handleChangePassword}>
                {/* Mật khẩu hiện tại */}
                <div className="row mb-3 align-items-center">
                  <label
                    htmlFor="currentPassword"
                    className="col-sm-4 col-form-label"
                  >
                    Mật khẩu hiện tại
                  </label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock-fill text-muted"></i>
                      </span>
                      <input
                        type="password"
                        id="currentPassword"
                        className="form-control"
                        placeholder="Nhập mật khẩu hiện tại"
                        name="currentPassword"
                      />
                    </div>
                  </div>
                </div>

                {/* Mật khẩu mới */}
                <div className="row mb-3 align-items-center">
                  <label
                    htmlFor="newPassword"
                    className="col-sm-4 col-form-label"
                  >
                    Mật khẩu mới
                  </label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-key-fill text-muted"></i>
                      </span>
                      <input
                        type="password"
                        id="newPassword"
                        className="form-control"
                        placeholder="Nhập mật khẩu mới"
                        name="newPassword"
                      />
                    </div>
                  </div>

                  {validationError.newPassword && (
                    <div className="invalid-feedback d-block">
                      {validationError.newPassword}
                    </div>
                  )}
                </div>

                {/* Nhập lại mật khẩu */}
                <div className="row mb-3 align-items-center">
                  <label
                    htmlFor="confirmPassword"
                    className="col-sm-4 col-form-label"
                  >
                    Nhập lại mật khẩu
                  </label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-shield-lock-fill text-muted"></i>
                      </span>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        className="form-control"
                        placeholder="Xác nhận mật khẩu mới"
                        name="confirmNewPassword"
                      />
                    </div>
                  </div>

                   {validationError.confirmNewPassword && (
                    <div className="invalid-feedback d-block">
                      {validationError.confirmNewPassword}
                    </div>
                  )}
                </div>

                <button className="btn btn-secondary">
                  Hủy
                </button>
                <button className="btn btn-warning text-white">
                  Đổi mật khẩu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {success && <AlertSuccess message={message} />}
      {error && <AlertError message={message} />}
    </>
  );
};

export default SettingProfile;
