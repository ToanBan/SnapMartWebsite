"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AlertError from "@/app/components/share/AlertError";
import styles from "../auth.module.css";
const LoginPage = () => {
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("role", data.role);
        window.location.href = "/";
      } else {
        console.log(data);
        setError(true);
        setTimeout(() => setError(false), 3000);
      }
    } catch (requestError) {
      console.error(requestError);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirectGoogle = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/google`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status !== 200) {
        throw new Error("Không thể chuyển đến Google");
      }
      const data = await res.json();
      window.location.href = data.message;
    } catch (requestError) {
      console.error(requestError);
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
              <span className={styles.brandEyebrow}>Shop smarter</span>
              <h1 className={styles.brandTitle}>Khám phá sản phẩm, kết nối và mua sắm theo cách của bạn.</h1>
              <p className={styles.brandDescription}>Đăng nhập để theo dõi đơn hàng, lưu sản phẩm yêu thích và không bỏ lỡ những ưu đãi phù hợp.</p>
            </div>
            <div className={`${styles.brandStats} ${styles.brandContent}`}>
              <div className={styles.brandStat}><strong>24/7</strong><span>Trải nghiệm</span></div>
              <div className={styles.brandStat}><strong>Hot</strong><span>Ưu đãi mới</span></div>
              <div className={styles.brandStat}><strong>100%</strong><span>Kết nối</span></div>
            </div>
          </div>

          <div className={`${styles.formPanel} col-lg-5 d-flex align-items-center justify-content-center`}>
            <div className={styles.formCard}>
              <div className="text-center mb-4">
                <p className={styles.formEyebrow}>Welcome back</p>
                <h2 className={styles.formTitle}>Đăng nhập</h2>
              </div>
              <form onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className={`${styles.authInput} form-control`}
                    id="email"
                    name="email"
                    placeholder="Email của bạn"
                    required
                  />
                  <label htmlFor="email">Email address</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className={`${styles.authInput} form-control`}
                    id="password"
                    name="password"
                    placeholder="Mật khẩu"
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberPasswordCheck"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="rememberPasswordCheck"
                  >
                    Remember me
                  </label>
                </div>

                <div className="d-grid mb-3">
                  <button
                    className={`${styles.authPrimary} btn btn-primary btn-lg text-uppercase fw-bold`}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang đăng nhập..." : "Sign in"}
                  </button>
                </div>

                <div className={`${styles.authDivider} d-flex align-items-center my-4`}>
                  <div className="flex-grow-1 border-top"></div>
                  <span className="mx-2">or</span>
                  <div className="flex-grow-1 border-top"></div>
                </div>

                <div className="d-grid mb-4">
                  <button
                    onClick={handleRedirectGoogle}
                    type="button"
                    disabled={isSubmitting}
                    className={`${styles.authGoogle} btn btn-lg d-flex align-items-center justify-content-center gap-2`}
                  >
                    <Image
                      src="https://cdn-icons-png.flaticon.com/128/300/300221.png"
                      alt="Google icon"
                      width={20}
                      height={20}
                    />
                    Sign in with Google
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p className="mb-1">
                    Don’t have an account?{" "}
                    <Link href="/register" className={`${styles.authLink} text-decoration-none`}>
                      Register Here
                    </Link>
                  </p>
                  <p>
                    <Link href="/forgot" className={`${styles.authLink} text-decoration-none`}>
                      Forgot password?
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {error && <AlertError message="Đăng Nhập Thất Bại, Vui Lòng Thử Lại" />}
    </>
  );
};

export default LoginPage;
