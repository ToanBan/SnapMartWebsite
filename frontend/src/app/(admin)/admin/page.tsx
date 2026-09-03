"use client";

import React, { useEffect, useState } from "react";
import Dashboard from "@/app/components/Dashboard";
const DashboardPage = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/revenue`,
          { credentials: "include", cache: "no-store" },
        );

        if (response.status === 401 || response.status === 403) {
          setHasAccess(false);
          return;
        }
        if (!response.ok) throw new Error("Failed to load admin dashboard");

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">Đang tải trang quản trị...</p>
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="container py-5 text-center">
        <h1>Không có quyền truy cập</h1>
        <p className="text-muted">Vui lòng đăng nhập bằng tài khoản admin.</p>
      </main>
    );
  }

  return <Dashboard data={data || {}} isAdmin />;
};

export default DashboardPage;
