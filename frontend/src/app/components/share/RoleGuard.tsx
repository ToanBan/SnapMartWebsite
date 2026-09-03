"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const RoleGuard = ({
  role,
  children,
}: {
  role: "admin" | "business";
  children: React.ReactNode;
}) => {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">(
    "loading",
  );

  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/role`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          setStatus("denied");
          return;
        }

        const data = await response.json();
        setStatus(data.message === role ? "allowed" : "denied");
      } catch (error) {
        console.error("Role check failed:", error);
        setStatus("denied");
      }
    };

    checkRole();
  }, [role]);

  if (status === "loading") {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">Đang kiểm tra quyền truy cập...</p>
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main className="container py-5 text-center">
        <h1>Không có quyền truy cập</h1>
        <p className="text-muted">Tài khoản của bạn không được phép xem trang này.</p>
        <Link href="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </main>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
