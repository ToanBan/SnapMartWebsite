"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import AlertError from "@/app/components/share/AlertError";
import styles from "../auth.module.css";
const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(1, "Tên không được để trống")
      .max(32, "Tên không được vượt quá 32 ký tự"),

    password: z
      .string()
      .min(9, "Mật khẩu phải có ít nhất 9 ký tự")
      .max(32, "Mật khẩu không được vượt quá 32 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một số")
      .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"),

    cfnpassword: z
      .string()
      .min(9, "Xác nhận mật khẩu phải có ít nhất 9 ký tự")
      .max(32, "Xác nhận mật khẩu không được vượt quá 32 ký tự"),
  })
  .refine((data) => data.password === data.cfnpassword, {
    path: ["cfnpassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

const RegisterPage = ({ message }: { message: string }) => {
  const [validationError, setValidationError] = useState<
    Record<string, string>
  >({});
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
    const result = RegisterSchema.safeParse(values);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0].toString()] = issue.message;
      });
      setValidationError(errors);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        body: formData,
        credentials: "include",
  
      });
      if(res.ok){
        window.location.href = "/login";
      }
      else{
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={`${styles.authPage} d-flex align-items-center justify-content-center`}>
        <div className={`${styles.authShell} row g-0`}>
          <div className={`${styles.brandPanel} d-none d-lg-flex col-lg-7 flex-column justify-content-between`}>
            <div className={styles.brandContent}>
              <Link href="/" className={styles.brandLink}>
                <span className={styles.brandMark}>S</span>
                <span>SnapMart</span>
              </Link>
            </div>
            <div className={styles.brandContent}>
              <span className={styles.brandEyebrow}>Start saving smarter</span>
              <h1 className={styles.brandTitle}>Tạo tài khoản để bắt đầu khám phá những điều bạn yêu thích.</h1>
              <p className={styles.brandDescription}>Đăng ký miễn phí để lưu sản phẩm, theo dõi đơn hàng và kết nối với cộng đồng SnapMart.</p>
            </div>
            <div className={`${styles.brandBenefits} ${styles.brandContent}`}>
              <p>Lợi ích ngay khi đăng ký</p>
              <ul>
                <li>Lưu sản phẩm yêu thích</li>
                <li>Theo dõi đơn hàng dễ dàng</li>
                <li>Không bỏ lỡ ưu đãi mới</li>
              </ul>
            </div>
          </div>

          {/* Right Form */}
          <div className={`${styles.formPanel} col-lg-5 d-flex align-items-center justify-content-center`}>
            <div className={styles.formCard}>
              <div className="text-center mb-4">
                <p className={styles.formEyebrow}>Join us</p>
                <h2 className={styles.formTitle}>Đăng ký</h2>
              </div>

              <form onSubmit={handleRegister}>
                
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={`${styles.authInput} form-control`}
                    id="username"
                    name="username"
                    placeholder="Tên của bạn"
                    required
                  />
                  <label htmlFor="username">Tên của bạn</label>
                  {validationError.username && (
                    <div className="text-danger mt-1">
                      {validationError.username}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className={`${styles.authInput} form-control`}
                    id="email"
                    name="email"
                    placeholder="Email của bạn"
                    required
                  />
                  <label htmlFor="email">Email của bạn</label>
                  {validationError.email && (
                    <div className="text-danger mt-1">
                      {validationError.email}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className={`${styles.authInput} form-control`}
                    id="password"
                    name="password"
                    placeholder="Mật khẩu"
                    required
                  />
                  <label htmlFor="password">Mật khẩu</label>
                  {validationError.password && (
                    <div className="text-danger mt-1">
                      {validationError.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-floating mb-4">
                  <input
                    type="password"
                    className={`${styles.authInput} form-control`}
                    id="cfnpassword"
                    name="cfnpassword"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                  <label htmlFor="cfnpassword">Nhập lại mật khẩu</label>
                  {validationError.cfnpassword && (
                    <div className="text-danger mt-1">
                      {validationError.cfnpassword}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="d-grid mb-3">
                  <button
                    className={`${styles.authPrimary} btn btn-primary btn-lg text-uppercase fw-bold`}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang đăng ký..." : "Sign Up"}
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className={`${styles.authLink} text-decoration-none fw-semibold`}
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {error && <AlertError message="Đăng ký thất bại, vui lòng thử lại" />}
    </>
  );
};

export default RegisterPage;
