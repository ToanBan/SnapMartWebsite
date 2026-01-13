"use client";

import React, { useEffect, useState } from "react";
import AlertSuccess from "@/app/components/share/AlertSuccess";
import AlertError from "@/app/components/share/AlertError";
const VerifyPage = () => {
  const [otp, setOtp] = React.useState<string[]>(Array(6).fill(""));
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpValue = otp.join("");

    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpValue }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.feautes === "verifyRegister") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          window.location.href = "/login";
        }, 3000);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          window.location.href = "/resetpassword";
        }, 3000);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return;
    }
  };

  const SaveOTP = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center min-vh-100"
        style={{ backgroundColor: "#fefae0" }}
      >
        <div className="otp-container">
          <h2>Verify Register</h2>
          <p>Please enter the 6-digit OTP sent to your email</p>
          <form onSubmit={handleVerifyOTP}>
            <div className="input-group mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className="otp-input"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => SaveOTP(index, e.target.value)}
                  required
                />
              ))}
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Verify OTP
            </button>
          </form>
          <p className="mt-3">
            Didn't receive the OTP? <a href="#">Resend OTP</a>
          </p>
        </div>
      </div>

      {success && <AlertSuccess message="Xác thực thành công" />}
      {error && <AlertError message="Xác thực thất bại, vui lòng thử lại" />}
    </>
  );
};

export default VerifyPage;
