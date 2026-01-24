"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import AlertError from "@/app/components/share/AlertError";
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
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        body: formData,
        credentials: "include",
  
      });
      if(res.ok){
        window.location.href = "/verify";
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
    }
  };

  return (
    <>
      <div
        className="container-fluid min-vh-100 d-flex align-items-center justify-content-center position-relative"
        style={{ backgroundColor: "#fefae0" }}
      >
        <div
          className="row w-100 h-75 g-0 overflow-hidden shadow"
          style={{ borderRadius: "12px", maxWidth: "1100px" }}
        >
          <div className="d-none d-md-block col-md-6 position-relative p-0">
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <Image
                src="https://img.freepik.com/premium-vector/handsome-boy-saying-hello-comic-bubble-speech_33070-5613.jpg?ga=GA1.1.262810338.1745506426&semt=ais_hybrid&w=740"
                alt="register-image"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-start"
                priority
              />
            </div>
          </div>

          {/* Right Form */}
          <div
            className="col-md-6 d-flex align-items-center justify-content-center bg-white"
            style={{ padding: "40px" }}
          >
            <div className="w-100 px-4" style={{ maxWidth: "400px" }}>
              <h2 className="text-center fw-bold mb-4">Create Your Account</h2>

              <form onSubmit={handleRegister}>
                
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="btn btn-primary btn-lg text-uppercase fw-bold"
                    type="submit"
                  >
                    Sign Up
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-decoration-none fw-semibold"
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
