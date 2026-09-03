"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faBuilding,
  faBox,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@/hooks/useUser";
const LoginPartial = () => {
  const { account, isLoading, isError, mutate } = useUser();
  const [role, setRole] = useState("");
  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        mutate(null, false);
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/send-verification-otp`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (res.ok) {
        window.location.href = "/verify"; // Redirect to verification page
      }
    } catch (error) {
      console.error("Error sending verification OTP:", error);
    }
  };

  useEffect(() => {
    const roleUser = localStorage.getItem("role");
    if (!roleUser) return;
    setRole(roleUser);
  });

  return (
    <>
      {account ? (
        <div className="dropdown user-dropdown me-3">
          <span
            className="dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ cursor: "pointer" }}
          >
            {account.username}
          </span>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <Link className="dropdown-item" href={"/profile"}>
                <FontAwesomeIcon icon={faUser} className="me-2 text-info" /> Hồ
                sơ
              </Link>
            </li>

            <li>
              <Link className="dropdown-item" href={"/orders"}>
                <FontAwesomeIcon icon={faBox} className="me-2 text-info" /> Đơn Hàng
              </Link>
            </li>

            {role == "business" && (
              <li>
                <Link className="dropdown-item" href={"/business"}>
                  <FontAwesomeIcon icon={faBuilding} className="me-2 text-info" />{" "}
                  Business
                </Link>
              </li>
            )}

            {!account.is_verified && ( // Show verify email button if not verified
              <li>
                <button
                  onClick={handleVerifyEmail}
                  className="dropdown-item"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="me-2 text-info" />
                  Verify email
                </button>
              </li>
            )}

            <li>
              <button
                onClick={handleLogout}
                className="dropdown-item text-danger"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <Link
          className="d-flex align-items-center ms-3 text-decoration-none"
          href={"/login"}
        >
          <Image
            src="https://cdn-icons-png.flaticon.com/128/15494/15494722.png"
            width={28}
            height={28}
            alt="login"
          />
          <p className="m-0 ms-2">Tài khoản</p>
        </Link>
      )}
    </>
  );
};

export default LoginPartial;
